# Sheikh Muhammed Ferej Megeno — website and admin

A multilingual (English, Arabic, Amharic, Afaan Oromoo) site for the scholar's lectures, articles, fatwas, courses,
library and events. **All content is managed from the admin**, which is also an installable PWA.

- **Stack:** Next.js 16 (App Router), React 19, next-intl, Tailwind CSS v4, SQLite (libSQL) **or PostgreSQL / Supabase**.
- **Single source of truth:** the database (SQLite by default; Postgres when `DATABASE_URL` is a `postgres://` URL). The public site and the admin read and write the same database.
  `src/lib/db/seed/content-seed.json` is only used to fill a brand-new database (and by "Reset to seed data").

## Run it locally

```bash
npm install
npm run dev            # http://localhost:3002
```

The database is created at `data/sheikh_ferej.db` and seeded on first start. In development the admin login is
`admin` / `sheikh_admin_2026!` (set in `.env.local`, and the built-in fallback if unset). Production never falls back to defaults — see below.

## Configuration

Copy `.env.example` to `.env` (Docker) or `.env.local` (local) and set:

| Variable | Purpose |
|---|---|
| `ADMIN_USERNAME` | Admin login name (required in production) |
| `ADMIN_PASSWORD_HASH` | scrypt hash of the password — generate with `node scripts/hash-password.mjs "your password"` (or set `ADMIN_PASSWORD`) |
| `ADMIN_SESSION_SECRET` | 16+ random characters used to sign session cookies (required in production) |
| `CERTIFICATE_SECRET` | Signs certificate verification tokens (required in production) |
| `DATABASE_URL` | Defaults to `file:./data/sheikh_ferej.db`. A `postgres://` URL (Supabase pooler) switches to Postgres; remote libSQL/Turso also works (`DATABASE_AUTH_TOKEN`) |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | Push notifications. Generate once with `npm run vapid` and keep them: changing them cancels every subscribed device. Without them the app works but sends no notifications |
| `UPLOAD_DIR` | Where uploaded files are stored (default `./data/uploads`) |
| `UPLOAD_STORAGE` | `database` or `filesystem`. Defaults to `database` on Vercel + Postgres (no writable disk), `filesystem` elsewhere |
| `MAX_UPLOAD_MB` | Upload size limit (default 500; 4 when files are stored in the database) |

Create a unique administrator with `npm run seed:admin`. This idempotent command saves private login details in the Git-ignored `.env.admin-login.local` (mode 600) and configures a scrypt password hash and random session secret in `.env.local` and `.env.vercel`. Use `npm run seed:admin -- --rotate` only when intentionally rotating the password and invalidating sessions.

On Vercel, configure `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` as encrypted production variables, then deploy. Production refuses login when credentials are missing; demo credentials are available only in unconfigured development environments.

## What the admin manages

Lectures, series, articles, fatwas, courses (lessons and exams), library, events (and registrations), media gallery,
inquiries (including converting one into a fatwa), enrollments, certificates, the scholar profile, journey and
qualifications, social links, the Play Store link and which public sections are shown. Content can be saved as a
**draft** (hidden from the public site) or published. Audio, video, PDFs and images can be **uploaded** directly;
files are stored under `UPLOAD_DIR` and served from `/uploads/…` with range support. **Backup** exports and restores
everything as JSON.

## Admin as an app (PWA) with notifications

The admin installs like a native app and **only ever opens the admin**: the installed app redirects any public
page to `/admin` and hides links to the public site. The public website itself is unchanged for visitors.

- **Install:** Android/desktop Chrome and Edge show *Install app* (header "⋯" menu, or the browser's install button).
  On iPhone/iPad use Share → *Add to Home Screen* (required before notifications can work on iOS 16.4+).
- **Notifications:** open "⋯" → *Notifications* → *Turn on notifications*. The Sheikh's devices then get a message for
  a new question, an event registration, a new course enrollment and a student passing an exam. Messages carry no
  personal details; the unanswered-questions count also appears on the app icon where supported.
- **Shortcuts:** long-press the app icon for *New lesson*, *New article*, *Questions* and *Add media*.
- **Offline:** an offline page is shown when there is no connection; admin pages and data are never cached.
- Files: `public/admin.webmanifest`, `public/admin-sw.js` (scope `/admin`), `public/admin-offline.html`, `public/icons/`
  (regenerate with `npm run icons`), `src/components/admin/pwa/`.

### Setting up notifications on a server

```bash
npm run vapid          # prints VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT: run once, store them safely
```

Add the three variables to `.env` / Vercel and redeploy. Push needs HTTPS (localhost is exempt).
Subscriptions are stored in the database (`push_subscriptions`), so they survive restarts and redeploys.

### Testing on real devices (checklist)

1. **Android Chrome:** open the site's `/admin`, install, open from the icon, *Turn on notifications*, press *Send a test*,
   then trigger each event from the public site (ask a question, register for an event, enroll, pass an exam) and tap the
   notification: it must open the right admin page. Check the icon badge shows the unanswered count.
2. **iPhone (iOS 16.4+):** Safari → Share → Add to Home Screen → open it from the home screen → *Turn on notifications*
   (the button is explained but disabled in a normal Safari tab) → send a test.
3. **Desktop Chrome/Edge:** install from the address bar and check the shortcuts menu and the offline page (turn off Wi-Fi).
4. In the installed app, try opening a public address: it must land on the admin.

## Tests

```bash
npm run test:unit        # pure logic: links, slugs, rich text, XSS, push encryption (no server)
npm run test:i18n        # all four language files have the same keys
npm run test:media       # playlist ordering, draft visibility, duplicate audio and file availability
npm run test:media:e2e   # public catalogue, playback, mobile locales and all audio links (app running)
npm run test:admin-auth  # production credential and malformed-hash checks
npm run test:sharing     # safe excerpts, edited translations and landing-page visibility
npm run test:sharing:e2e # every seeded article/fatwa PNG, downloads, copy links and multilingual previews
npm run test:admin-audit # real login, all sidebar routes and reversible landing-page/credential edits
npm run test:e2e         # the full admin workflow in a real browser (needs the app running)
npm run test:pwa         # manifest, service worker, installed-app lock
npm run test:push        # notifications; start the app with PUSH_TEST_SINK=http://127.0.0.1:4599/sink
```

For media browser checks, start the app with `--hostname localhost` and set `BASE_URL=http://localhost:3002`; set `CHROMIUM_PATH` if your Chromium binary is elsewhere.

Set `BASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` for a different server, and `E2E_SLOW=4` for a remote database.

## Deploy on Vercel with Supabase

Vercel has no persistent disk, so use Postgres. In the Supabase dashboard open **Connect** and copy the
**transaction pooler** connection string (port 6543). In Vercel → Settings → Environment Variables set
`DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` and `CERTIFICATE_SECRET`, then redeploy.
The schema is created and the site seeded automatically on the first request.

- Uploads are kept in the database on Vercel and are limited to about 4 MB (the platform's request-size limit).
  Large audio should be hosted elsewhere (YouTube, Telegram, a CDN) and linked by URL.
- The pooler does not support prepared statements or pipelined queries; the app is already configured for that.

## Deploy with Docker

SQLite needs a persistent disk and a single running instance.

```bash
cp .env.example .env     # fill in the admin credentials and secrets
docker compose up -d --build
```

The database and uploads live in the `sheikh_data` volume (`/app/data`). `GET /api/health` is the health check.
Put a TLS-terminating reverse proxy (Caddy, nginx, Traefik) in front — the PWA and secure cookies need HTTPS.

## Project layout

```
src/app/[locale]/…        public pages        src/app/admin/…     admin UI + server actions
src/app/api/…             public + admin API  src/app/uploads/…   file serving
src/lib/db/repository.ts  all reads/writes    src/lib/db/sqlite-schema.ts  versioned migrations
src/lib/auth/…            sessions and login  src/lib/api/…       public data layer (published content only)
src/i18n/…                locales and messages
```

## Article and fatwa sharing

Every published detail page has native link sharing, a copyable canonical slug URL, WhatsApp/Telegram/Facebook links, and a downloadable 1080 × 1350 PNG post excerpt. Devices supporting file sharing can share the PNG directly. Open Graph previews use a separate 1200 × 630 layout. Images include the title, a clearly labelled excerpt, attribution and the complete source URL. Drafts and unknown slugs have no public image. Bundled fonts and Sharp/Pango support Arabic and Ethiopic without runtime font downloads. Font licenses are included under `public/fonts/`.

Run destructive admin workflow and backup tests only against an isolated test database. `LIVE_ADMIN_AUDIT=1` makes the sidebar audit read-only; it skips profile and qualification changes. Pass test credentials through environment variables without committing private environment files.

Admin sessions expire 30 days after sign-in, with the same deadline enforced by the cookie, signed token and database session. An open or resumed admin app returns to login when its session expires. Changing the configured username invalidates sessions for the previous name. The admin header provides installation and notification controls, with Android and iPhone/iPad guidance in all four languages; notification permission is requested only after the user taps the enable button.
