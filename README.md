# MU.LAB — Client Intake & Project Discovery

A premium, production-ready client onboarding platform for **MU.LAB**, a digital development studio.
Clients move through an elegant multi-step brief; the studio owner receives a beautifully formatted
email containing the complete project brief, with the client's address set as `Reply-To`.

> Design direction: pure black, bold white typography, precise layouts, restrained cinematic motion.

<br />

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Gmail App Password setup](#gmail-app-password-setup)
- [How the email workflow works](#how-the-email-workflow-works)
- [Testing](#testing)
- [Production build](#production-build)
- [Deployment](#deployment)
- [Manual end-to-end Gmail verification checklist](#manual-end-to-end-gmail-verification-checklist)
- [Security notes](#security-notes)
- [Accessibility & internationalisation](#accessibility--internationalisation)
- [Optional persistence (PostgreSQL + Drizzle)](#optional-persistence-postgresql--drizzle)
- [Honest limitations](#honest-limitations)

---

## Overview

The platform is a two-part application:

| Part | Description | Stack |
| --- | --- | --- |
| `frontend/` | The premium client intake experience (landing → wizard → success) | React + Vite + TypeScript + Tailwind + Framer Motion + React Hook Form + Zod |
| `backend/` | A hardened API that validates briefs and delivers them by Gmail SMTP | Node + Express + TypeScript + Nodemailer + Zod |

There is **no fake submission flow**. The API only reports success after the mail transport has
accepted the message. There are no placeholder buttons or non-functional controls.

---

## Features

**Experience**

- Cinematic landing hero with restrained, line-by-line reveal motion (`prefers-reduced-motion` respected).
- Six-step wizard: Client Information · Vision · Experience · Identity · Practicalities · Review.
- Elegant animated progress indicator with clickable completed steps.
- Selectable cards, animated checkboxes, and custom radio components.
- Professional review screen with per-section **Edit** buttons that jump back without losing data.
- Animated success screen with submission reference, email, and timestamp.
- Full **English / Arabic** bilingual interface with automatic **RTL** layout.
- Draft autosave to `localStorage`, restored after refresh (consent fields are never persisted).
- Graceful loading, error, and success states with toast notifications.

**Backend**

- Server-side Zod validation with field-level errors (mirrors the client schema).
- Gmail SMTP delivery via Nodemailer using a Google App Password.
- Elegant HTML owner email (white background, black type, MU.LAB identity) **plus** plain-text fallback.
- Optional client acknowledgement email (configurable; a failure never invalidates the submission).
- Helmet, restricted CORS, rate limiting, honeypot spam prevention, and HTML escaping.
- Idempotency by submission id to prevent duplicate notifications.

---

## Tech stack

**Frontend:** React 18 · Vite 6 · TypeScript · Tailwind CSS · Framer Motion · React Hook Form ·
Zod · Lucide React · TanStack Query · React Hot Toast · shadcn-style UI primitives (CVA + clsx + tailwind-merge).

**Backend:** Node 20+ · Express · TypeScript · Nodemailer (Gmail SMTP) · Zod · Helmet · CORS ·
express-rate-limit · Vitest + Supertest.

---

## Project structure

```text
mulab-client-intake/
├── frontend/
│   ├── public/
│   │   ├── logo.png          # original MU.LAB logo
│   │   └── privacy.html      # working privacy policy page
│   ├── src/
│   │   ├── components/       # reusable UI (inputs, cards, progress, review, success…)
│   │   ├── features/
│   │   │   └── client-intake/  # wizard, hero, steps
│   │   ├── i18n/             # EN/AR translations, options, LanguageProvider
│   │   ├── lib/              # cn, api client, draft storage
│   │   ├── pages/            # Landing
│   │   ├── schemas/          # client Zod schema (+ per-step field map)
│   │   ├── styles/           # tailwind entry
│   │   ├── types/            # shared option constants & types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vercel.json           # Vercel deployment config
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/           # validated environment
│   │   ├── controllers/      # brief controller
│   │   ├── lib/              # logger, Turso persistence, idempotency store
│   │   ├── middleware/       # rate limiting, error handling
│   │   ├── routes/           # /api/brief
│   │   ├── services/         # email + submission orchestration
│   │   ├── templates/        # owner & client HTML/text email templates
│   │   ├── utils/            # html escaping, async handler
│   │   ├── validators/       # Zod brief schema
│   │   ├── app.ts            # express app (Vercel entry + testable factory)
│   │   └── server.ts         # local http entrypoint
│   ├── tests/                # Vitest + Supertest (mocked transport)
│   ├── vercel.json           # Vercel deployment config
│   └── package.json
│
├── .env.example
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js 20+** and npm.
- A **Google account** with 2-Step Verification enabled (required to create an App Password).

---

## Local development

```bash
# 1) Install everything
npm run install:all

# 2) Configure the backend
copy backend\.env.example backend\.env      # Windows
# cp backend/.env.example backend/.env      # macOS / Linux
# then edit backend/.env with your Gmail values

# 3) Run the API (terminal 1)
npm run dev:backend        # http://localhost:5000

# 4) Run the frontend (terminal 2)
npm run dev:frontend       # http://localhost:5173
```

Open http://localhost:5173. The Vite dev server proxies `/api/*` to `http://localhost:5000`,
so no frontend API configuration is needed in development.

Useful root scripts:

| Script | Purpose |
| --- | --- |
| `npm run install:all` | Install backend + frontend dependencies |
| `npm run dev:backend` | Start the API in watch mode |
| `npm run dev:frontend` | Start the Vite dev server |
| `npm run build` | Production build of backend + frontend |
| `npm run typecheck` | Type-check both projects |
| `npm test` | Run the backend test suite |

---

## Environment variables

All backend variables live in `backend/.env` (never committed):

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | no (default `5000`) | API port |
| `NODE_ENV` | no (default `development`) | `development` \| `test` \| `production` |
| `CLIENT_URL` | recommended | Comma-separated allowed browser origins for CORS |
| `GMAIL_USER` | yes (to send) | The authenticated Gmail address (the sender) |
| `GMAIL_APP_PASSWORD` | yes (to send) | 16-character Google App Password |
| `OWNER_EMAIL` | yes (to send) | Recipient of the project brief |
| `MAIL_FROM_NAME` | no (default `MU.LAB`) | Display name for the sender |
| `SEND_CLIENT_CONFIRMATION` | no (default `true`) | Send the client acknowledgement |
| `PRIVACY_POLICY_URL` | no | Privacy link included in the client email |
| `TURSO_DATABASE_URL` | no | Turso/libSQL URL for durable persistence (in-memory fallback if unset) |
| `TURSO_AUTH_TOKEN` | no (with URL) | Turso auth token |

Frontend variables live in `frontend/.env` (all optional): `VITE_API_URL`, `VITE_PRIVACY_URL`,
`VITE_STORAGE_ENABLED`.

> If the Gmail variables are missing, the API still runs and validates requests, but returns
> `503 Email delivery is not configured yet.` when a brief is submitted. The `/api/health`
> endpoint reports `emailConfigured: false` in that case.

---

## Gmail App Password setup

Gmail SMTP requires an **App Password** — your normal Google password will not work.

1. Go to your Google Account → **Security**.
2. Enable **2-Step Verification** (App Passwords require it).
3. Open **App passwords** (https://myaccount.google.com/apppasswords).
4. Create a new app password (name it e.g. "MU.LAB Intake").
5. Copy the **16-character** password (spaces are fine; you can paste it with or without them).
6. Put it in `backend/.env` as `GMAIL_APP_PASSWORD`, and set `GMAIL_USER` / `OWNER_EMAIL`.

Notes:

- The sender **must** be the authenticated account (`GMAIL_USER`). We never spoof the client's address.
- Google may block sign-in from unfamiliar servers, especially in cloud regions; if delivery fails,
  review the "Less secure app" / App Password guidance and any Google security alerts on the account.
- Gmail App Password SMTP is ideal for a low-volume studio inbox. For higher volume, prefer the Gmail
  API (OAuth2) or a transactional provider (Resend, Postmark, SES).

---

## How the email workflow works

On `POST /api/brief`:

1. **Honeypot** — the hidden `website` field is checked first; filled submissions are discarded silently.
2. **Validation** — the body is parsed with the server-side Zod schema; failures return `422` with field errors.
3. **Idempotency** — the client `submissionId` is reserved atomically. Duplicate delivered submissions
   return the original reference; concurrent duplicates return `409`.
4. **Delivery** — the owner email is sent via Gmail SMTP with `Reply-To: <client email>`.
5. **Ack** — the optional client confirmation is sent best-effort (never blocks success).
6. **Response** — `200` is returned **only** after the transport accepts the owner email. Transport
   failures return `502` and the submission is marked failed (a retry with the same id is allowed).

The owner email subject is `[MU.LAB] New Project Inquiry — {Project Name}` and includes the reference id,
timestamp, and every submitted field, in both HTML and plain text.

---

## Testing

```bash
npm test          # from the repo root (runs the backend suite)
# or
cd backend && npm test
```

The suite uses **Vitest + Supertest** and **mocks the Nodemailer transport** — no real emails are sent.
It covers:

- valid submission → `200` with reference id
- invalid email / missing required fields → `422` with field errors
- honeypot submissions → discarded, no email sent
- SMTP failure → `502`
- duplicate submission id → single notification, duplicate reported
- `Reply-To` equals the client email and sender is the authenticated account
- `/api/health` reports the email configuration state

To verify in a real environment, run a manual end-to-end check (see below) with real credentials.

---

## Production build

```bash
npm run build
# backend  -> backend/dist  (run with: node backend/dist/server.js)
# frontend -> frontend/dist (static assets)
```

---

## Deployment

Both the frontend and the backend are deployed on **Vercel**.

### Frontend → Vercel

1. Import the `frontend/` directory as the project root.
2. Build command `npm run build`, output directory `dist` (already set in `frontend/vercel.json`).
3. `frontend/vercel.json` proxies `/api/*` to the backend (rewrite to the backend deployment URL),
   so the frontend and API share one origin and no CORS configuration is needed in production.
4. Optional: set `VITE_PRIVACY_URL` to override the privacy policy link.

> If you change the backend URL, update the `/api/(.*)` rewrite in `frontend/vercel.json`
> and redeploy the frontend.

### Backend → Vercel

The backend runs as a single Vercel Function via zero-config **Express detection**: `src/app.ts`
default-exports the Express app and Vercel runs it for every route, so all `/api/*` paths
(including nested ones such as `/api/health/db`) are served by one function.

1. Import the `backend/` directory as the project root.
2. `backend/vercel.json` pins `installCommand` to `npm ci --include=dev` (Vercel installs with
   `NODE_ENV=production`, which would otherwise omit the dev dependencies needed to build).
3. Set the environment variables: `NODE_ENV`, `CLIENT_URL` (comma-separated allowed origins, e.g.
   the frontend production URL), `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `OWNER_EMAIL`, `MAIL_FROM_NAME`,
   `SEND_CLIENT_CONFIRMATION`, `PRIVACY_POLICY_URL`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
   `SMTP_HOST` (`smtp.gmail.com`), and `SMTP_PORT` (`465`).
4. Health check path: `/api/health` (also `/api/health/db` and `/api/health/email`).

> **Why Vercel for the backend?** Gmail SMTP over ports 465/587 works on Vercel Functions
> (AWS Lambda only blocks port 25). Render's free tier blocks outbound SMTP ports 25/465/587.
>
> On any host, remember to set `CLIENT_URL` to your deployed frontend origin, otherwise CORS will
> reject browser requests.

---

## Manual end-to-end Gmail verification checklist

Run this after configuring real credentials. Until it succeeds, live Gmail delivery should be treated
as **unverified**.

- [ ] `backend/.env` contains real `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `OWNER_EMAIL`, `CLIENT_URL`.
- [ ] Start the API and confirm the log line `emailConfigured: true`.
- [ ] `GET /api/health/email` returns `{ "ok": true }` (SMTP connection verified).
- [ ] Open the frontend, complete all six steps, and submit.
- [ ] The success screen appears **only** after the server returns `200`.
- [ ] The owner inbox receives `[MU.LAB] New Project Inquiry — …` within a minute.
- [ ] **Reply** in the mail client pre-fills the client's address (verifies `Reply-To`).
- [ ] The sender shows the authenticated Gmail account, not the client.
- [ ] With `SEND_CLIENT_CONFIRMATION=true`, the client receives `MU.LAB — We've Received Your Project Brief`.
- [ ] Submitting the same brief twice does not send duplicate owner notifications.
- [ ] Temporarily breaking the App Password returns a `502` and the UI shows an error (no false success).

---

## Security notes

- Credentials live only in server-side environment variables; never in frontend code or the repo.
- `.env` is git-ignored. Only `.env.example` is committed.
- Server-side Zod validation, input length limits, Helmet, restricted CORS, and rate limiting are enabled.
- User input is HTML-escaped before being placed in email templates; subjects are single-lined.
- A honeypot field and an idempotency key guard against spam and duplicate notifications.
- Passwords, credentials, and full payloads are never logged.
- File uploads are hidden by default; direct upload stays disabled until **signed/authenticated storage**
  is configured (`VITE_STORAGE_ENABLED=true` + a real storage backend). Reference **links** are supported
  today so no broken control is shown.

---

## Accessibility & internationalisation

- Keyboard navigation, visible focus rings, semantic labels, and screen-reader-announced errors.
- WCAG 2.2 AA-oriented contrast on the monochrome palette.
- Reduced-motion support across all animations.
- Switch language (EN ⇄ AR) from the navbar; the document `dir` and font switch automatically.

---

## Durable persistence (Turso / libSQL + Drizzle)

Submissions and idempotency state are persisted to **Turso (libSQL)** via **Drizzle ORM** when
`TURSO_DATABASE_URL` (and `TURSO_AUTH_TOKEN`) are configured. On startup the API creates the
`submissions` table if needed, and every accepted brief is stored with its reference id, status,
and a JSON payload for audit.

- **Configured** → duplicate protection and audit survive restarts and work across multiple instances.
- **Not configured** → the API falls back to a bounded in-memory store (single instance only).

```bash
# Create a Turso database and get the URL + token
turso db create mulab-intake
turso db show mulab-intake --url
turso db tokens create mulab-intake
```

Relevant endpoints:

- `GET /api/health` → includes `databaseConfigured`
- `GET /api/health/db` → pings the database (`{ "ok": true, "reachable": true }`)

The table is created automatically; no migration tooling is required. `backend/src/lib/schema.ts`
defines the Drizzle schema if you later want to generate migrations with `drizzle-kit`.

---

## Honest limitations

- **Live Gmail delivery has not been executed in this environment** because no real credentials are
  configured here. The delivery code path is fully implemented and unit-tested with a mocked transport.
  Complete the manual checklist above to validate real sending.
- The in-memory idempotency store does not survive restarts; use the PostgreSQL option for production-grade
  durability.
- Direct file uploads are intentionally disabled until secure storage is wired up; use reference links.

---

MU.LAB — *Digital Experiences, Thoughtfully Engineered.*
