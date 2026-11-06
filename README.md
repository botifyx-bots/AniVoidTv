<div align="center">

  <img src="assets/logo.jpg" alt="AniVoidTV logo" width="180" />

  <h1>ANIVOID TV</h1>
  <p><strong>Enter the Void. Discover your next anime.</strong></p>

  <p>
    A feature-rich anime discovery and streaming frontend with personalized profiles,
    community features, animated customization, and an installable PWA experience.
  </p>

  <p>
    <a href="https://t.me/Animes_Void"><img src="https://img.shields.io/badge/Telegram-Community-229ED9?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram community"></a>
    <a href="https://t.me/quanxi_core"><img src="https://img.shields.io/badge/Contact-@quanxi__core-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Contact"></a>
    <img src="https://img.shields.io/badge/Version-v4-9B59B6?style=for-the-badge" alt="Version 4">
    <img src="https://img.shields.io/badge/Platform-Web%20%7C%20PWA-111827?style=for-the-badge" alt="Web and PWA">
  </p>

  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=111111" alt="JavaScript">
    <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
    <img src="https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white" alt="PWA">
    <img src="https://img.shields.io/badge/Responsive-Ready-16A34A?style=flat-square" alt="Responsive">
  </p>

  <p><em>Discover anime. Build your profile. Make the experience yours.</em></p>

</div>

---

## ✦ About AniVoidTV

**AniVoidTV** is an anime discovery and streaming web experience designed around more than just watching anime. It combines anime browsing, episode discovery, personal watch tracking, customizable user profiles, community interactions, and a visual customization shop in one interface.

The frontend is built with **HTML, CSS, and vanilla JavaScript**, while Vercel serverless functions securely proxy requests to the separate AniVoid backend and selected upstream anime data services.

The v4 release also includes an installable Progressive Web App (PWA), clean URLs, offline fallback support, an administrative console, and anonymous usage telemetry.

> **Project architecture:** This repository is the frontend. The complete experience depends on a separately hosted AniVoid backend. See [Backend configuration](#-backend-configuration) before deploying.

## ✦ Explore the experience

| Area | What you can do |
|---|---|
| **Discover** | Explore the home page, spotlight content, latest anime, top anime, and airing schedule. |
| **Browse** | Find recent, finished, and upcoming anime through dedicated listing pages. |
| **Anime details** | View series information, add titles to your list, and interact through comments, reactions, and stickers. |
| **Watch** | Open the watch experience, resume episodes, and keep track of viewing progress. |
| **Personal profile** | Customize your identity, profile banner, avatar, effects, pictures, privacy, and account settings. |
| **Void Shop** | Preview and personalize visual effects, titles, and sticker packs. |
| **Community** | Explore public profiles and community-oriented features. |
| **Install as an app** | Install AniVoidTV on supported devices through its PWA manifest and service worker. |

## ✦ Feature highlights

### Anime discovery and browsing

- Spotlight hero section on the home page.
- Latest anime listings with pagination.
- Top anime and anime schedule sections.
- Dedicated Recent, Finished, Upcoming, and Search pages.
- Anime detail pages with list actions and community interactions.
- Series and recent-anime API proxy routes.
- Clean, shareable page URLs.

### Watch experience

- Dedicated anime watch page.
- Continue Watching support.
- Episode progress and watched-episode tracking.
- Resume the last watched episode.
- Player page and offline fallback page.

### Personalized profiles

- Profile dashboard with a Telegram-inspired layout.
- Custom display name and profile identity.
- Avatar and banner customization.
- Five visual effect slots.
- Default avatar and banner presets.
- Picture galleries, image cropping, and main-picture selection.
- Watch List and Continue Watching sections.
- Bio, privacy, username, password, and device settings.
- Public profile pages.

### Void Shop and visual customization

- **101 visual effects** available in the shop catalog.
- Titles and sticker packs.
- Live previews using your own avatar and display name.
- Animated profile decorations.
- Illustrated SVG overlay effects.
- Banner scenes with animated particles and silhouettes.
- Custom name and card effects.
- Original animated sticker collection.

### Community interactions

- Comments on anime detail pages.
- Animated reactions.
- Sticker-based interactions.
- Public user profiles.
- Profile badges, favorites, and rank/VP presentation.

> **Development note:** Friends and Notifications tabs are marked as coming soon in this version.

### PWA and offline support

- Installable web app experience.
- Web app manifest and app icons.
- Service worker for repeat-visit caching.
- Offline fallback page.
- Cached static assets and selected images.
- Private and dynamic API responses are intentionally not cached by the service worker.
- Reduced-motion preferences are respected by the animation system.

### Admin and site management

- Separate administrative console at `/AnimeVoid`.
- Anonymous telemetry for the admin console.
- Live announcement bar and maintenance notice configuration through the backend.
- Dedicated security headers and a restrictive console policy.
- Admin console responses are configured to avoid search indexing and caching.

---

## ✦ Pages and routes

With Vercel `cleanUrls` enabled, the main pages can be accessed without the `.html` extension.

| Route | File | Purpose |
|---|---|---|
| `/` | `index.html` | Landing page, search, popular searches, and entry points |
| `/home` | `home.html` | Main dashboard, spotlight, latest, top anime, and schedule |
| `/recent` | `recent.html` | Recently added anime |
| `/aired` | `aired.html` | Finished anime |
| `/upcoming` | `upcoming.html` | Upcoming anime |
| `/search` | `search.html` | Anime search |
| `/details?id=...` | `details.html` | Anime information, list actions, and comments |
| `/watch` | `watch.html` | Watch and episode progress experience |
| `/profile` | `profile.html` | Your personal profile dashboard |
| `/user?u=...` | `user.html` | Public user profile |
| `/shop` | `shop.html` | Void Shop and customization previews |
| `/offline` | `offline.html` | Offline fallback page |
| `/AnimeVoid` | `av-console-7q2x.html` | Administrative console |

The `/AnimeVoid` route is rewritten to the console file by `vercel.json`. Keep the console URL and its access controls private to authorized staff.

## ✦ Technology stack

| Technology | Role |
|---|---|
| HTML5 | Page structure and content |
| CSS3 | Responsive layouts, themes, animations, and visual effects |
| Vanilla JavaScript | UI logic, navigation, profile features, and API interactions |
| SVG | Icons, decorations, and illustrated overlays |
| Vercel Functions | Server-side API proxy and upstream API routes |
| Vercel | Frontend hosting, rewrites, headers, and serverless execution |
| Service Worker | Asset caching and offline fallback |
| Web App Manifest | Installable PWA metadata and shortcuts |
| Google Identity Services | Google sign-in integration |
| Anikoto API | Upstream source used by the recent-anime and series proxy routes |
| AniVoid Backend | Authentication, profiles, lists, comments, shop, configuration, and other application services |

**No frontend framework or build step is required by the current source structure.** The site is served as static HTML/CSS/JavaScript alongside Vercel serverless functions.

---

## ✦ Project structure

```text
AniVoidTV/
│
├── index.html
├── home.html
├── recent.html
├── aired.html
├── upcoming.html
├── search.html
├── details.html
├── watch.html
├── player.html
├── profile.html
├── user.html
├── shop.html
├── offline.html
├── 404.html
│
├── av-console-7q2x.html
├── manifest.webmanifest
├── sw.js
├── vercel.json
├── DEPLOY.md
├── robots.txt
│
├── api/
│   ├── proxy.js
│   ├── recent.js
│   └── series/
│       └── [id].js
│
├── assets/
│   ├── logo.jpg
│   ├── favicon.svg
│   ├── style.css
│   ├── site.css
│   ├── home.css
│   ├── theme.css
│   ├── effects.css
│   ├── decorations.css
│   ├── bannerfx.css
│   ├── admin.css
│   │
│   ├── site.js
│   ├── home.js
│   ├── nav.js
│   ├── icons.js
│   ├── stickers.js
│   ├── community.js
│   ├── profile.js
│   ├── profile-ui.js
│   ├── user-page.js
│   ├── shop.js
│   ├── admin.js
│   ├── cropper.js
│   ├── decorations.js
│   ├── bannerfx.js
│   ├── fx-recipes.js
│   ├── telemetry.js
│   ├── pwa.js
│   │
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   ├── maskable-512.png
│   │   ├── apple-touch-icon.png
│   │   └── favicon-48.png
│   │
│   └── pages/
│       ├── index.js
│       ├── recent.js
│       ├── aired.js
│       ├── upcoming.js
│       ├── search.js
│       ├── details.js
│       ├── watch.js
│       ├── player.js
│       └── offline.js
│
└── .well-known/
    └── security.txt
```

## ✦ Getting started

### Requirements

Before running the project, make sure you have:

- Git
- Node.js (for local serverless-function tooling, if used)
- A Vercel account for the intended deployment
- Access to a separately deployed AniVoid backend
- The backend's proxy secret
- A Google OAuth client ID if Google sign-in is enabled

### 1. Clone the repository

```bash
git clone https://github.com/botifyx-bots/AniVoidTV.git
cd AniVoidTV
```

Replace the repository URL with your actual GitHub repository URL.

### 2. Run the static frontend locally

For a quick frontend-only preview, you can use Python's static server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

> A static server is suitable for checking the pages and styling. It does **not** execute Vercel serverless functions or provide the complete backend-powered experience. API-dependent features need the backend and proxy routes to be configured.

### 3. Deploy to Vercel

1. Push the project to a GitHub repository.
2. Open [Vercel](https://vercel.com/).
3. Import the repository.
4. Keep `vercel.json`, `api/`, and the frontend files at the project root.
5. Configure the required environment variables.
6. Deploy the project.
7. Check the API proxy diagnostic route after deployment.

No frontend build command is required for the current static source. Ensure Vercel uses the repository root as the project root.

---

## ✦ Backend configuration

AniVoidTV's frontend communicates with a separate backend through `api/proxy.js`.

Configure these environment variables in **Vercel → Project → Settings → Environment Variables**:

| Variable | Required | Description |
|---|---:|---|
| `BACKEND_URL` | Yes | Base URL of the deployed AniVoid backend, for example `https://your-backend.example.com` |
| `PROXY_SECRET` | Yes for trusted proxy setup | Shared secret that must match the backend's `PROXY_SECRET` value |

Example values (use your own real values):

```env
BACKEND_URL=https://your-backend.example.com
PROXY_SECRET=replace_with_a_long_random_secret
```

These are Vercel environment variables, not values to paste into frontend JavaScript or commit to Git.

### Backend responsibilities

The proxy forwards supported application API areas to the backend, including:

- Authentication and user sessions.
- User profiles and account settings.
- Watch lists and Continue Watching.
- Comments and reactions.
- Shop and customization data.
- Site configuration.
- Media and profile pictures.
- Reporting and other supported application endpoints.

The backend must be deployed and configured independently. This frontend archive does not include the backend implementation.

### Verify the proxy

After deploying and configuring the environment variables, visit:

```text
https://YOUR_DOMAIN/api/v1/_debug
```

The diagnostic response reports whether the proxy is running, whether the required environment variables are set, and whether the backend can be reached.

Do not share secrets or expose private backend configuration in screenshots or public issue reports.

---

## ✦ API routes included in this repository

| Frontend route | Upstream / destination | Purpose |
|---|---|---|
| `/api/v1/*` | AniVoid backend through `api/proxy.js` | Main application API |
| `/api/v1/_debug` | Backend health check | Proxy diagnostic |
| `/api/recent?page=1&per_page=20` | `anikotoapi.site/recent-anime` | Recent anime data |
| `/api/series/{id}` | `anikotoapi.site/series/{id}` | Series data |

The main proxy uses an allow-list of backend route groups, restricts HTTP methods, applies request-origin checks for writes, and enforces a 3 MB request-body limit. Successful public GET responses for selected data categories can be cached at the edge.

The recent and series functions are separate Vercel serverless routes. They forward requests to the configured upstream API and apply response caching.

> Upstream APIs are third-party dependencies. Their availability, response format, terms, and content can change independently of this repository.

## ✦ Security and deployment notes

Security is part of the deployment configuration. Keep these points in mind:

- **Never commit secrets.** Do not commit `PROXY_SECRET`, Google client secrets, service-account files, or private backend credentials.
- Google sign-in requires the public client ID to be configured on the backend as `GOOGLE_CLIENT_ID`; do not put a Google client secret in this frontend repository.
- If a secret has been committed publicly, rotate it. Removing the file in a later commit does not remove it from Git history.
- `vercel.json` configures Content Security Policy and additional security headers, including HSTS, `nosniff`, frame restrictions, referrer policy, and permissions policy.
- The player pages currently permit HTTPS frames through `frame-src`. For a production deployment, restrict this directive to the player hosts you actually trust.
- The API proxy forwards only explicitly allowed backend route groups.
- The proxy applies same-origin checks to browser-initiated write requests.
- User-facing text is rendered using escaping or `textContent` in the frontend code.
- Uploaded pictures should be validated and re-encoded by the backend.
- The service worker intentionally avoids caching private or dynamic API responses.
- The admin console has separate restrictive headers and is configured with `noindex`, `nofollow`, and no-store caching.
- Review `.well-known/security.txt` and replace its placeholder contact with a valid security contact before production.

For more deployment detail, read [`DEPLOY.md`](DEPLOY.md).

## ✦ Custom effects catalog

Some visual assets are generated from the backend's effects catalog:

- `assets/effects.css`
- `assets/fx-recipes.js`

When the backend repository is available, the deployment guide documents generating these files with:

```bash
python tools/gen_effects.py ../AniVoidTV/assets/effects.css ../AniVoidTV/assets/fx-recipes.js
```

Run this from the backend repository in the directory structure expected by that script. Commit the generated frontend assets when you want the updated catalog to be included in a frontend deployment.

## ✦ PWA installation

AniVoidTV includes a web app manifest, app icons, and a service worker.

**Android / supported desktop browsers**
1. Open the deployed website over HTTPS.
2. Use the browser's Install App option, if available.
3. Launch AniVoidTV from your installed apps.

**iPhone / iPad**
1. Open the website in Safari.
2. Tap Share.
3. Choose **Add to Home Screen**.

The PWA manifest also defines shortcuts for Latest episodes, Schedule, My profile, and Void Shop.

The offline page provides a fallback when a navigation request cannot be completed. Anime streaming and account features still require a network connection.

## ✦ Current limitations and notes

- Friends and Notifications are marked as coming soon in this release.
- Schedule times are displayed as supplied by the data source; the frontend does not guarantee a particular timezone.
- Some pages and profile actions require the separate AniVoid backend.
- Google sign-in requires valid backend-side OAuth configuration.
- The admin console requires the backend's own authorization and security setup.
- The frontend-only Python preview does not reproduce Vercel serverless behavior.
- Third-party anime data and player availability are outside the frontend repository's control.

## ✦ Roadmap

Potential areas for future development:

- [ ] Complete Friends and Notifications experiences.
- [ ] Expand profile and community interactions.
- [ ] Improve accessibility and keyboard navigation across all pages.
- [ ] Add more granular player-host restrictions to the Content Security Policy.
- [ ] Add project screenshots and a live demo link.
- [ ] Document the separate backend repository and its setup alongside this frontend.

## ✦ Contributing

Contributions, bug reports, and thoughtful suggestions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes and test the affected pages.
4. Commit your work:

   ```bash
   git commit -m "Add: your feature"
   ```

5. Push your branch and open a Pull Request.

When reporting a bug, include the page route, browser/device, steps to reproduce, and relevant console or network errors. Never include passwords, session cookies, API secrets, or private account information.

## ✦ Credits and community

<div align="center">

  **Creator / project contact**

  <a href="https://t.me/quanxi_core">
    <img src="https://img.shields.io/badge/Quanxi-Project%20Contact-8B5CF6?style=for-the-badge&logo=telegram&logoColor=white" alt="Quanxi project contact">
  </a>

  <br>

  **Community**

  <a href="https://t.me/Animes_Void">
    <img src="https://img.shields.io/badge/Join%20the%20Anime%20Void%20Community-229ED9?style=for-the-badge&logo=telegram&logoColor=white" alt="Anime Void community">
  </a>

</div>

## ✦ License

No license file was included in the supplied project archive. Until a license is added by the project owner, do not assume that the source is open for unrestricted redistribution, modification, or commercial use.

If you intend to publish this repository, add a `LICENSE` file that clearly states the permissions and restrictions you want.

---

<div align="center">

  <h3>ANIVOID TV</h3>
  <p><strong>Beyond watching. Into the Void.</strong></p>
  <p>
    <a href="https://t.me/Animes_void">Community</a>
    &nbsp;·&nbsp;
    <a href="https://t.me/quanxi_core">Contact</a>
  </p>

  <sub>Built for anime fans. Crafted for the Void.</sub>

</div>
