// NABSHÉ Beauty & Wellness - Service Worker
// Network-First with Cache Fallback for immediate deployment updates without stale cache locking

const CACHE_NAME = 'nabshe-cache-v2';

// Assets to precache during service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/nabshe-logo.png'
];

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Precache failed partially:', err);
      });
    })
  );
});

// Activate event - claim clients and remove outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - Network-First, fallback to Cache strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Ignore unsupported schemes (like chrome-extension)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network-First strategy
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If valid response, clone and cache for offline fallback
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Fallback to cache if network is unavailable
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // For navigation requests, fallback to index.html
        if (event.request.mode === 'navigate') {
          const fallback = await caches.match('/');
          if (fallback) {
            return fallback;
          }
        }

        return new Response('Network unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});
