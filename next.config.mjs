import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,            // Enable SWC minification for improved performance
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development"     // Remove console.log in production
    }
};

// export default nextConfig;

export default withPWA({
    dest: "public",         // destination directory for the PWA files
    runtimeCaching: [
        // {
        //     urlPattern: /^https:\/\/your-api-url\.com\/.*$/,
        //     handler: 'NetworkFirst',
        //     options: {
        //         cacheName: 'api-cache',
        //         expiration: {
        //             maxEntries: 100,
        //             maxAgeSeconds: 86400, // 24 hours
        //         },
        //     },
        // },
        // {
        //     urlPattern: /.*/,
        //     handler: 'NetworkFirst',
        //     options: {
        //         cacheName: 'catch-all',
        //     },
        // },
        // {
        //     urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff2?|eot|ttf|otf)$/,
        //     handler: 'CacheFirst',
        //     options: {
        //         cacheName: 'image-cache',
        //         expiration: {
        //             maxEntries: 50,
        //             maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        //         },
        //     },
        // },
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|css|js|woff2?|eot|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'static-assets',
                expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                },
            },
        },
        {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 30,
                    maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
                },
            },
        },
        {
            urlPattern: /\/.*\.(?:html|htm)$/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'html-cache',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
                },
            },
        }
    ],
    disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
    register: true,         // register the PWA service worker
    skipWaiting: true,      // skip waiting for service worker activation
})(nextConfig);