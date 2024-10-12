const CACHE_NAME = 'ocd-fight-cache-v1';
const urlsToCache = [
    '/',  // Cache the root path
    '/about',  // Cache about page
    '/history',  // Cache history page
    '/reset',  // Cache reset page
    '/setIntervals',  // Cache set intervals page
    '/favicon.ico',  // Cache favicon
    '/manifest.json',  // Cache the PWA manifest
    '/styles/globals.css', //CSS
    // Add other assets like images, CSS, JS files

    //chucks
    '/_next/static/chunks/69-8ff80f61951c0556.js',
    '/_next/static/chunks/250-149fe57f894acf51.js',
    '/_next/static/chunks/828-a662267cb993e4fd.js',
    '/_next/static/chunks/972-0127bc70cf250ccc.js',
    '/_next/static/chunks/fd9d1056-6224f41d1be9f49a.js',
    '/_next/static/chunks/main-app-f5c8d25c8479457f.js',
    '/_next/static/chunks/webpack-b411a4705cc9a058.js',
    //chucks/app/
    '/_next/static/chunks/layout-2b7c6cb0c79b23c9.js',
    '/_next/static/chunks/page-ffd3cf58679591db.js',
    //chucks/.../about, history, reset, setIntervals
    '/_next/static/chunks/app/about/page-4fa3bf8575ad3176.js',
    '/_next/static/chunks/app/about/page-594ba29b783cb0cd.js',
    '/_next/static/chunks/app/about/page-3f36842c254d91da.js',
    '/_next/static/chunks/app/about/page-6bb48527503efd80.js',
    
    //static/css
    '/_next/static/css/45a561a26e29e1ae.css',
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
