/* Admin console (served only at /AnimeVoid). Every call goes through the same-origin proxy with a per-session CSRF token. */
(function () {
  "use strict";
  const IC = (window.AVTV && AVTV.icons) || {};
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (n) => Number(n || 0).toLocaleString();
  const ago = (iso) => { if (!iso) return "never"; const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000); if (s < 90) return "just now"; if (s < 3600) return Math.round(s / 60) + " min ago"; if (s < 86400) return Math.round(s / 3600) + " h ago"; return Math.round(s / 86400) + " d ago"; };
  let csrf = null, tab = "overview", timer = null;

  async function api(path, opts) {
    opts = opts || {};
    const res = await fetch("/api/v1" + path, { method: opts.method || "GET", credentials: "same-origin", cache: "no-store",
      headers: Object.assign({ Accept: "application/json", "X-AVTV": "1" }, csrf ? { "X-Admin-CSRF": csrf } : {}, opts.body ? { "Content-Type": "application/json" } : {}), body: opts.body ? JSON.stringify(opts.body) : undefined });
    let j = null; try { j = await res.json(); } catch (e) { /* ignore */ }
    if (res.status === 401 && j && j.admin_auth_required && csrf) { csrf = null; showLogin("Session expired. Sign in again."); throw new Error("expired"); }
    if (!res.ok || (j && j.success === false)) { const e = new Error((j && j.message) || "Request failed (" + res.status + ")"); e.status = res.status; throw e; }
    return j;
  }
  function toast(msg, kind) { const t = document.createElement("div"); t.className = "toast " + (kind || ""); t.textContent = msg; $("#toasts").appendChild(t); setTimeout(() => t.remove(), 3500); }
  const fail = (e) => { if (e.message !== "expired") toast(e.message, "err"); };

  /* ---------------- login ---------------- */
  function showLogin(msg) { $("#console").hidden = true; $("#login-view").hidden = false; if (msg !== undefined) $("#login-msg").textContent = msg; clearInterval(timer); document.title = "Console"; }
  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, btn = $("#login-btn"); btn.disabled = true; $("#login-msg").textContent = "";
    const fv = (n) => f.querySelector('[name="' + n + '"]').value, setFv = (n, v) => { f.querySelector('[name="' + n + '"]').value = v; };
    try {
      const j = await api("/admin/login", { method: "POST", body: { username: fv("username").trim(), password: fv("password"), otp: fv("otp").trim() } });
      csrf = j.results.csrf; setFv("password", ""); setFv("otp", "");
      start();
    } catch (err) { $("#login-msg").textContent = err.status === 404 ? "Not available." : err.message; setFv("otp", ""); }
    finally { btn.disabled = false; }
  });
  $("#logout").addEventListener("click", async () => { try { await api("/admin/logout", { method: "POST" }); } catch (e) { /* ignore */ } csrf = null; showLogin("Signed out."); });

  const TABS = [["overview", "Overview", "grid"], ["devices", "Devices", "device"], ["users", "Users", "users"], ["reports", "Reports", "flag"], ["features", "Features", "cog"], ["audit", "Audit log", "clock"], ["security", "Security", "shield"], ["system", "System", "bolt"]];
  async function start() {
    $("#login-view").hidden = true; $("#console").hidden = false; document.title = "Console";
    $("#tabs").innerHTML = TABS.map(([k, n, ic]) => '<button type="button" data-tab="' + k + '" class="' + (k === tab ? "on" : "") + '">' + (IC[ic] || "") + n + "</button>").join("");
    show(tab);
  }
  $("#tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) show(b.dataset.tab); });
  function show(t) {
    tab = t; clearInterval(timer);
    document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
    $("#title").textContent = TABS.find((x) => x[0] === t)[1];
    $("#live").textContent = "";
    ({ overview, devices, users, reports, features, audit, security, system }[t])();
  }

  /* ---------------- overview ---------------- */
  const stat = (v, l, cls) => '<div class="adm-stat ' + (cls || "") + '"><b>' + esc(v) + "</b><span>" + l + "</span></div>";
  const bars = (rows) => rows.length ? '<div class="adm-bars">' + rows.map((r) => '<div class="adm-bar"><span>' + esc(r.name) + '</span><i><s style="width:' + Math.round((r.count / Math.max(...rows.map((x) => x.count))) * 100) + '%"></s></i><em>' + num(r.count) + "</em></div>").join("") + "</div>" : '<div class="adm-empty">No data yet</div>';
  function chart(ts) {
    const W = 720, H = 220, P = 28, max = Math.max(1, ...ts.map((d) => Math.max(d.views, d.active_devices))), bw = (W - P * 2) / ts.length;
    let s = '<svg class="adm-chart" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Traffic chart">';
    for (let i = 0; i <= 4; i++) { const y = P + ((H - P * 2) / 4) * i; s += '<line x1="' + P + '" x2="' + (W - P) + '" y1="' + y + '" y2="' + y + '" stroke="#f4ead81a" stroke-dasharray="3 4"/><text x="2" y="' + (y + 3) + '">' + Math.round(max - (max / 4) * i) + "</text>"; }
    ts.forEach((d, i) => {
      const x = P + i * bw, h1 = ((H - P * 2) * d.views) / max, h2 = ((H - P * 2) * d.active_devices) / max;
      s += '<rect x="' + (x + bw * 0.1) + '" y="' + (H - P - h1) + '" width="' + bw * 0.38 + '" height="' + h1 + '" fill="#ff5a36"><title>' + esc(d.date) + ": " + d.views + " views</title></rect>" +
           '<rect x="' + (x + bw * 0.52) + '" y="' + (H - P - h2) + '" width="' + bw * 0.38 + '" height="' + h2 + '" fill="#ffbe3b"><title>' + esc(d.date) + ": " + d.active_devices + " devices</title></rect>";
      if (ts.length <= 16 || i % Math.ceil(ts.length / 12) === 0) s += '<text x="' + (x + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(d.date.slice(5)) + "</text>";
    });
    return s + "</svg>";
  }
  let rangeDays = 14;
  async function overview() {
    const draw = async () => {
      try {
        const [o, t] = await Promise.all([api("/admin/overview"), api("/admin/timeseries?days=" + rangeDays)]);
        const v = o.results, ts = t.results;
        $("#live").textContent = "live \u00b7 updated " + new Date().toLocaleTimeString();
        $("#panel").innerHTML =
          '<div class="adm-grid">' + stat(num(v.online_now), "Devices online now", "hot") + stat(num(v.online_15m), "Online (last 15 min)") + stat(num(v.online_pwa), "Installed app online now", "good") + stat(num(v.devices_total), "Devices ever seen") +
          stat(num(v.active_today), "Active today") + stat(num(v.active_7d), "Active (7 days)") + stat(num(v.active_30d), "Active (30 days)") + stat(num(v.new_today), "New devices today") +
          stat(num(v.installed_apps_30d), "Installed apps (30 days)", "good") + stat(num(v.users_total), "Member accounts") + stat(num(v.users_new_7d), "New members (7 days)") + stat(num(v.logged_in_devices_online), "Signed-in devices online") +
          stat(num(v.views_today), "Page views today") + stat(num(v.comments_total), "Comments") + stat(num(v.pictures_total) + " / " + (v.picture_bytes / 1048576).toFixed(1) + " MB", "Pictures stored") + stat(num(v.reports_open), "Open reports", v.reports_open ? "hot" : "") + "</div>" +
          '<div class="adm-box"><h3>Traffic <span class="adm-row" style="margin:0">' + [7, 14, 30, 90].map((d) => '<button class="btn sm' + (d === rangeDays ? " primary" : "") + '" data-range="' + d + '" type="button">' + d + "d</button>").join("") + "</span></h3>" + chart(ts) +
          '<div class="adm-legend"><span><i style="background:#ff5a36"></i>Page views</span><span><i style="background:#ffbe3b"></i>Active devices</span></div></div>' +
          '<div class="adm-two"><div class="adm-box"><h3>Platforms (30 days)</h3>' + bars(v.platforms) + '</div><div class="adm-box"><h3>Device type</h3>' + bars(v.kinds) + '</div><div class="adm-box"><h3>Browsers</h3>' + bars(v.browsers) + '</div><div class="adm-box"><h3>Countries</h3>' + bars(v.countries) + "</div></div>";
      } catch (e) { fail(e); }
    };
    $("#panel").onclick = (e) => { const b = e.target.closest("[data-range]"); if (b) { rangeDays = Number(b.dataset.range); draw(); } };
    await draw(); timer = setInterval(() => { if (document.visibilityState === "visible" && tab === "overview") draw(); }, 15000);
  }

  /* ---------------- devices ---------------- */
  let dFilter = "all", dPage = 1;
  async function devices() {
    try {
      const r = (await api("/admin/devices?filter=" + dFilter + "&page=" + dPage)).results;
      const chips = [["all", "All"], ["online", "Online now"], ["pwa", "Installed app"], ["android", "Android"], ["ios", "iPhone/iPad"], ["desktop", "Desktop"], ["loggedin", "Signed in"]];
      $("#panel").innerHTML = '<div class="adm-box"><div class="adm-row">' + chips.map(([k, n]) => '<button class="btn sm' + (k === dFilter ? " primary" : "") + '" data-f="' + k + '" type="button">' + n + "</button>").join("") + '<span class="pill">' + num(r.total) + " devices</span></div>" +
        '<div class="adm-scroll"><table class="adm-table"><thead><tr><th>Device</th><th>Platform</th><th>Browser</th><th>Type</th><th>App</th><th>Country</th><th>Member</th><th>Page</th><th>Views</th><th>First seen</th><th>Last seen</th></tr></thead><tbody>' +
        (r.data.map((d) => "<tr><td>" + (d.online ? '<span class="pill ok">online</span> ' : "") + esc(d.id) + "</td><td>" + esc(d.os) + "</td><td>" + esc(d.browser) + "</td><td>" + esc(d.kind) + "</td><td>" + (d.app ? '<span class="pill ok">installed</span>' : "browser") + "</td><td>" + esc(d.country || "-") + "</td><td>" + esc(d.user || "-") + "</td><td>" + esc(d.page || "-") + "</td><td>" + num(d.views) + "</td><td>" + ago(d.first_seen) + "</td><td>" + ago(d.last_seen) + "</td></tr>").join("") || '<tr><td colspan="11" class="adm-empty">No devices match.</td></tr>') +
        '</tbody></table></div><div class="adm-pager"><button class="btn sm" data-p="-1" type="button"' + (dPage <= 1 ? " disabled" : "") + '>Prev</button> page ' + dPage + ' <button class="btn sm" data-p="1" type="button"' + (dPage * 25 >= r.total ? " disabled" : "") + ">Next</button></div></div>";
      $("#panel").onclick = (e) => { const f = e.target.closest("[data-f]"), p = e.target.closest("[data-p]"); if (f) { dFilter = f.dataset.f; dPage = 1; devices(); } else if (p && !p.disabled) { dPage += Number(p.dataset.p); devices(); } };
    } catch (e) { fail(e); }
  }

  /* ---------------- users ---------------- */
  let uQuery = "", uPage = 1;
  async function users() {
    try {
      const r = (await api("/admin/users?q=" + encodeURIComponent(uQuery) + "&page=" + uPage)).results;
      $("#panel").innerHTML = '<div class="adm-box"><div class="adm-row"><input class="adm-in" id="uq" placeholder="Search username or name\u2026" value="' + esc(uQuery) + '" maxlength="40"><button class="btn sm primary" id="usearch" type="button">Search</button><span class="pill">' + num(r.total) + " members</span></div>" +
        '<div class="adm-scroll"><table class="adm-table"><thead><tr><th>Member</th><th>Rank</th><th>VP</th><th>Joined</th><th>Comments</th><th>Episodes</th><th>Sessions</th><th>Status</th><th></th></tr></thead><tbody>' +
        (r.data.map((u) => "<tr><td><b>" + esc(u.name) + "</b><br><small>@" + esc(u.username) + (u.google ? " \u00b7 Google" : "") + "</small></td><td>" + esc(u.rank) + "</td><td>" + num(u.vp) + "</td><td>" + ago(u.joined) + "</td><td>" + num(u.comments) + "</td><td>" + num(u.episodes) + "</td><td>" + u.sessions + "</td><td>" + (u.banned ? '<span class="pill bad">banned</span>' : '<span class="pill ok">active</span>') +
          '</td><td style="white-space:nowrap"><button class="btn sm" data-a="' + (u.banned ? "unban" : "ban") + '" data-u="' + esc(u.username) + '" type="button">' + (u.banned ? "Unban" : "Ban") + '</button> <button class="btn sm" data-a="signout" data-u="' + esc(u.username) + '" type="button">Sign out</button> <button class="btn sm" data-a="vp" data-u="' + esc(u.username) + '" type="button">\u00b1 VP</button></td></tr>').join("") || '<tr><td colspan="9" class="adm-empty">No members found.</td></tr>') +
        '</tbody></table></div><div class="adm-pager"><button class="btn sm" data-p="-1" type="button"' + (uPage <= 1 ? " disabled" : "") + '>Prev</button> page ' + uPage + ' <button class="btn sm" data-p="1" type="button"' + (uPage * 25 >= r.total ? " disabled" : "") + ">Next</button></div></div>";
      $("#usearch").onclick = () => { uQuery = $("#uq").value.trim(); uPage = 1; users(); };
      $("#uq").onkeydown = (e) => { if (e.key === "Enter") $("#usearch").click(); };
      $("#panel").onclick = async (e) => {
        const p = e.target.closest("[data-p]"); if (p && !p.disabled) { uPage += Number(p.dataset.p); return users(); }
        const b = e.target.closest("[data-a]"); if (!b) return;
        const name = b.dataset.u, a = b.dataset.a;
        try {
          if (a === "ban" && !confirm("Ban @" + name + "? They are signed out immediately.")) return;
          if (a === "vp") { const d = Number(prompt("Add or remove VP for @" + name + " (e.g. 500 or -200):")); if (!d || !Number.isInteger(d)) return; await api("/admin/users/" + encodeURIComponent(name) + "/vp", { method: "POST", body: { delta: d, reason: "console" } }); }
          else await api("/admin/users/" + encodeURIComponent(name) + "/" + a, { method: "POST" });
          toast("Done", "ok"); users();
        } catch (err) { fail(err); }
      };
    } catch (e) { fail(e); }
  }

  /* ---------------- reports ---------------- */
  async function reports() {
    try {
      const rows = (await api("/admin/reports")).results;
      $("#panel").innerHTML = '<div class="adm-box"><h3>Open reports <span class="pill ' + (rows.length ? "warn" : "ok") + '">' + rows.length + "</span></h3>" +
        (rows.map((r) => '<div class="adm-report"><span class="pill">' + esc(r.type) + "</span> <small>" + ago(r.created) + "</small><p>" + (r.preview ? "<b>\u201c" + esc(r.preview) + "\u201d</b><br>" : "") + "Reason: " + esc(r.reason || "(none)") + " \u00b7 target <code>" + esc(r.target) + "</code></p>" +
          '<div class="adm-row" style="margin:0">' + (r.type === "comment" ? '<button class="btn sm danger" data-del="comments" data-id="' + esc(r.target) + '" type="button">Delete comment</button>' : "") + (r.type === "media" ? '<button class="btn sm danger" data-del="media" data-id="' + esc(r.target) + '" type="button">Delete picture</button>' : "") +
          (r.type === "user" ? '<button class="btn sm danger" data-ban="' + esc(r.target) + '" type="button">Ban user</button>' : "") + '<button class="btn sm" data-resolve="' + esc(r.id) + '" type="button">Dismiss</button></div></div>').join("") || '<div class="adm-empty">All clear. No open reports.</div>') + "</div>";
      $("#panel").onclick = async (e) => {
        const d = e.target.closest("[data-del]"), r = e.target.closest("[data-resolve]"), b = e.target.closest("[data-ban]");
        try {
          if (d) { if (!confirm("Delete this " + d.dataset.del.replace(/s$/, "") + "?")) return; await api("/admin/" + d.dataset.del + "/" + encodeURIComponent(d.dataset.id), { method: "DELETE" }); }
          else if (r) await api("/admin/reports/" + encodeURIComponent(r.dataset.resolve) + "/resolve", { method: "POST" });
          else if (b) { if (!confirm("Ban @" + b.dataset.ban + "?")) return; await api("/admin/users/" + encodeURIComponent(b.dataset.ban) + "/ban", { method: "POST" }); }
          else return;
          toast("Done", "ok"); reports();
        } catch (err) { fail(err); }
      };
    } catch (e) { fail(e); }
  }

  /* ---------------- feature switches ---------------- */
  async function features() {
    try {
      const r = (await api("/admin/flags")).results, v = r.values, info = r.info;
      $("#panel").innerHTML = '<div class="adm-box"><h3>Feature switches <button class="btn sm primary" id="save-flags" type="button">Save changes</button></h3><p class="hint" style="margin-bottom:6px">Changes apply within a few seconds, no redeploy needed. To add a new switch, see EXTENDING.md.</p>' +
        Object.keys(info).map((k) => info[k].type === "bool"
          ? '<div class="adm-flag"><div><b>' + esc(k) + "</b><br><small>" + esc(info[k].description) + '</small></div><label class="sw"><input type="checkbox" data-flag="' + esc(k) + '"' + (v[k] ? " checked" : "") + '><i></i></label></div>'
          : '<div class="adm-flag text"><div><b>' + esc(k) + "</b><br><small>" + esc(info[k].description) + '</small></div><input class="adm-in" data-flag="' + esc(k) + '" value="' + esc(v[k]) + '" maxlength="200"></div>').join("") + "</div>";
      $("#save-flags").onclick = async () => {
        const body = {}; document.querySelectorAll("[data-flag]").forEach((el) => { body[el.dataset.flag] = el.type === "checkbox" ? el.checked : el.value; });
        try { await api("/admin/flags", { method: "PUT", body }); toast("Saved", "ok"); } catch (e) { fail(e); }
      };
    } catch (e) { fail(e); }
  }

  /* ---------------- audit / security / system ---------------- */
  async function audit() {
    try {
      const rows = (await api("/admin/audit")).results;
      $("#panel").innerHTML = '<div class="adm-box"><h3>Recent admin activity</h3><div class="adm-scroll"><table class="adm-table"><thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Target</th><th>Network</th><th>Detail</th><th></th></tr></thead><tbody>' +
        (rows.map((r) => "<tr><td>" + ago(r.at) + "</td><td>" + esc(r.actor) + "</td><td>" + esc(r.action) + "</td><td>" + esc(r.target) + "</td><td>" + esc(r.ip) + "</td><td>" + esc(r.detail) + "</td><td>" + (r.ok ? '<span class="pill ok">ok</span>' : '<span class="pill bad">failed</span>') + "</td></tr>").join("") || '<tr><td colspan="7" class="adm-empty">Nothing yet.</td></tr>') + "</tbody></table></div></div>";
    } catch (e) { fail(e); }
  }
  async function security() {
    try {
      const r = (await api("/admin/security")).results;
      $("#panel").innerHTML = '<div class="adm-grid">' + stat(num(r.failed_logins_24h), "Failed admin logins (24 h)", r.failed_logins_24h ? "hot" : "good") + stat(num(r.admin_sessions), "Active admin sessions") + stat(num(r.banned_users), "Banned members") + "</div>" +
        '<div class="adm-box"><h3>Hardening checklist <button class="btn sm danger" id="revoke" type="button">Sign out all admin sessions</button></h3>' +
        r.checks.map((c) => '<div class="adm-check"><span class="pill ' + (c.ok ? "ok" : "bad") + '">' + (c.ok ? "OK" : "FIX") + "</span><div>" + esc(c.name) + (c.ok ? "" : "<small>" + esc(c.fix) + "</small>") + "</div></div>").join("") + "</div>";
      $("#revoke").onclick = async () => { if (!confirm("This signs you out too.")) return; try { await api("/admin/sessions/revoke-all", { method: "POST" }); csrf = null; showLogin("All admin sessions revoked."); } catch (e) { fail(e); } };
    } catch (e) { fail(e); }
  }
  async function system() {
    try {
      const r = (await api("/admin/system")).results, c = r.crawl || {};
      $("#panel").innerHTML = '<div class="adm-grid">' + stat(num(r.catalog_entries), "Anime in catalog") + stat(num(r.items), "Shop items") + stat(num(r.decorations), "Avatar decorations") + "</div>" +
        '<div class="adm-box"><h3>Completed / upcoming data <button class="btn sm primary" id="crawl" type="button"' + (c.state === "running" ? " disabled" : "") + '>Rebuild now</button></h3><div class="adm-bars"><div class="adm-bar"><span>State</span><span></span><em>' + esc(c.state || "idle") + '</em></div></div><p class="hint" style="margin-top:10px">Last good run: ' + esc(c.last_success || "never") + "<br>Completed: " + num(c.completed) + " \u00b7 Upcoming: " + num(c.upcoming) + (c.last_error ? "<br>Last error: " + esc(c.last_error) : "") + "</p></div>";
      $("#crawl").onclick = async () => { try { await api("/admin/crawl", { method: "POST" }); toast("Crawl started", "ok"); setTimeout(system, 1500); } catch (e) { fail(e); } };
    } catch (e) { fail(e); }
  }

  /* resume an existing session after a reload */
  (async function init() {
    try { const j = await api("/admin/me"); csrf = j.results.csrf; start(); }
    catch (e) { showLogin(); }
    document.getElementById("login-view").hidden = !!csrf;
  })();
})();
