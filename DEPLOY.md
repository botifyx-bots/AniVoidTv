# AnivoidTV frontend: deploy guide (v4)

Static site + Vercel serverless proxies. The browser only calls **your own domain**; the proxies hide the real API URLs and keep the login cookie first-party.

## Pages
| File | What |
|---|---|
| `index.html` | landing (search, popular searches, **Visit Home**, watch-by-ID) |
| `home.html` | spotlight hero, Continue Watching, Latest (paginated), Top anime, schedule, footer |
| `recent.html` · `aired.html` · `upcoming.html` · `search.html` | listing pages |
| `details.html` | details, **Add to list**, comments with animated reactions + stickers |
| `watch.html` | player (resumes the last episode, tracks Continue Watching and watched episodes) |
| `profile.html` | your dashboard in a Telegram-style layout (cover + centred avatar + action tiles + info rows on the left, underline tabs on the right): rank/VP, badges, favorites, **Customize** (display name, 5 effect slots, banner presets, default avatar), **Pictures** (galleries, crop, set main), Continue Watching, Watch List, Settings (bio, privacy, username, password, devices) |
| `shop.html` | **Void Shop**: 101 effects, titles, sticker packs, live previews with your own avatar/name |
| `user.html?u=name` | public profile |

Code: `assets/site.js` (auth popup, menu, avatars/names/titles, continue-watching store, footer), `icons.js` (all icons, liquid badges, animated reactions, **no emoji anywhere**), `stickers.js` (40 original animated stickers), `community.js`, `cropper.js`, `profile*.js`, `shop.js`, `home.js`, page scripts in `assets/pages/`.
Styles: `style.css` (base) → `site.css` → `effects.css` (**generated**: name effects + card styles) → `decorations.css` (avatar overlay animations) → `bannerfx.css` (banner scenes + free print-pattern presets) → `theme.css` (Ink & Vermilion: flat colour, hard outlines and offset shadows, screentone dots) → page CSS.
Decorations: `fx-recipes.js` (**generated** recipes) + `decorations.js` (draws 106 illustrated SVG overlays, hover = faster animation, click = spark burst). Banner scenes: `bannerfx.js` (31 animated particle fields and silhouettes).

## Vercel setup
Settings → Environment Variables: `BACKEND_URL` (e.g. `https://anivoid-api-xxxx.onrender.com`) and `PROXY_SECRET` (same value as on the backend). Redeploy after changing them, then open `/api/v1/_debug`.
Files that must be in the repo root: `vercel.json` (rewrite `/api/v1/*` to `api/proxy.js`, **security headers + CSP**) and `api/proxy.js` (allow-listed forwarding, binary-safe media, 3 MB upload limit). The old `api/v1/` folder must not exist.

## Security notes
* `vercel.json` sets a strict **Content-Security-Policy**: scripts only from your own files (+ Google sign-in), no inline scripts, no inline handlers (all pages were converted). Because the player pages embed third-party players, `frame-src` allows any `https:` source: tighten it to your real player hosts when you know them. Also sets HSTS, nosniff, frame, referrer, permissions and COOP headers.
* **Never commit a Google `client_secret` / `client_secret_*.json` / `google auth.json`.** The site only needs the public client id (set on the backend as `GOOGLE_CLIENT_ID`). If a secret was ever pushed to a public repo, delete the file *and* rotate the secret in Google Cloud Console (git history keeps old files).
* All user text is rendered with escaping/`textContent`; uploaded pictures are re-encoded by the backend.

## Effects CSS
`assets/effects.css` and `assets/fx-recipes.js` are generated from the backend catalog: in the backend repo run `python tools/gen_effects.py ../AniVoidTV/assets/effects.css ../AniVoidTV/assets/fx-recipes.js`. Decoration/banner ids (`frame.ivy_wreath`, `banner.tokyo_night`) are looked up in the recipes; name/card ids map to CSS classes (`fx-name-grad_ember`).

## Notes
* Friends and Notifications tabs show "coming soon" (next update).
* Schedule times are shown as provided by the source (timezone not guaranteed).
* Animations respect `prefers-reduced-motion`.


## v4 additions
* **Clean URLs**: `vercel.json` has `cleanUrls`, so pages are `/home`, `/recent`, `/profile`, `/shop`, `/details?id=...` (`.html` redirects automatically). Landing page stays `/`.
* **Installable Android app (PWA)**: `manifest.webmanifest`, `sw.js`, icons in `assets/icons/`, offline page `/offline`. Chrome on Android shows "Install app" (also in the menu and footer). iPhone: Share -> Add to Home Screen. For a Play Store APK, wrap the site with PWABuilder.
* **Admin console**: `/AnimeVoid` (file `av-console-7q2x.html`, `assets/admin.*`). Backend setup in the backend repo's `SECURITY.md`.
* **Anonymous analytics** (`assets/telemetry.js`) feed the console; honours Do-Not-Track.
* **Live site config**: announcement bar and maintenance notice come from the console.
* `.well-known/security.txt`: edit the contact line.
