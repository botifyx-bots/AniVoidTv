/* AnivoidTV service worker: fast repeat visits + offline page. It never caches API data (accounts, comments, lists). */
const VERSION = "av-v3";
const SHELL = `${VERSION}-shell`, RUNTIME = `${VERSION}-runtime`, IMAGES = `${VERSION}-images`;
const PRECACHE = ["/offline", "/assets/style.css", "/assets/site.css", "/assets/theme.css", "/assets/icons/icon-192.png"];
const MAX_IMAGES = 160;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("message", (e) => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });

async function trim(cacheName, max) {
  const c = await caches.open(cacheName), keys = await c.keys();
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map((k) => c.delete(k)));
}
const staleWhileRevalidate = async (req, cacheName) => {
  const c = await caches.open(cacheName), hit = await c.match(req);
  const net = fetch(req).then((r) => { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; }).catch(() => hit);
  return hit || net;
};

self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;

  if (url.origin === location.origin) {
    if (url.pathname.startsWith("/api/v1/media/")) {                                        // profile pictures: immutable
      e.respondWith(caches.open(IMAGES).then(async (c) => (await c.match(req)) || fetch(req).then((r) => { if (r.ok) { c.put(req, r.clone()); trim(IMAGES, MAX_IMAGES); } return r; })));
      return;
    }
    if (url.pathname.startsWith("/api/")) return;                                            // never cache dynamic or private API data
    if (url.pathname.startsWith("/AnimeVoid") || url.pathname.startsWith("/av-console")) return;   // admin console is always live
    if (req.mode === "navigate") {                                                           // pages: network first, offline fallback
      e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(RUNTIME).then((c) => c.put(req, copy)); return r; })
        .catch(async () => (await caches.match(req)) || (await caches.match("/offline"))));
      return;
    }
    if (url.pathname.startsWith("/assets/")) { e.respondWith(staleWhileRevalidate(req, SHELL)); return; }
    return;
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") { e.respondWith(staleWhileRevalidate(req, RUNTIME)); return; }
  if (req.destination === "image") {                                                         // anime posters from the CDN
    e.respondWith(staleWhileRevalidate(req, IMAGES).then((r) => { trim(IMAGES, MAX_IMAGES); return r; }));
  }
});
