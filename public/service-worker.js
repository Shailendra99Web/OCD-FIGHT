const CACHE_NAME = 'ocd-fight-cache-v1';
const urlsToCache = [
    '/',  // Cache the root path
    '/about',  // Cache about page
    '/history',  // Cache history page
    '/reset',  // Cache reset page
    '/setIntervals',  // Cache set intervals page
    '/Navbar',// Component
    '/MainCounter',// Component
    '/IntervalWrapper',// Component
    '/Footer',// Component
    '/favicon.ico',  // Cache favicon
    '/manifest.json',  // Cache the PWA manifest
    '/styles/globals.css' //CSS
    // Add other assets like images, CSS, JS files
];

// Install the service worker and cache the necessary files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch cached content when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached file or fetch the resource from the network
                return response || fetch(event.request);
            })
    );
});

// Update the service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
