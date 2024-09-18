const CACHE_NAME = 'vale-shop-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/js/main.js',
    '/assets/image/1718592874b9c9c0c994cf60c986ca33039442ed67_thumbnail_336x.webp',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    // Agrega aquí cualquier otro recurso que necesite ser cacheado
];

self.addEventListener('install', event => {
    caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
});

self.addEventListener('fetch', event => {
    caches.match(event.request)
        .then(response => {
            if (response) {
                return response; // Devuelve el recurso del cache si está disponible
            }
            return fetch(event.request); // De lo contrario, realiza una solicitud de red
        })
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.map(cacheName => {
                if (cacheWhitelist.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            })
        );
    })
});
