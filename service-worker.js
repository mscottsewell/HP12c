const CACHE_NAME = 'hp12c-calculator-v6';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './calculator.js',
  './calculator-core.js',
  './help.js',
  './faq-data.json',
  './Assets/AmyCalc_HP_12c_Background.png',
  './Assets/college-logo.svg'
];

// Install event - cache resources with resilient error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Cache each URL individually to avoid failing entire cache on one 404
        return Promise.all(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              return Promise.resolve(); // Continue even if one fails
            })
          )
        );
      })
  );
});

// Fetch event - serve from cache when available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
