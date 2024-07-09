var APP_PREFIX = 'rockviet_';
var VERSION = '1';
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [
    '/',
    '/data.json',
    '/assets/main.js',
    '/assets/styles.css',
    '/icons/book.png',
    '/icons/cassette.png',
    '/icons/cd.png',
    '/icons/digital.png',
    '/icons/dvd.png',
    '/icons/mini-cd.png',
    '/icons/promotion.png',
    '/icons/reel-to-reel.png',
    '/icons/tv.png',
    '/icons/usb.png',
    '/icons/vcd.png',
    '/icons/vhs.png',
    '/icons/vinyl.png',
    '/icons/unknown.png',
    '//unpkg.com/jquery@3.3.1/dist/jquery.min.js',
    '//unpkg.com/bootstrap@5.3.1/dist/js/bootstrap.min.js',
    '//unpkg.com/tabulator-tables@5.4.4/dist/js/tabulator.min.js',
    '//unpkg.com/bootstrap@5.3.1/dist/css/bootstrap.min.css',
    '//unpkg.com/tabulator-tables@5.4.4/dist/css/tabulator.min.css',
    '//unpkg.com/tabulator-tables@5.4.4/dist/css/tabulator_semanticui.min.css',
    '/favicon/android-icon-144x144.png',
    '/favicon/android-icon-72x72.png',
    '/favicon/apple-icon-144x144.png',
    '/favicon/apple-icon-60x60.png',
    '/favicon/apple-icon.png',
    '/favicon/favicon-96x96.png',
    '/favicon/ms-icon-150x150.png',
    '/favicon/android-icon-192x192.png',
    '/favicon/android-icon-96x96.png',
    '/favicon/apple-icon-152x152.png',
    '/favicon/apple-icon-72x72.png',
    '/favicon/browserconfig.xml',
    '/favicon/favicon.ico',
    '/favicon/ms-icon-310x310.png',
    '/favicon/android-icon-36x36.png',
    '/favicon/apple-icon-114x114.png',
    '/favicon/apple-icon-180x180.png',
    '/favicon/apple-icon-76x76.png',
    '/favicon/favicon-16x16.png',
    '/favicon/manifest.json',
    '/favicon/ms-icon-70x70.png',
    '/favicon/android-icon-48x48.png',
    '/favicon/apple-icon-120x120.png',
    '/favicon/apple-icon-57x57.png',
    '/favicon/apple-icon-precomposed.png',
    '/favicon/favicon-32x32.png',
    '/favicon/ms-icon-144x144.png'
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + e.request.url);
                return request;
            } else {
                console.log('file is not cached, fetching : ' + e.request.url);
                return fetch(e.request);
            }

            // return request || fetch(e.request)
        })
    );
});

// Cache resources
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME);
            return cache.addAll(URLS);
        })
    );
});

// Delete outdated caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            // `keyList` contains all cache names under your username.github.io
            // filter out ones that has this app prefix to create white list
            var cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            // add current cache name to white list
            cacheWhitelist.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});
