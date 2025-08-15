// IRISeller Progressive Web App Service Worker
const CACHE_NAME = 'iriseller-v2.0.0';
const APP_SHELL_CACHE = 'iriseller-shell-v2.0.0';
const RUNTIME_CACHE = 'iriseller-runtime-v2.0.0';

// App shell files to cache immediately
const APP_SHELL_FILES = [
  '/',
  '/app',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png',
  '/favicon.ico'
];

// API endpoints and external resources
const RUNTIME_URLS = [
  'https://api.iriseller.com',
  'https://beta.iriseller.com/api'
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
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        })
    );
    return;
  }
  
  // Handle API requests with runtime caching
  if (url.origin !== location.origin || url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(RUNTIME_CACHE)
        .then(cache => {
          return cache.match(request).then(response => {
            if (response) {
              console.log('💾 Serving from runtime cache:', url.href);
              // Serve from cache and update in background
              fetch(request).then(fetchResponse => {
                if (fetchResponse.ok) {
                  cache.put(request, fetchResponse.clone());
                }
              }).catch(() => {}); // Ignore background fetch errors
              return response;
            }
            
            // Not in cache, fetch from network
            return fetch(request).then(fetchResponse => {
              if (fetchResponse.ok) {
                console.log('🌐 Caching network response:', url.href);
                cache.put(request, fetchResponse.clone());
              }
              return fetchResponse;
            }).catch(error => {
              console.log('❌ Network request failed:', url.href, error);
              // Return offline fallback for HTML pages
              if (request.headers.get('accept').includes('text/html')) {
                return caches.match('/offline.html') || 
                       new Response('App offline. Please check your connection.', {
                         status: 503,
                         statusText: 'Service Unavailable'
                       });
              }
              throw error;
            });
          });
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
            .catch(() => {}); // Ignore cache errors
        }
        return response;
      })
      .catch(error => {
        console.log('🔍 Trying cache for:', request.url);
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
                     statusText: 'Service Unavailable'
                   });
          }
          
          throw error;
        });
      })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('📬 Push notification received:', event);
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New update from IRISeller',
    icon: '/assets/icon-192.png',
    badge: '/assets/badge-72.png',
    image: data.image,
    data: data.data,
    actions: [
      {
        action: 'open',
        title: 'Open IRISeller',
        icon: '/assets/open-icon.png'
      },
      {
        action: 'dismiss', 
        title: 'Dismiss',
        icon: '/assets/dismiss-icon.png'
      }
    ],
    requireInteraction: true,
    tag: 'iriseller-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'IRISeller', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('🔔 Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  // Focus or open the app
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes('app.iriseller.com') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open new window
        if (clients.openWindow) {
          return clients.openWindow('/app');
        }
      })
  );
});

// Handle sync events (background sync)
self.addEventListener('sync', event => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync offline actions when connection is restored
      syncOfflineActions()
    );
  }
});

async function syncOfflineActions() {
  try {
    // Get offline actions from IndexedDB or localStorage
    console.log('🔄 Syncing offline actions...');
    // Implement your offline sync logic here
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', event => {
  console.log('💬 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE)
        .then(cache => cache.addAll(event.data.urls))
    );
  }
});

console.log('🎯 IRISeller Service Worker loaded successfully');
