/* Installable web app: service worker, install button (Android/desktop), iOS how-to, update toast */
(function () {
  "use strict";
  const AVTV = (window.AVTV = window.AVTV || {});
  const IC = AVTV.icons || {};
  const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  AVTV.standalone = standalone;
  document.documentElement.classList.toggle("is-app", standalone);
  let deferred = null;

  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const iosSafari = ios && /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent);

  function installLinks() {
    if (standalone) return;
    const drawerFoot = document.querySelector(".drawer-foot");
    if (drawerFoot && !document.getElementById("drawer-install")) {
      const a = document.createElement("button"); a.type = "button"; a.id = "drawer-install"; a.className = "drawer-link"; a.innerHTML = (IC.upload || "") + "Install app";
      a.onclick = () => AVTV.pwa.install(); drawerFoot.parentNode.insertBefore(a, drawerFoot);
    }
    const help = document.querySelector(".sf-col:last-child");
    if (help && !document.getElementById("footer-install")) {
      const a = document.createElement("a"); a.href = "#"; a.id = "footer-install"; a.textContent = "Install the app";
      a.onclick = (e) => { e.preventDefault(); AVTV.pwa.install(); }; help.appendChild(a);
    }
  }

  AVTV.pwa = {
    canInstall: () => !!deferred,
    async install() {
      if (deferred) {
        deferred.prompt();
        const choice = await deferred.userChoice; deferred = null;
        if (choice.outcome === "accepted" && AVTV.toast) AVTV.toast("Installing AnivoidTV\u2026", "ok");
        return;
      }
      if (iosSafari) { if (AVTV.toast) AVTV.toast("Tap the Share button, then \u201cAdd to Home Screen\u201d.", ""); return; }
      if (AVTV.toast) AVTV.toast("Open your browser menu and choose \u201cInstall app\u201d or \u201cAdd to Home screen\u201d.", "");
    },
  };

  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; installLinks(); });
  window.addEventListener("appinstalled", () => { deferred = null; ["drawer-install", "footer-install"].forEach((id) => { const n = document.getElementById(id); if (n) n.remove(); }); if (AVTV.toast) AVTV.toast("App installed. Find AnivoidTV on your home screen!", "ok"); });
  if (iosSafari || !("onbeforeinstallprompt" in window)) document.addEventListener("DOMContentLoaded", installLinks);
  if (document.readyState !== "loading") installLinks();

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((reg) => {
        reg.addEventListener("updatefound", () => {
          const w = reg.installing; if (!w) return;
          w.addEventListener("statechange", () => {
            if (w.state === "installed" && navigator.serviceWorker.controller && AVTV.toast) {
              AVTV.toast("A new version is ready. Reloading\u2026", "ok");
              w.postMessage("SKIP_WAITING"); setTimeout(() => location.reload(), 1200);
            }
          });
        });
      }).catch(() => {});
    });
  }
})();
