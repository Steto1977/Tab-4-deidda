const cacheName = 'registrazione-dati-cache-v1';
const filesToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/manifest.json',
  '/icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js',  // Libreria Excel
];

// Installazione del service worker e caching dei file
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(filesToCache);
      })
  );
});

// Recupero dei file dalla cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
  );
});

// Aggiornamento della cache quando è disponibile una nuova versione
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
