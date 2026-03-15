const CACHE_NAME = 'vale-shop-cache-v1';

// Usamos rutas relativas (./) para que funcione correctamente en la subcarpeta /vale-shop/
const urlsToCache = [
    './',
    './index.html',
    './products.html',
    './orders.html',
    './orders.html',
    './assets/css/info.css',
    './assets/css/main.css',
    './assets/css/modal.css',
    './assets/css/orders.css',
    './assets/css/products.css',
    './assets/css/skeleton.css',
    './assets/js/main.js',
    './assets/js/modal.js',
    './assets/js/orders.js',
    './assets/js/products.js',
    './assets/icons/icon-120x120.png',
    './assets/icons/icon-167x167.png',
    './assets/icons/icon-180x180.png',
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png',
];

// Instalación: Almacena en caché y fuerza la espera
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Abriendo caché y añadiendo recursos');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Activación: Limpieza de cachés antiguas
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia de carga: Cache First con fallback a red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Devuelve la respuesta de caché si existe, si no, busca en la red
            return response || fetch(event.request);
        })
    );
});

// Evento Push para Notificaciones
self.addEventListener('push', (e) => {
    if (!(self.registration && self.registration.showNotification)) return;

    const data = e.data ? e.data.json().notification : {};
    const notificationTitle = data.title || 'Vale-Shop';
    const notificationOptions = {
        body: data.body || 'Tienes una nueva actualización.',
        icon: 'assets/icons/icon-120x120.png',
        badge: 'assets/icons/icon-120x120.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.link || './',
        },
        actions: [{ action: 'open', title: 'Ver' }],
    };

    e.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
});