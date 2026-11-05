/* Service worker for the admin PWA (scope: /admin).
 *
 * Deliberately small and safe:
 *  - caches only the offline page, icons and immutable build assets (/_next/static)
 *  - never caches /api, uploads, server actions or admin HTML (private, always fresh)
 *  - when a navigation fails because the device is offline, shows the offline page
 */
const VERSION = "v2";
const SHELL_CACHE = `admin-shell-${VERSION}`;
const STATIC_CACHE = `admin-static-${VERSION}`;
const OFFLINE_URL = "/admin-offline.html";
const PRECACHE = [
  OFFLINE_URL,
  "/admin.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/screenshots/admin-wide.png",
  "/screenshots/admin-narrow.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL_CACHE && k !== STATIC_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Page navigations inside the admin: network first, offline page as the fallback.
  if (request.mode === "navigate" && url.pathname.startsWith("/admin")) {
    event.respondWith(
      fetch(request).catch(async () => (await caches.match(OFFLINE_URL)) || Response.error())
    );
    return;
  }

  // Content-hashed build assets never change, so they are served cache-first.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  // Icons and the manifest: cache first (precached on install).
  if (url.pathname.startsWith("/icons/") || url.pathname === "/admin.webmanifest") {
    event.respondWith(caches.match(request).then((hit) => hit || fetch(request)));
  }
});
