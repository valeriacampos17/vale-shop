const CACHE_NAME = 'vale-shop-cache-v1';

// Usamos rutas relativas para que funcione en cualquier servidor
const urlsToCache = [
    './',
    './index.html',
    './products.html',
    './orders.html',
    './settings.html',
    './signin.html',
    './signup.html',
    './manifest.json',
    './assets/css/main.css',
    './assets/css/products.css',
    './assets/css/orders.css',
    './assets/css/settings.css',
    './assets/css/auth.css',
    './assets/css/modal.css',
    './assets/css/hearts.css',
    './assets/css/info.css',
    './assets/css/skeleton.css',
    './assets/js/main.js',
    './assets/js/products.js',
    './assets/js/orders.js',
    './assets/js/settings.js',
    './assets/js/signin.js',
    './assets/js/signup.js',
    './assets/js/modal.js',
    './assets/js/hearts.js',
    './assets/js/cart-highlight.js',
    './assets/js/firebase.js',
    './assets/js/table.js',
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png',
    './assets/icons/icon-180x180.png',
    './assets/icons/products-shortcut.png',
    './assets/icons/orders-shortcut.png',
    './assets/image/footer.png',
    './assets/image/love_like_heart_icon_196980.webp'
];

// Instalación
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Abriendo caché y añadiendo recursos');
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Activación
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
    // Ignorar peticiones a firebase y otros dominios externos
    if (event.request.url.includes('firebase') ||
        event.request.url.includes('googleapis') ||
        event.request.url.includes('cloudflare')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                // Fallback para cuando no hay conexión
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// Push Notifications
self.addEventListener('push', (e) => {
    if (!(self.registration && self.registration.showNotification)) return;

    const data = e.data ? e.data.json().notification : {};
    const notificationTitle = data.title || 'Vale-Shop';
    const notificationOptions = {
        body: data.body || 'Tienes una nueva actualización.',
        icon: './assets/icons/icon-120x120.png',
        badge: './assets/icons/icon-120x120.png',
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