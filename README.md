# Abdalla Mostafa — Portfolio

Personal portfolio site for Abdalla Mostafa (Senior Software Engineer). A single-page
Next.js frontend whose content is fully managed through a built-in **Payload CMS** admin,
backed by **MongoDB**.

Production host: **abdalla.futuresolve.net**

## Stack

- **Next.js 16** (App Router, React 19) + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Radix) — light/dark theme via `next-themes`
- **Payload CMS 3.86** (admin at `/admin`, Local API for reads) on **MongoDB** (Mongoose)
- **TanStack Query** (contact-form mutation), **react-hook-form** + **zod** (validation)
- **framer-motion** (subtle reveals)
- **pnpm** as package manager, **Biome** for lint + format, **Playwright** for e2e
- S3-compatible media storage (AWS S3 / Cloudflare R2 / DigitalOcean Spaces / MinIO), local disk by default

## Prerequisites

- **pnpm** ≥ 10 (`corepack enable pnpm`, or `https://pnpm.io/installation`)
- **Node.js** ≥ 20
- A **MongoDB** database (MongoDB Atlas works out of the box)

## Environment

Values live in `.env` (already present for local dev):

| Var | Purpose |
| --- | --- |
| `MONGO_URL` | MongoDB SRV connection string (used in production) |
| `MONGO_URL_DIRECT` | Optional non-SRV fallback for hosts where the SRV DNS lookup fails; takes precedence when set |
| `MONGO_DB_NAME` | Database name (default `portfolio`) |
| `PAYLOAD_SECRET` | Secret used by Payload to sign tokens |
| `RESEND_API_KEY` | **Full access** Resend key. Used only by `pnpm email:sync` — template CRUD rejects a sending-only key with `401 restricted_api_key`. |
| `RESEND_API_KEY_SEND` | Sending-only Resend key, used by `/api/contact` at runtime. Falls back to `RESEND_API_KEY` when unset. |
| `RESEND_FROM_EMAIL` | `From` header, e.g. `Abdalla Mostafa <onboarding@resend.dev>` |
| `CONTACT_TO_EMAIL` | Where contact submissions land. Falls back to `Profile.contact.email` in Payload, then to a hardcoded address. |
| `CONTACT_AUTO_REPLY` | `true` enables the visitor auto-reply. Keep `false` without a verified domain. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Every absolute URL — canonicals, hreflang, sitemap, JSON-LD, OG images — derives from it (`src/lib/site.ts`). Set to the production domain on deploy. |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification token (the meta-tag content). Omit to emit no verification tag. |
| `NEXT_PUBLIC_MEDIA_URL` | Public base URL of the media bucket once S3/R2 is configured — declares the host `next/image` may optimise from. Leave blank while media is on local disk. |
| `PAYLOAD_MCP_API_KEY` | Payload MCP key, minted in `/admin` under MCP → API Keys. Mirrored in the gitignored `.mcp.json`. |
| `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_FORCE_PATH_STYLE` | Optional — enable cloud media. Works with Cloudflare R2 (`S3_REGION=auto`). Leave blank to keep uploads on local disk (`public/media`). Set `NEXT_PUBLIC_MEDIA_URL` alongside these. |

> **SRV note:** some Node/Windows setups can't perform the SRV DNS lookup that
> `mongodb+srv://` needs (`querySrv ECONNREFUSED`). If you hit that, set
> `MONGO_URL_DIRECT` to a direct multi-host `mongodb://` string (see `.env`).

> **Atlas IP allowlist:** a `tlsv1 alert internal error` / `SSL alert number 80` on the
> TLS handshake (TCP to port 27017 succeeds, the handshake then dies) means your current
> public IP is not on the cluster's **Network Access** list — not a credentials problem.
> Add the IP in Atlas → Network Access. Home connections get a new IP regularly, so this
> recurs; `curl https://api.ipify.org` shows the current one.

## Install

```bash
pnpm install
```

`pnpm-lock.yaml` is committed — commit it with any dependency change.

## Seed the database

Imports `portofolio.json` into Payload (Profile global + Experience / Education /
Case Studies) and creates the admin user. Idempotent: it wipes and rewrites those
collections, so **content edited in `/admin` is lost if you re-run it**.

No testimonials are seeded — the section stays hidden until real quotes are added
in `/admin`.

```bash
pnpm seed
```

Default admin login (**change the password in production**):

- Email: `admin@admin.com`
- Password: `admin`

## Develop

```bash
pnpm dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Build & run

```bash
pnpm build
pnpm start
```

## Lint & format (Biome)

Biome replaces ESLint + Prettier — one binary for both, configured in `biome.json`.

```bash
pnpm lint        # check lint + formatting
pnpm lint:fix    # apply safe fixes
pnpm format      # format only
```

Generated files (`src/payload-types.ts`, the admin `importMap.js`, `next-env.d.ts`)
are excluded in `biome.json`.

## Payload CLI

```bash
pnpm generate:types       # regenerate src/payload-types.ts after schema changes
pnpm generate:importmap   # regenerate the admin import map
```

These run through **tsx**, not the bare `payload` shim. Payload transpiles
`payload.config.ts` and then `require`s its relative imports (`./collections/Users`,
…) — plain node can't resolve those `.ts` paths and fails with
`Cannot find module './collections/Users'`. tsx's loader resolves them.

`pnpm seed` additionally passes `--env-file=.env`; tsx does not read `.env` on its
own, and without it Payload aborts with *"missing secret key"*.

## Admin extras

**Live preview** renders the real site in an iframe beside the editor, with
mobile/tablet/desktop breakpoints. The site is server-rendered, so the bridge in
`src/components/refresh-on-save.tsx` listens for the admin's save message and calls
`router.refresh()` — no reload, no lost scroll position. It previews `NEXT_PUBLIC_SITE_URL`,
so set that when previewing anything other than `http://localhost:3000`.

**MCP** exposes the content at `/api/mcp` (POST) via `@payloadcms/plugin-mcp`.
Mint a key under **MCP → API Keys** in `/admin` first. Two things are easy to get wrong:

- **Auth is `Authorization: Bearer <apiKey>`** — *not* Payload's usual
  `<collection-slug> API-Key <key>` header. The latter authenticates fine against the
  REST API and still gets a `401` here.
- **Permissions are deny-by-default.** Every operation checkbox on a key starts
  unticked, so a freshly minted key exposes **zero** tools. Tick the operations you
  want on that key; `tools/list` then returns exactly those.

To connect a local MCP client, copy the example and drop your key in:

```bash
cp .mcp.json.example .mcp.json   # then replace REPLACE_WITH_PAYLOAD_MCP_API_KEY
```

`.mcp.json` is gitignored because it holds a live key; `.mcp.json.example` is the
committed shape. The same key also lives in `.env` as `PAYLOAD_MCP_API_KEY`. The site
must be running (`pnpm dev`) for a client to reach the endpoint.

The config allows find/create/update across the content collections. No collection
grants delete, and `users` and `media` are not exposed at all. Verified end to end:
granting services + skills + case studies + profile yields `createServices`,
`updateServices`, `findServices`, `findSkills`, `findCaseStudies`, `findProfile` and
`updateProfile`, and an unauthenticated request gets `401`.

**TypeScript plugin** — `@payloadcms/typescript-plugin` adds collection-slug and
field-path completions. It is an editor language-service plugin only and does not affect
`tsc`; VS Code / Cursor must be pointed at the workspace TypeScript version
(*TypeScript: Select TypeScript Version*) before it loads. Upstream marks it experimental.

## Contact form email (React Email + Resend Templates)

The contact form posts to `/api/contact`, which sends through **Resend Templates**
rather than inline HTML — so copy can be edited in the Resend dashboard without a
redeploy.

`emails/` holds the templates as React Email components (the authoring layer).
`scripts/sync-email-templates.tsx` renders them to HTML and uploads + publishes
them to Resend (the serving layer).

```bash
pnpm email                          # preview server on :3001 (next dev owns :3000)
pnpm email:sync                     # render → upload → publish  (needs the full-access key)
pnpm email:sync --emit ./out        # render to disk only, no network, no key
```

Edit a template → run `pnpm email:sync`. Skipping the sync changes nothing that
gets sent: **drafts cannot send**, and the previously published version keeps
going out until you publish again.

**Variable contexts.** Resend interpolates with *triple* mustache (`{{{VAR}}}`),
which substitutes raw and unescaped. Visitor input is therefore escaped for the
HTML body, while the subject line and plain-text part read separate raw `*_TEXT`
variables — escaping those would surface literal `&lt;` and `<br />` to the
reader. Both sets are sent together from the route; see `src/lib/email.ts`.

**Sandbox limit.** With no verified domain, `onboarding@resend.dev` only delivers
to the Resend account owner. The owner notification works; the visitor auto-reply
is gated behind `CONTACT_AUTO_REPLY` and 403s until you verify a domain. To enable
it: add the domain in Resend, publish the DNS records, point `RESEND_FROM_EMAIL`
at an address on it, then set `CONTACT_AUTO_REPLY=true`. No code change.

## Tests (Playwright)

End-to-end tests live in `tests/e2e/`. The contact specs stub `/api/contact`, so
running the suite never sends real mail.

```bash
pnpm test:e2e                      # all projects (desktop + mobile)
pnpm test:e2e --project=desktop
pnpm test:e2e:ui                   # interactive runner
```

- The suite reuses the **Chrome already installed on this machine**
  (`channel: "chrome"` in `playwright.config.ts`) rather than downloading Playwright's
  bundled Chromium. Run `npx playwright install chromium` if you'd rather use the
  bundled build and drop the `channel` option.
- Tests run against a **production server** (`next start`) by default, so they aren't
  at the mercy of dev-mode cold compiles. Set `PW_DEV=1` to point them at `next dev`
  while iterating on components. Build first: `pnpm build`.
- The config spawns the server through **node against next's own entry point**, not
  through a package-manager script — a package manager isn't guaranteed to be on PATH
  in the shell Playwright forks, and a failed spawn shows up only as
  `ERR_CONNECTION_REFUSED` in every test rather than as a startup error.
- `smoke.spec.ts` always runs. `content.spec.ts` and `interactions.spec.ts` **skip
  themselves with an explicit reason** when Payload has no profile (unseeded or
  unreachable DB), so a database outage reports as skipped rather than a false pass.
- The seeded specs assert reveals actually reach `opacity: 1`. Content is rendered at
  `opacity-0` until an IntersectionObserver fires, so "present in the DOM" is not the
  same as "visible" — a `toContainText` check alone would miss it.

## Deploy (Vercel)

1. Push to a Git repo and import into Vercel.
2. Set the environment variables above (use `MONGO_URL`, not the direct fallback — SRV
   works on Vercel).
3. For persistent media in a serverless environment, configure the S3-compatible vars
   (local disk is ephemeral on Vercel).
4. Point `abdalla.futuresolve.net` at the Vercel deployment.
5. Run `pnpm seed` once against the production database (or add content via `/admin`).

## Content model

| Type | Where |
| --- | --- |
| Profile (name, headline, bio, contact details, contact links) | Global |
| Services ("How I can help" cards) | Collection (orderable) |
| Skills & tech stack | Collection (orderable, split by `category`: `soft` / `tech`) |
| Experience / Education / Case Studies / Testimonials | Collections (orderable) |
| Media (images) | Collection (local disk or S3-compatible) |

**Contact links** are a repeatable array on Profile. A platform dropdown covers the
popular sites and selects the icon; picking *Other* reveals a free-text name. The hero
shows LinkedIn and a WhatsApp chat link only — the Contact section lists all of them
beside the form.

**WhatsApp** comes from the phone number when *This phone number is on WhatsApp* is
ticked. Untick it to reveal a collapsed field for a separate number; leaving that field
blank stores `null` rather than an empty string, so "no WhatsApp" is representable.

**Case studies have draft and published states**, with autosave on the draft. A new
case study is a draft until published, and the live page only ever reads published
documents. Creating one programmatically needs `_status: "published"` — see `src/seed.ts`.

Each case study also carries a **headline metric** (`before` / `value` / `direction` /
`label`) and a `shortName`. The hero's metric strip is built from those, so editing a
case study in `/admin` updates the hero too.

Card screenshots resolve in this order: the uploaded `thumbnail` → a static capture at
`public/case-studies/<slug>.jpg` → the project name on a plain panel.

## Project structure

```
src/
  app/
    (frontend)/        # public site (own root layout, globals.css)
    (payload)/         # Payload admin + REST/GraphQL routes
  collections/         # Users, Media, Experience, Education, CaseStudies, Testimonials
  globals/             # Profile
  components/
    ui/                # shadcn primitives
    sections/          # Navbar, Hero, About, Skills, Experience, Education, Work, Testimonials, Contact, Footer
  lib/                 # Payload client, data access, formatters
  payload.config.ts
  seed.ts
```

## Notes

- **No rich-text editor** is configured (all fields are plain text/textarea). This keeps
  `@lexical` out of the module graph, which otherwise hit a circular-import bug. Add
  `lexicalEditor()` back to `payload.config.ts` if you introduce a richText field.
- The contact form is **UI-complete and validated but not wired to email** — it runs a
  stubbed TanStack mutation and shows a success toast. Swap the `mutationFn` in
  `src/components/sections/contact-form.tsx` for a real endpoint to make it live.
