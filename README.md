# Sheikh Muhammed Ferej Megeno — website and admin

A multilingual (English, Arabic, Amharic, Afaan Oromoo) site for the scholar's lectures, articles, fatwas, courses,
library and events. **All content is managed from the admin**, which is also an installable PWA.

- **Stack:** Next.js 16 (App Router), React 19, next-intl, Tailwind CSS v4, libSQL / SQLite.
- **Single source of truth:** SQLite. The public site and the admin read and write the same database.
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
| `DATABASE_URL` | Defaults to `file:./data/sheikh_ferej.db`; a remote libSQL/Turso URL also works (`DATABASE_AUTH_TOKEN`) |
| `UPLOAD_DIR` | Where uploaded files are stored (default `./data/uploads`) |
| `MAX_UPLOAD_MB` | Upload size limit (default 500) |

In production the server refuses admin logins until the credentials and secrets are configured.

## What the admin manages

Lectures, series, articles, fatwas, courses (lessons and exams), library, events (and registrations), media gallery,
inquiries (including converting one into a fatwa), enrollments, certificates, the scholar profile, journey and
qualifications, social links, the Play Store link and which public sections are shown. Content can be saved as a
**draft** (hidden from the public site) or published. Audio, video, PDFs and images can be **uploaded** directly;
files are stored under `UPLOAD_DIR` and served from `/uploads/…` with range support. **Backup** exports and restores
everything as JSON.

## Admin as an app (PWA)

The admin is installable (Chrome, Edge, Android: "Install app" in the header or browser menu; iOS: Share → Add to
Home Screen). It ships a manifest (`public/admin.webmanifest`), icons (`public/icons`, regenerate with
`node scripts/generate-icons.mjs`) and a deliberately conservative service worker (`public/admin-sw.js`) scoped to
`/admin`: it caches only the offline page, icons and immutable build assets, never admin pages, API responses or
uploads, and shows an offline page when the network is unavailable. The service worker registers in production builds only.

## Deploy with Docker

SQLite needs a persistent disk and a single running instance.

```bash
cp .env.example .env     # fill in the admin credentials and secrets
docker compose up -d --build
```

The database and uploads live in the `sheikh_data` volume (`/app/data`). `GET /api/health` is the health check.
Put a TLS-terminating reverse proxy (Caddy, nginx, Traefik) in front — the PWA and secure cookies need HTTPS.

## Tests

End-to-end tests drive a real browser (Playwright's Chromium) against a running server:

```bash
npm run dev                                   # or a production build: npm run build && npm start
npm run test:e2e                              # admin workflows (auth, CRUD, uploads, exams, backup, i18n…)
BASE_URL=http://localhost:3000 ADMIN_USERNAME=… ADMIN_PASSWORD=… npm run test:pwa   # PWA, against a production server
npm run check-types
```

## Project layout

```
src/app/[locale]/…        public pages        src/app/admin/…     admin UI + server actions
src/app/api/…             public + admin API  src/app/uploads/…   file serving
src/lib/db/repository.ts  all reads/writes    src/lib/db/sqlite-schema.ts  versioned migrations
src/lib/auth/…            sessions and login  src/lib/api/…       public data layer (published content only)
src/i18n/…                locales and messages
```
