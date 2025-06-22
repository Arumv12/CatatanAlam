const CACHE_NAME = "jurnal-alam-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/bundle.js",
  "/styles/main.css",
  "/images/icon.png",
];

// Install event - cache assets statis (Application Shell)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event - bersihkan cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first untuk assets statis, network-first untuk API
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Cache-first untuk assets statis
  if (ASSETS_TO_CACHE.includes(url.pathname)) {
    event.respondWith(
      caches
        .match(event.request)
        .then((cacheRes) => cacheRes || fetch(event.request))
    );
    return;
  }

  // Network-first untuk API story
  if (url.origin === "https://story-api.dicoding.dev") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const resClone = res.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, resClone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  }
});

// Push Notification
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  self.registration.showNotification(data.title || "Notifikasi", {
    body: data.options?.body || "Ada notifikasi baru.",
    icon: "/images/icon.png",
  });
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
