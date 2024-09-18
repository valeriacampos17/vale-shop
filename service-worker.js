const CACHE_NAME = 'vale-shop-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/products.html',
    '/orders.html',
    '/like.html',
    '/assets/css/main.css',
    '/assets/css/info.css',
    '/assets/css/modal.css',
    '/assets/css/orders.css',
    '/assets/css/products.css',
    '/assets/js/main.js',
    '/assets/js/modal.js',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
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
                return response;
            }
            return fetch(event.request);
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
