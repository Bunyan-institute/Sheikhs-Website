/* Service worker for the admin PWA (scope: /admin).
 *
 * Also receives push notifications (new questions, sign-ups) and opens the right admin page when tapped.
 *
 * Deliberately small and safe:
 *  - caches only the offline page, icons and immutable build assets (/_next/static)
 *  - never caches /api, uploads, server actions or admin HTML (private, always fresh)
 *  - when a navigation fails because the device is offline, shows the offline page
 */
const VERSION = "v3";
// ?dev=1 (set by the app on localhost) turns off asset caching so hot reload keeps working.
const DEV = new URL(self.location.href).searchParams.has("dev");
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
  "/icons/badge-72.png",
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
  if (!DEV && url.pathname.startsWith("/_next/static/")) {
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

// ── Push notifications ──

/** Only same-site admin pages may be opened from a notification. */
function safeAdminUrl(raw) {
  try {
    const u = new URL(raw || "/admin", self.location.origin);
    return u.origin === self.location.origin && u.pathname.startsWith("/admin") ? u.pathname + u.search : "/admin";
  } catch {
    return "/admin";
  }
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Sheikh Admin";
  // A push must always show a notification (iOS cancels the subscription otherwise).
  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, {
        body: data.body || "",
        icon: "/icons/icon-192.png",
        badge: "/icons/badge-72.png",
        tag: data.tag || "admin",
        renotify: true,
        data: { url: safeAdminUrl(data.url) },
      });
      if (typeof data.badge === "number" && self.navigator && self.navigator.setAppBadge) {
        try {
          if (data.badge > 0) await self.navigator.setAppBadge(data.badge);
          else await self.navigator.clearAppBadge();
        } catch {
          // badges are optional
        }
      }
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = safeAdminUrl(event.notification.data && event.notification.data.url);
  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const w of windows) {
        if (new URL(w.url).pathname.startsWith("/admin")) {
          await w.focus();
          if ("navigate" in w) {
            try {
              await w.navigate(target);
            } catch {
              // cross-scope navigate can fail; the window is already focused
            }
          }
          return;
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});

// The browser rotated the subscription: register the new one so notifications keep arriving.
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const info = await (await fetch("/api/admin/push/subscribe")).json();
        if (!info.publicKey) return;
        const pad = "=".repeat((4 - (info.publicKey.length % 4)) % 4);
        const raw = atob((info.publicKey + pad).replace(/-/g, "+").replace(/_/g, "/"));
        const key = Uint8Array.from(raw, (c) => c.charCodeAt(0));
        const sub = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
        await fetch("/api/admin/push/subscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ subscription: sub.toJSON() }),
        });
      } catch {
        // not signed in or offline: the settings screen lets the admin re-enable later
      }
    })()
  );
});
