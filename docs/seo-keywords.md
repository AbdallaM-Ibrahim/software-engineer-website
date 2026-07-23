# SEO keyword map

One row per indexable URL: the phrase it is built to rank for, the secondary
phrases to work into the copy, and the search intent behind it. Keep this in
step with the content — a page that drifts off its primary phrase is the usual
reason a ranking slips.

The target audiences, decided up front: **recruiters / hiring managers** and
**businesses buying dev work**, across **Egypt, the Gulf (UAE/Saudi), and
US/Europe (remote)**.

## Pages

| URL | Primary phrase | Secondary phrases | Intent |
| --- | --- | --- | --- |
| `/` | Abdalla Mostafa software engineer | senior software engineer, backend developer, Next.js developer | Navigational + brand — someone searching the name (recruiter, referral). Owns the name, feeds the knowledge panel. |
| `/services` | software engineering services | freelance software engineer, hire a software engineer | Commercial — a buyer comparing what's on offer. Hub page and breadcrumb parent. |
| `/services/payment-integration` | payment integration developer | Stripe integration, Paymob integration, Apple Pay / Google Pay checkout, payment gateway developer | Commercial, high-intent, lower competition. Strongest proof (EasyGo, Westbazaar). **Lead priority.** |
| `/services/process-automation` | process automation developer | workflow automation, internal tools developer, business process automation | Commercial. Concrete proof (Westbazaar imports). |
| `/services/web-development` | web development services | Next.js developer, e-commerce platform developer, full-stack web developer | Commercial, broadest and most saturated — ranks on the long-tail qualifiers, not the head term. |
| `/services/data-driven-insights` | data-driven insights developer | data science for business, analytics dashboards, decision support tooling | Commercial, lowest volume — ties to the Data Science degree. |

Arabic mirrors (`/ar`, `/ar/services/*`) target the Arabic equivalents once the
translations are reviewed. Until then they are `noindex` and carry no keyword
targets.

## Geo

No per-city doorway pages — those are a penalty risk. Geography is signalled by:

- `Person.areaServed` and `Service.areaServed` in JSON-LD (Egypt, UAE, Saudi).
- The **"Where I work"** section: regions, timezone/overlap, engagement types.
- Natural mentions in body copy ("Dubai property platform", "remote for US/EU
  teams") — never a city list.

## Queries to watch in Search Console

Set these as the baseline once the site is verified and indexed. Track
impressions, average position and CTR; a rising impression count with a low
position is the signal to strengthen the matching page's copy.

- `abdalla mostafa` / `abdalla mostafa engineer` — brand, should reach #1.
- `payment integration developer` (+ `dubai`, `egypt`, `remote`).
- `paymob developer` / `stripe integration freelancer`.
- `process automation developer` / `workflow automation freelancer`.
- `next.js developer` (+ region qualifiers).
- `hire software engineer egypt` / `senior backend engineer remote`.

## Notes for future edits

- Any content edit must save its **Arabic** translation too — see AGENTS.md.
  A missed `ar` field silently ships English as indexed Arabic.
- New services get a row here before they get a page.
- Do **not** add `Review`/`AggregateRating` schema to testimonials — self-authored
  reviews are ineligible for rich results and risk a manual action.
