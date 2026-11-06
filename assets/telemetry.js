/* Anonymous usage counter: random device id + page + whether it runs as an installed app. No cookies, no IP stored. */
(function () {
  "use strict";
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") return;
  let did = null;
  try { did = localStorage.getItem("avtv_did"); } catch (e) { /* private mode */ }
  if (!did) {
    const b = new Uint8Array(16); (window.crypto || window.msCrypto).getRandomValues(b);
    did = btoa(String.fromCharCode.apply(null, b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    try { localStorage.setItem("avtv_did", did); } catch (e) { /* ignore */ }
  }
  const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  const send = (t) => fetch("/api/v1/t/ping", { method: "POST", credentials: "same-origin", keepalive: true, headers: { "Content-Type": "application/json", "X-AVTV": "1" },
    body: JSON.stringify({ d: did, t: t, p: location.pathname.slice(0, 70), s: standalone }) }).catch(() => {});
  send("view");
  setInterval(() => { if (document.visibilityState === "visible") send("beat"); }, 60000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") send("beat"); });
})();
