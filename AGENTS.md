# AGENTS.md

Guidance for any coding agent working in this repository. Tool-agnostic — see
`CLAUDE.md` for rules that apply only to Claude Code.

## Stack

Next.js 16 (App Router, Turbopack) · Payload CMS 3 on MongoDB · Tailwind v4 ·
Biome · Playwright · pnpm.

Two route groups: `src/app/(frontend)` is the public site, `src/app/(payload)`
is the admin panel and Payload's own REST/GraphQL routes. The site is a single
page assembled from sections, reading Payload through the Local API (no HTTP
round-trip).

## Architecture

The codebase is organised **by feature, not by technical layer**. Four layers,
and imports may only point **downward**:

```
src/app/        routes only — segment config, thin delegation, no logic
src/views/      page composition
src/features/   vertical slices
src/shared/     cross-cutting kernel, no domain knowledge
```

A feature is one directory with four segments, and **the segment is the public
surface**:

```
src/features/<name>/
  cms/      Payload collection/global + admin widgets. Relative imports only.
  model/    Pure domain: types, zod schemas, JSON-LD builders, cache tags.
            No React, no Payload client.
  server/   Data readers. Every file starts `import "server-only"`.
  ui/       React components, server and client.
```

Import `@/features/work/ui`, never `@/features/work/ui/case-study-card`. Within
a feature, use relative imports. There is deliberately **no feature-root
`index.ts`**: segment barrels are what stop a client component importing
`/model` and dragging `/server`'s Mongo graph in behind it.

The eight features are `profile`, `resume` (skills + experience + education),
`work` (case studies + testimonials), `services`, `contact`, `navigation`,
`seo` and `theming`. `work` owns testimonials because `NAV_GROUPS` already
gives the `work` nav link that contiguous run — the feature boundary follows
the boundary the product already has.

These rules are **enforced by Biome**, not by memory: see the
`noRestrictedImports` overrides in `biome.json`. Breaking a layer boundary is a
lint error, including the `@/*`-in-Payload-CLI trap described below.

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
pnpm test                # every test type — what CI and the pre-push hook run
pnpm test:unit           # Vitest over the pure modules (no server, no browser)
pnpm test:unit:watch     # ...in watch mode
pnpm test:e2e            # Playwright against a production server
PW_DEV=1 pnpm test:e2e   # ...against next dev instead
```

`pnpm test` is the aggregate. Add a new kind of test to that script, not to
`lefthook.yml` or a CI workflow, so every caller picks it up at once.

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
- **`src/payload.config.ts` and every `features/*/cms/*` module are loaded by
  the Payload CLI through tsx, which does not resolve the `@/*` alias.** Use
  relative imports there, or inline the helper. This is why `parseFromAddress`
  and `SITE_URL` are duplicated inside `payload.config.ts`. **Biome now enforces
  this** — an aliased import in a `cms/` segment is a lint error rather than a
  failure you only see when you next run the CLI. The same applies to
  `features/contact/model/*`, which `pnpm email:sync` imports under tsx.
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
  content lives in the CMS; UI strings live in `src/shared/i18n` — `en.ts` and
  `ar.ts`, with the shape in `types.ts`.
- **`/ar` pages are `noindex` until `translationReviewed` is ticked** on the
  document (and the Profile global). Until then they render for proofreading but
  stay out of the sitemap and the hreflang set. Flip the flag only after a human
  has read the Arabic.
- **Content reads are cached and tagged.** Each feature's `server/` segment
  reads through `cachedRead` (`src/shared/cms/cached-read.ts`), and a write must
  go through a `revalidateHooks`/`revalidateGlobalHooks` hook or the live page
  serves stale content. Every collection and the Profile global already wires
  one. The tag is a constant in the feature's `model/tags.ts`, imported by both
  sides, so the reader and the hook cannot drift. Next 16's `revalidateTag`
  needs a second argument — see `src/shared/cms/revalidate.ts`.
- **Rich text (Lexical) is enabled** for the Services `body`. The old note about
  keeping `@lexical` out of the module graph is void; if `pnpm build` ever fails
  inside `@lexical`, that dependency regressed.
- **The `Dictionary` holds functions (`count`, `copyright`)**, so a whole `Dictionary`
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
- **Never put `//` comments in `biome.json`.** Biome accepts the file without
  complaint and then **silently drops every override that follows the comment**.
  There is no parse error and no warning — `pnpm lint` just stops enforcing the
  architecture rules and reports green. This was verified by bisection: with the
  comments in place the boundary rules produced 0 diagnostics against files that
  plainly violated them; stripping the comments produced them all. Explanations
  belong in this file instead.
- **Biome overrides *replace* rule options, they do not merge them.** When two
  overrides both match a file, the last one wins outright for that rule — the
  earlier one's `patterns` are discarded, not combined. So every override that
  sets `noRestrictedImports` must repeat *all* the patterns that should apply to
  the files it matches. This is why the deep-import pattern is restated in the
  `src/views/**`, `src/features/**` and `src/shared/**` overrides rather than
  being left to the broad `src/**` one.
- **Line endings are LF**, pinned by `.gitattributes`. Biome fails on CRLF.
- Generated files — `src/payload-types.ts`, `admin/importMap.js`,
  `next-env.d.ts` — are excluded from Biome and should not be hand-edited.
  `next-env.d.ts` flips between dev and prod route paths on build; don't commit
  that churn.

## Testing

Two runners, split by file suffix so neither globs the other's files:

- **Vitest owns `src/**/*.test.ts`** — pure modules only, `environment:
  "node"`, no DOM. Unit tests sit beside the `model/` segment they pin, so a
  feature carries its own. This is where routing rules and registry invariants are
  pinned, because asserting them through a browser is slow and flake-prone.
- **Playwright owns `tests/e2e/**/*.spec.ts`** — anything that needs a page.

Prefer neither where an invariant can be encoded in a type or a data shape:
`src/features/navigation/model/sections.ts` makes non-contiguous section
ownership unrepresentable
rather than merely asserted, and `tsc` catches a bad nav label key. A test tells
you after the fact; a type stops it being written.

**A stray server on :3000 will silently invalidate the whole e2e run.**
`webServer.reuseExistingServer` is on outside CI, so if anything is already
listening on the port, Playwright attaches to *that* instead of starting a
production server from your build — and you get failures (or a false pass) that
have nothing to do with your changes. Check the port before blaming a spec, and
either stop the process or run on another port with `PW_PORT=3100 pnpm test:e2e`.

Playwright specs are read-only against the CMS and run fully parallel;
contact-form specs stub `/api/contact`, so the suite never sends real mail. Specs
skip themselves with a reason when the database is unseeded rather than reporting
a false pass.
