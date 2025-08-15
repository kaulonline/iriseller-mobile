// IRISeller Progressive Web App Service Worker - Fixed Version
const CACHE_NAME = 'iriseller-v2.0.1';
const APP_SHELL_CACHE = 'iriseller-shell-v2.0.1';
const RUNTIME_CACHE = 'iriseller-runtime-v2.0.1';

// App shell files to cache immediately
const APP_SHELL_FILES = [
  '/',
  '/app/',
  '/manifest.json',
  '/assets/icon.png',
  '/favicon.ico'
];

// Install event - cache app shell
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then(cache => {
        console.log('📦 Caching app shell files');
        return cache.addAll(APP_SHELL_FILES);
      })
      .then(() => {
        console.log('✅ App shell cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Cache installation failed:', error);
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== APP_SHELL_CACHE && 
                cacheName !== RUNTIME_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle app shell requests
  if (APP_SHELL_FILES.includes(url.pathname)) {
    event.respondWith(
      caches.open(APP_SHELL_CACHE)
        .then(cache => cache.match(request))
        .then(response => {
          if (response) {
            console.log('📦 Serving from app shell cache:', url.pathname);
            return response;
          }
          return fetch(request).then(fetchResponse => {
            if (fetchResponse.ok) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        })
        .catch(error => {
          console.log('❌ Cache error:', error);
          return fetch(request);
        })
    );
    return;
  }
  
  // Handle other requests with network first strategy
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.ok && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE)
            .then(cache => cache.put(request, responseClone))
            .catch(error => console.log('Cache put error:', error));
        }
        return response;
      })
      .catch(error => {
        console.log('🔍 Network failed, trying cache for:', request.url);
        return caches.match(request).then(response => {
          if (response) {
            console.log('💾 Served from cache:', request.url);
            return response;
          }
          
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/') || 
                   new Response('IRISeller is offline', {
                     status: 503,
                     statusText: 'Service Unavailable',
                     headers: { 'Content-Type': 'text/plain' }
                   });
          }
          
          throw error;
        });
      })
  );
});

// Handle messages from main thread
self.addEventListener('message', event => {
  console.log('💬 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('🎯 IRISeller Service Worker loaded successfully');
