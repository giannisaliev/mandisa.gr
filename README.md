# Eva Mandisa — website & admin dashboard

A from-scratch rebuild of [mandisa.gr](https://mandisa.gr/): a Next.js site with a
custom admin dashboard (`/admin`) for editing every page, the navigation menu,
media library, and site settings — no WordPress involved.

## Stack

- **Next.js 16** (App Router, Server Actions) + **TypeScript** + **Tailwind CSS v4**
- **Prisma** ORM — SQLite locally (zero setup), Postgres in production
- **Cookie-based session auth** (single admin user, password in an env var)
- **Vercel Blob** for media uploads made through the dashboard in production
  (local dev writes to `public/uploads/` instead)

## Content model

Every page is a list of ordered **blocks** (hero, heading, text, image+text,
buttons, image carousel, video grid, tabbed video, map, contact form, spacer).
Editing a page in `/admin` means adding/reordering/editing/deleting blocks —
similar in spirit to Elementor, but purpose-built and much lighter weight.
See `src/lib/blocks.ts` for the block types and `src/components/blocks/` for
how each one renders.

## Local development

```bash
npm install
npm run db:migrate   # applies the Prisma schema to a local SQLite file
npm run db:seed       # populates it with the site's real content
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin`
for the dashboard. The admin password is whatever `ADMIN_PASSWORD` is set to
in `.env` (a random one was generated when this project was set up — check
`.env`, it's git-ignored so it never left this machine).

`npm run db:studio` opens Prisma Studio if you want to browse/edit the
database directly.

## Deploying to Vercel

This app was built and tested locally against SQLite for zero-friction
development, but **Vercel's serverless functions can't write to a local
file** — production needs a real hosted database. Here's the checklist:

### 1. Push this to GitHub

```bash
git add -A
git commit -m "Initial site + admin dashboard"
```
Then create a repo on GitHub and push (`gh repo create` or via github.com),
or connect this local repo through the Vercel CLI directly.

### 2. Create a Vercel project

Import the GitHub repo at [vercel.com/new](https://vercel.com/new), or run
`npx vercel` from this folder and follow the prompts.

### 3. Add a Postgres database

In the Vercel project dashboard → **Storage** → **Create Database** → choose
**Neon** (Postgres) — Vercel's native integration. This gives you a
`DATABASE_URL` automatically wired into your project's environment
variables.

Then, **before your first deploy**, make two small local changes to point
Prisma at Postgres instead of SQLite:

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "sqlite"
   }
   ```
   to:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
2. In `src/lib/db.ts`, swap the SQLite adapter for the Postgres one:
   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   // ...
   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
   ```
   (`npm install @prisma/adapter-pg` first.)
3. Run `npx prisma migrate dev --name init_postgres` once locally against the
   new `DATABASE_URL` (pull it from Vercel with `npx vercel env pull` first)
   to create the tables, then `npm run db:seed` against that same URL to
   load the site content.
4. Commit and push — Vercel will build against Postgres from then on.

### 4. Add Vercel Blob storage

In the same **Storage** tab, add a **Blob** store. Vercel sets
`BLOB_READ_WRITE_TOKEN` automatically — once that's present, new uploads made
through `/admin/media` in production go to Blob instead of the local
filesystem (see `src/lib/storage.ts`). Existing site images already live
under `public/media/` and are served as static files regardless — you don't
need to re-upload them.

### 5. Set the remaining environment variables

In the Vercel project's **Settings → Environment Variables**, add:

- `SESSION_SECRET` — a long random string (used to sign the admin login
  session). Generate one with `openssl rand -hex 32` or similar — don't
  reuse the local dev one.
- `ADMIN_PASSWORD` — the real password you want to log into `/admin` with in
  production. Pick something long and random; this is the only thing
  standing between the public internet and your content editor.

### 6. Connect your domain

Once deployed, add `mandisa.gr` as a custom domain in the Vercel project
settings and update your DNS (Vercel will show you the exact records to add
at your domain registrar).

## What's already fixed vs. the original site

A few things the original WordPress site had were cleaned up rather than
reproduced, since a rebuild is a natural point to fix small long-standing
issues:

- The homepage "Δες τις παραστάσεις μου" button now correctly links to the
  Shows page (it pointed at Accessories before).
- One consistent heading font throughout, instead of the original's mixed
  Comic Sans/Georgia/Playfair.
- One consistent video-embed style, instead of two different ones mixed on
  the Accessories page.
- Real `alt` text on images (the original had none anywhere) — worth
  filling in more descriptively over time via the media library.
- A dead/hidden duplicate row of videos on the Accessories page was dropped.
- Contact form submissions are now stored and visible in `/admin/messages`
  instead of going through a third-party forms plugin.

No phone number, email, or social links beyond EMbellyia's Instagram were
published anywhere on the original site — add real ones any time via
**Ρυθμίσεις (Settings)** in the dashboard once you have them.
