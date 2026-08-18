@AGENTS.md

## Styling

Per-component CSS files co-located with each component (`ComponentName.module.css`).
No Tailwind. No CSS-in-JS. Do not add either.

All colors, spacing, and typography must reference CSS custom properties defined
in `src/app/globals.css` via `var(--token-name)`. Never hardcode hex values,
raw pixel/rem values, or font-family strings in component CSS or inline styles.

## String literals

Always use straight quotes (`"` or `'`) in `.ts` and `.tsx` files. Curly/smart quotes (`'`, `'`, `"`, `"`) inside JS string literals break the Turbopack parser. If a string contains an apostrophe, wrap it in double quotes: `"don't"`. Curly quotes are only acceptable inside JSX text content as HTML entities (`&rsquo;`, `&ldquo;`, etc.).

## References

Before any UI or copy work, read:
- `DESIGN_SYSTEM.md` — tokens, component specs, page patterns, forbidden rules
- `VOICE_AND_TONE.md` — voice, writing conventions, vocabulary, and copy examples

## Features

### RXD Scorecard — `/rxd-scorecard`

A single-page, in-browser tool for scoring one robot interaction against the six
Robot Experience Design (RXD) dimensions and exporting a shareable audit card.
Built for non-engineers (UX designers, PMs, strategists, researchers). All state
is in-memory React `useState` — **no `localStorage` / `sessionStorage`**.

**Files**
- `src/app/rxd-scorecard/page.tsx` — server shell. `metadata`, `<Nav pinned />`,
  `<PageHero>` intro, mounts `<Scorecard />`, `<Footer />`. Standard page pattern.
- `src/app/rxd-scorecard/Scorecard.tsx` — `'use client'`. The entire tool in one
  component: scoring state, the `<canvas>` card renderer, export/clipboard, and
  lead capture.
- `src/app/rxd-scorecard/rxd-scorecard.module.css` — all styles, design-token only.

**The six dimensions** (fixed order, defined in the `DIMENSIONS` array): Signal
Clarity, Spatial Legibility, Perceived Presence, Failure Transparency,
Interaction Fit, Recovery Design. Each carries a one-line plain-English
definition (the dimension's core question) that is **always visible inline** —
the tool teaches the framework while it is used; definitions are never hidden
behind tooltips. These mirror the framework in the `scoring-rxd` skill and the
copy in `src/app/rxd/RxdDimensionsGrid.tsx`.

**Scoring view (`mode === 'score'`)**
- **Context header** — `Robot name` + `What are you scoring?` text inputs. The
  robot name appears on the audit card.
- **Six dimension rows**, each with: number + title, inline definition, the
  dimension illustration (the same `/images/*.png` icons used by the `/rxd`
  dimensions grid in `RxdDimensionsGrid.tsx`, declared on the `image` field of
  `DIMENSIONS` and rendered decoratively with `alt=""`), a 1–5 score selector, a
  live per-dimension bar, and a notes textarea ("why this score"). A single scale
  legend (`1 — absent or unclear · 5 — exemplary`) sits above the rows instead of
  repeating the rubric per row.
- **Score selector** — accessible `role="radiogroup"` of five buttons:
  `aria-checked`, roving `tabIndex`, arrow-key / Home / End navigation, 56px
  (52px mobile) tap targets, visible focus ring. Clicking the selected score
  again clears it. Editing a score never wipes its notes (scores and notes are
  separate state objects).
- **Live summary** (sticky aside) — average out of 5 (one decimal) **and** total
  out of 30, per-dimension mini-bars, an `aria-live` "X of 6 dimensions scored"
  progress cue, and the **Generate audit** button. The button is disabled until
  all six are scored, with a hint naming what is missing (e.g. "2 left:
  Perceived Presence, Recovery Design").
- **Empty states give direction, not blanks** — an unscored dimension's bar reads
  "Pick a score above to chart this dimension".

**Bars use the burnt-orange RES palette** tokens in `globals.css`
(`--res-bar-1`…`--res-bar-5`, low→high; `--res-orange`, `--res-grid-line`).
These tokens exist specifically for this scorecard. Page chrome (eyebrows,
buttons) uses the standard `--color-accent`.

**Verdict bands** — `verdictFor(avg)` maps the average to a one-line plain-language
verdict using the site's existing tier vocabulary (matches
`src/content/scores/*.md`): `< 2.0` Not Ready · `< 3.0` Developing · `< 3.5`
Functional · `< 4.5` Strong · `>= 4.5` Exemplary. The verdict is the card's
headline so the artifact reads at a glance, not just as numbers.

**Audit view (`mode === 'audit'`)**
- The card is rendered **directly to `<canvas>`** by `renderCard()` — it is NOT a
  DOM-to-image capture. The on-screen card, the PNG download, and the clipboard
  copy are the same canvas, so they are pixel-identical. This deliberately avoids
  `html2canvas` / `html-to-image`, which capture `next/font` fonts and CSS custom
  properties unreliably. No image-export dependency is installed; do not add one.
  - Colors and font-family strings are read live from the design tokens via
    `getComputedStyle` (`cssVar()` helper) — stays token-sourced. Numeric
    coordinates / font sizes inside `renderCard` are canvas drawing-buffer values,
    not CSS, and are exempt from the token rules.
  - The renderer runs a measure pass then a paint pass so the canvas height grows
    to fit content (notes never clip). It draws at 2× for crispness and waits for
    `document.fonts.ready` before painting.
  - Card is a self-contained dark artifact: "RXD AUDIT" + date, robot name,
    context, verdict (tier + line), average /5 + total /30, all six scored bars
    with notes, and `therobotage.com` so a screenshot stands alone on LinkedIn /
    Slack. Legible at thumbnail size.
  - A descriptive `aria-label` (`cardAltText`) makes the canvas meaningful to
    screen readers.
- **Actions**: Download PNG (`canvas.toBlob` → `<a download>`), Copy image
  (`ClipboardItem`, with a graceful "Copy not supported — use download" fallback),
  Edit scores (back without losing data), Score another robot (full reset).

**Lead capture (post-value, never gated)** — scoring is fully usable with no login
and no form. The email offer ("Want the full white paper and scoring rubric?")
appears **only in the audit view**. It reuses the existing
`src/app/actions/sendWhitepaperEmail.ts` server action via `useActionState`
(so the Resend API key stays an env placeholder and the integration is isolated),
with inline success/error states. One low-key contextual CTA at the bottom links
to the REP credential page (`/learn/rep`) — do not stack additional CTAs.

**Accessibility / responsive** — labeled controls, full keyboard operation,
visible focus, `aria-live` progress, `prefers-reduced-motion` honored (bar/arrow
transitions disabled), single-column layout with non-sticky sidebars under 992px,
16px inputs to prevent iOS zoom. Usable in a live Zoom screen-share.

### Robotics Map — `/robotics-map`

An interactive world map and filterable directory of the robotics companies The
Robot Age tracks, backed by a structured market-intelligence data model. The same
model is served verbatim from a public JSON API at `/api/robotics-map`, so the
page and the API never drift.

**Files**
- `src/lib/robotics-map.ts` — the single source of truth. Exports the
  `RoboticsCompany` types, the hand-authored `roboticsMapCompanyBase[]` records,
  the `defaultIntelligence()` scaffolding layer, the assembled
  `roboticsMapCompanies` array, and the derived `roboticsMapFacets` (the
  deduplicated, sorted option lists that drive every filter dropdown). Add or edit
  companies **here only** — the page, the detail panel, the facets, and the API all
  read from this one module.
- `src/app/robotics-map/page.tsx` — server shell. `metadata` (incl. OpenGraph /
  Twitter), `<Nav pinned />`, header copy, mounts `<RoboticsMapExplorer>` with the
  companies + facets as props, `<Footer />`. Standard page pattern.
- `src/app/robotics-map/page.module.css` — page chrome (header/eyebrow/title).
- `src/components/RoboticsMap/RoboticsMapExplorer.tsx` — `'use client'`. The
  filtering + state shell: search box, the facet `<select>`s, the founded-year
  range filter, the results count, the API link, and the right-hand company detail
  panel. Owns `filters` and `selectedId` state.
- `src/components/RoboticsMap/RoboticsLeafletMap.tsx` — `'use client'`. The Leaflet
  map itself, **loaded via `next/dynamic` with `ssr: false`** (Leaflet touches
  `window`, so it must never render on the server). Renders one marker per visible
  company and `flyTo`s the selected one.
- `src/components/RoboticsMap/RoboticsMapExplorer.module.css` — all styles for both
  components, design-token only (incl. the `.leafletPin` / `.leafletPinActive`
  marker classes injected into Leaflet `divIcon` HTML).
- `src/app/api/robotics-map/route.ts` — `force-static` GET handler returning
  `{ schemaVersion, updatedAt, count, facets, companies }`.

**Data model (`robotics-map.ts`)** — each company is a `RoboticsCompanyBase`
(identity, location + `latitude`/`longitude`, `companyType`, `sector[]`,
`robotTypes[]`, `robots[]`, `founded`, `status`, `funding`, `latestSignal`,
`businessModel`, `website`) extended with an `intelligence: RoboticsIntelligence`
block. The intelligence block is **scaffolding for later source-backed research**,
not verified data: `defaultIntelligence()` *infers* `maturity`,
`commercialProof`, and `ecosystemRoles` from the base fields via keyword
heuristics (`inferMaturity` / `inferCommercialProof` / `inferEcosystemRoles`), and
seeds `products`, `fundingRounds`, `timeline`, risks/opportunities, and the
`robotAgeSignal` scorecard with placeholder records carrying explicit
`sourceStatus: 'Needs research'` / `sourceConfidence` / null-score markers. When
you research a company for real, replace these placeholders and flip the status
fields — do not silently leave "Needs research" text in shipped copy.

**Filtering** — `RoboticsMapExplorer` filters in a `useMemo` over a lowercased
`haystack` (free-text search) plus exact-match facet filters: region, country,
company type, sector, robot type, maturity, commercial proof, ecosystem role, and
a bucketed founded-year range (`matchesFoundedRange`). The map shows only the
filtered set; the summary bar reads "N of M companies visible"; **Reset** restores
`initialFilters`. On any filter change, `updateFilter` recomputes the first still-
visible company and selects it so the detail panel never strands a now-hidden
company.

**Map (`RoboticsLeafletMap`)** — `react-leaflet` `MapContainer` on the CARTO
`light_all` tile layer, constrained to world `maxBounds`, zoom 2–8. Markers are
HTML `divIcon`s styled by the CSS-module pin classes (active marker gets a
distinct class). Selecting a marker calls `onSelect`; the `MapSelection` child
`flyTo`s the selected company. Leaflet's stylesheet is imported **once globally**
in `src/app/layout.tsx` (`import "leaflet/dist/leaflet.css"`) — do not re-import it
per component. `leaflet` + `react-leaflet` (+ `@types/leaflet`) are the only
dependencies this feature adds.

**Detail panel** — the right-hand `aria-live` aside renders the selected company:
metrics grid (founded / type / robots / maturity / proof / confidence), sector +
robot-type + ecosystem-role tags, the `robotAgeSignal.overall` score (or `TBD`),
products, business signal / funding, "why it matters", model, deployment evidence,
revenue model, the timeline scaffold, and source notes, ending in an external link
to the company site.

**Editing companies** — to add a company, append a `RoboticsCompanyBase` literal
to `roboticsMapCompanyBase` (real `latitude`/`longitude` are required for the
marker). Facets, filters, the map, the detail panel, and the API update
automatically. When the underlying records change, bump `schemaVersion` /
`updatedAt` in `route.ts` so API consumers can tell.

### Job Board — `/jobs`

A US-only robotics job board. This is the **first database-backed feature on the
marketing site** — everything else here reads markdown from disk at build time.

**Scope is the moat.** The board covers only the human/product side of robotics —
product management, product design, UX design, user research, and marketing (role
families `product`, `design-ux`, `user-research`, `marketing` in `jobs/taxonomy.json`).
It is deliberately **not** an engineering board: no perception/ML, controls, embedded,
mechanical, manufacturing, field service, technical research, sales, or ops listings.
That restriction is the entire differentiation from a generic robotics-jobs aggregator
and is enforced at the taxonomy level, not by convention — `job-writer` refuses
out-of-scope source listings before writing a file, and `scripts/publish-jobs.mjs`
rejects any `role_family` not in `taxonomy.json`. Do not add a technical role family back
without the user explicitly asking for a scope change.

**Authoring flow.** Markdown is the source of truth; Supabase is a serving replica.

```
jobs/<slug>.md  --(npm run jobs:publish)-->  Supabase  -->  /jobs, /jobs/[slug]
```

Never hand-edit rows in the Supabase dashboard — the next publish run overwrites them and
git stops describing what is live. Edit the markdown and re-run.

- `npm run jobs:check` — validate only, exits 1 on any error
- `npm run jobs:publish:dry` — validate and print the change plan, write nothing
- `npm run jobs:publish` — validate, upsert, then call `/api/revalidate-jobs`

`scripts/publish-jobs.mjs` aborts the whole run on any validation error. A partial
publish would make git and the database disagree, which is the failure this design
exists to prevent. Deleting a job file **archives** the row rather than deleting it, so
`job_alert_sends` audit rows survive and inbound links still resolve.

**Files**
- `jobs/taxonomy.json` — role families, seniorities, employment types, remote types, and
  the 50 states plus DC. Read by both `src/lib/jobsTaxonomy.ts` and the publish script,
  so the TypeScript UI and the Node validator cannot drift. A change here needs a
  matching migration.
- `jobs/_companies.yml` — company registry. A job's `company:` key must exist here.
- `src/lib/jobs.ts` — data layer. Everything reads the `public_jobs` view, never the
  `jobs` table. `getLiveJobs()` is the single cached query behind the index, the detail
  pages, the sitemap and site search.
- `src/lib/jobFilters.ts` — URL to state to predicate, in one module shared by the
  explorer and the alert form.
- `src/lib/supabase/read.ts` — anon/publishable key (`getSupabaseRead`), RLS-limited to live
  listings. `src/lib/supabase/admin.ts` — `getSupabaseJobsService()`, the `jobs_alert_service`
  Postgres role. Both are `server-only`.
- `lms/supabase/migrations/00018`–`00022` — schema, RLS, the `public_jobs` view, and the
  `jobs_alert_service` role.

**Supabase project.** Deliberately shares the LMS's Supabase project rather than a separate
one — the job board schema lives in `lms/supabase/migrations/`. `getSupabaseJobsService()`
does **not** use this project's `SUPABASE_SERVICE_ROLE_KEY`: that key bypasses RLS on every
table, including LMS enrollments, submissions and credentials, which is far more blast
radius than a public signup form and a cron endpoint should have. It authenticates instead
as `jobs_alert_service` (migration `00022`), a role with no `bypassrls` and grants on
nothing but `jobs`, `companies`, the taxonomy tables, `job_alert_subscribers` and
`job_alert_sends`. The frontend Railway service should hold `SUPABASE_JOBS_SERVICE_KEY`
only — never `SUPABASE_SERVICE_ROLE_KEY`, which exists solely for local/CI runs of
`scripts/publish-jobs.mjs` (it writes `jobs`/`companies` directly and isn't deployed).

**Caching.** `/jobs` is statically prerendered with `revalidate = 900` and
**deliberately does not read `searchParams`** — doing so would opt it into full dynamic
rendering, since this project does not set `cacheComponents`. Filtering happens
client-side in `JobBoardExplorer`, which reads the URL via `useSearchParams` and so
**must stay inside a `<Suspense>` boundary** or `next build` fails on that route. The
data layer uses `unstable_cache` (not `use cache`, which requires `cacheComponents`).

`generateStaticParams` on `/jobs/[slug]` and the job query in `sitemap()` both run at
**build** time. Both are wrapped so a Supabase outage degrades the job board rather than
failing the deploy for the entire site.

**Job alerts.** Weekly digest at `/api/cron/job-alerts`, guarded by `CRON_SECRET` and
triggered by `.github/workflows/job-alerts.yml` (Railway has no Vercel Cron). The route
guards on `JOB_ALERT_SEND_DAY`, and `job_alert_sends` has a unique
`(subscriber_id, job_id)` constraint, so a re-run can never send the same job twice.
Sends are **claimed before delivery**, so a crash costs a missed job rather than a
duplicate email. Use `?dryRun=1` to inspect a digest without sending.

Bulk email uses `bulkEmailHtml()` in `src/lib/emailTemplate.ts`, which adds the postal
address and unsubscribe block CAN-SPAM requires. `emailHtml()` is untouched — four
transactional senders depend on its exact output. The unsubscribe **GET** at
`/jobs/alerts/unsubscribe` renders a confirmation page and mutates nothing, because mail
scanners prefetch every link in an email; the RFC 8058 one-click POST lives at
`/api/jobs/alerts/unsubscribe`.

**Structured data.** `/jobs/[slug]` emits `JobPosting` JSON-LD, which is what makes
listings eligible for the Google Jobs box. `title` must stay the bare job title,
`directApply` stays `false` (we link out), expired pages drop the markup and go
`noindex`, and list pages emit `ItemList` — never `JobPosting`.

## Agents

| Agent                    | When to use                                           |
|---|---|
| `page-builder`           | Creating any new page, route, or page section         |
| `content-writer`         | Writing or revising any visible copy, headlines, CTAs |
| `article-writer`         | Writing a news article into `news/`                   |
| `job-writer`             | Adding a job listing to `jobs/`                       |
| `design-system-enforcer` | Final check before any UI change is considered done   |

Always run `design-system-enforcer` on new or modified UI files before
declaring work done.
