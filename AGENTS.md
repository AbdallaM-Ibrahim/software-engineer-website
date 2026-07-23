# AGENTS.md

Guidance for any coding agent working in this repository. Tool-agnostic — see
`CLAUDE.md` for rules that apply only to Claude Code.

## Stack

Next.js 16 (App Router, Turbopack) · Payload CMS 3 on MongoDB · Tailwind v4 ·
Biome · Playwright · pnpm.

Two route groups: `src/app/(frontend)` is the public site, `src/app/(payload)`
is the admin panel and Payload's own REST/GraphQL routes. The site is a single
page assembled from sections in `src/components/sections`, reading Payload
through the Local API in `src/lib/data.ts` (no HTTP round-trip).

## Commands

```bash
pnpm dev                 # next dev on :3000
pnpm build               # production build (also what the pre-push hook runs)
pnpm lint                # biome check .
pnpm lint:fix            # biome check --write .
pnpm seed                # WIPES content collections and reseeds from portofolio.json
pnpm generate:types      # regenerate src/payload-types.ts after a schema change
pnpm generate:importmap  # run after adding or moving a custom admin component
pnpm email               # React Email preview server on :3001
pnpm email:sync          # push email templates to Resend (needs the full-access key)
pnpm test:e2e            # Playwright against a production server
PW_DEV=1 pnpm test:e2e   # ...against next dev instead
```

## Commit conventions

- [Conventional Commits](https://www.conventionalcommits.org/), enforced by the
  `commit-msg` hook. See `scripts/verify-commit-msg.mjs` for accepted types.
- One coherent change per commit. Write the body to explain *why*, not to
  restate the diff.
- Never use `--no-verify`. If a hook fails, fix the cause.

## Git hooks (lefthook)

`pre-commit` runs Biome over staged files with **safe fixes only** and a
whole-project typecheck. `commit-msg` validates the message. `pre-push` runs the
build. Hooks install via the `prepare` script on `pnpm install`; re-sync with
`pnpm exec lefthook install`.

## Things that bite

- **After any Payload schema change**, run `pnpm generate:types`. After adding a
  custom admin component, also run `pnpm generate:importmap`.
- **`src/payload.config.ts`, `src/globals/*` and `src/collections/*` are loaded
  by the Payload CLI through tsx, which does not resolve the `@/*` alias.** Use
  relative imports there, or inline the helper. This is why `parseFromAddress`
  and `SITE_URL` are duplicated inside `payload.config.ts`, and why
  `src/collections/*` import `../lib/revalidate` relatively.
- **`pnpm seed` is destructive.** It deletes every document in the content
  collections. Testimonials are never re-seeded, so anything added by hand in
  `/admin` is lost. Check what is in the database before running it.
- **Case studies and services have drafts enabled.** A `payload.create` without
  `_status: "published"` lands as a draft and never reaches the live page.
  Public reads are filtered by the collection's `access.read`, which only
  applies when the query passes `overrideAccess: false`.
- **The site is bilingual (en at `/`, ar at `/ar`) with Payload field
  localization and `fallback: true`.** Any content edit must save its **Arabic**
  translation too. An `en`-only edit to a localized field silently renders the
  English value on the Arabic page; if that document's `translationReviewed`
  flag is already ticked, that English text ships as *indexed* Arabic. Localized
  content lives in the CMS; UI strings live in `src/lib/i18n.ts` (both locales).
- **`/ar` pages are `noindex` until `translationReviewed` is ticked** on the
  document (and the Profile global). Until then they render for proofreading but
  stay out of the sitemap and the hreflang set. Flip the flag only after a human
  has read the Arabic.
- **Content reads are cached and tagged** (`src/lib/data.ts`); a write must go
  through a `revalidateHooks`/`revalidateGlobalHooks` hook or the live page
  serves stale content. Every collection and the Profile global already wires
  one. Next 16's `revalidateTag` needs a second argument — see
  `src/lib/revalidate.ts`.
- **Rich text (Lexical) is enabled** for the Services `body`. The old note about
  keeping `@lexical` out of the module graph is void; if `pnpm build` ever fails
  inside `@lexical`, that dependency regressed.
- **`i18n.ts` holds functions (`count`, `copyright`)**, so a whole `Dictionary`
  cannot be passed to a Client Component — React can't serialize the functions.
  Pass a string subset (`NavStrings`, `FormStrings`, `caseStudyStrings(dict)`).
- **Resend needs two keys.** `RESEND_API_KEY` is full-access and used only by
  `pnpm email:sync`; `RESEND_API_KEY_SEND` is sending-only and used at runtime.
  Template CRUD with a sending-only key fails with `401 restricted_api_key`.
- **Resend templates interpolate with triple mustache**, which does not escape.
  HTML bodies get escaped values; subject lines and plain-text bodies read the
  raw `*_TEXT` variables. Don't collapse the two — see
  `scripts/sync-email-templates.tsx`.
- **The MCP endpoint (`POST /api/mcp`) authenticates with
  `Authorization: Bearer <apiKey>`**, not Payload's `<slug> API-Key <key>` header —
  the latter works everywhere else in Payload and still returns `401` here. Key
  permissions are deny-by-default, so a new key lists zero tools until its operation
  checkboxes are ticked.
- **Line endings are LF**, pinned by `.gitattributes`. Biome fails on CRLF.
- Generated files — `src/payload-types.ts`, `admin/importMap.js`,
  `next-env.d.ts` — are excluded from Biome and should not be hand-edited.
  `next-env.d.ts` flips between dev and prod route paths on build; don't commit
  that churn.

## Testing

Playwright specs live in `tests/e2e/`. They are read-only against the CMS and
run fully parallel; contact-form specs stub `/api/contact`, so the suite never
sends real mail. Specs skip themselves with a reason when the database is
unseeded rather than reporting a false pass.
