importScripts('./cache-polyfill.js');
const version = '2.3.0';
const cacheName = `vnoit-sync-tab-${version}`;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache
        .addAll(['./', './style.css', './cache-polyfill.js'])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .open(cacheName)
      .then((cache) =>
        cache.match(event.request, {
          ignoreSearch: true
        })
      )
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('message', async (event) => {
  // event is an ExtendableMessageEvent object
  console.log(`The client sent me a message: ${event.data}`);
  const clientsData = await clients.matchAll();
  for (const client of clientsData) {
    client.postMessage(event.data); // Respond to all the window
  }
  // event.source.postMessage(event.data); // Respond to the source event/window
});
