const CACHE_NAME = 'vale-shop-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/products.html',
    '/orders.html',
    '/like.html',
    '/assets/css/info.css',
    '/assets/css/main.css',
    '/assets/css/modal.css',
    '/assets/css/orders.css',
    '/assets/css/products.css',
    '/assets/css/skeleton.css',
    '/assets/js/main.js',
    '/assets/js/modal.js',
    '/assets/js/orders.js',
    '/assets/js/products.js',
    '/assets/icons/icon-120x120.png',
    '/assets/icons/icon-167x167.png',
    '/assets/icons/icon-180x180.png',
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

self.addEventListener('push', (e) => {
    const data = e.data.json();
    console.log('data >>> ', data);
    const notificationTitle = data.title;
    const notificationOptions = {
        body: data.message,
        icon: 'assets/icons/icon-120x120.png',
        vibrate: [125, 75, 125, 275, 200, 275, 125, 75, 125, 275, 200, 600, 200, 600],
        data: {
            url: data.link,
        },
        actions: [{ action: 'open', title: 'Open' }],
    };
    return new Promise((resolve, reject) => {
        self.registration.showNotification(notificationTitle, notificationOptions);
        // channel.postMessage(data);
    });
});