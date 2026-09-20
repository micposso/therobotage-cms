# Job Board

A US-only robotics job board at `/jobs`, plus a weekly job-alert email.

This is the **first database-backed feature on the marketing site**. Everything else in
`frontend/` reads markdown from disk at build time and ships as static HTML. Read the
[Rendering and caching](#rendering-and-caching) section before changing how any job page
fetches data — several of the choices there are load-bearing and non-obvious.

---

## Table of contents

1. [How it works](#how-it-works)
2. [First-time setup](#first-time-setup)
3. [Adding a job](#adding-a-job)
4. [Local development without Supabase](#local-development-without-supabase)
5. [Going live checklist](#going-live-checklist)
6. [Schema](#schema)
7. [Filters](#filters)
8. [Related roles](#related-roles)
9. [Job alerts](#job-alerts)
10. [SEO and sharing](#seo-and-sharing)
11. [Rendering and caching](#rendering-and-caching)
12. [File map](#file-map)
13. [Troubleshooting](#troubleshooting)
14. [Load-bearing constraints](#load-bearing-constraints)

---

## How it works

Markdown is the source of truth. Supabase is a serving replica.

```
jobs/<slug>.md            authored in git, reviewed like code
      │
      │  npm run jobs:publish        validate → upsert → revalidate
      ▼
Supabase  jobs table      filters, facets, alert matching
      │
      ├──────────────►  /jobs, /jobs/[slug]        (ISR, 15 min / 1 hr)
      └──────────────►  /api/cron/job-alerts       (weekly digest)
```

Every row in `jobs` is reproducible from git. That is what makes the following rule
enforceable rather than aspirational:

> **Never hand-edit rows in the Supabase dashboard.** The next publish run overwrites
> your change, and git stops describing what is live. Edit the markdown and re-run.

Publishing does **not** require a deploy. A new listing is live in seconds.

---

## First-time setup

### 1. Apply the migrations

The job board shares the LMS Supabase project and continues its migration chain:

```
lms/supabase/migrations/00018_create_job_taxonomy.sql    role families, US states
lms/supabase/migrations/00019_create_jobs.sql            companies, jobs
lms/supabase/migrations/00020_create_job_alerts.sql      subscribers, send audit
lms/supabase/migrations/00021_create_job_indexes_rls.sql indexes, RLS, public_jobs view
```

Apply them in order.

### 2. Set environment variables

Copy `frontend/.env.example` to `frontend/.env.local` and fill in. The job board needs:

| Variable | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | build **and** runtime | see the build-time warning below |
| `SUPABASE_PUBLISHABLE_KEY` | build **and** runtime | anon key. No `NEXT_PUBLIC_` prefix: the browser never uses it |
| `SUPABASE_SERVICE_ROLE_KEY` | runtime + local script | publish script and alert cron only |
| `CRON_SECRET` | runtime | guards `/api/cron/job-alerts` and `/api/revalidate-jobs` |
| `EMAIL_FROM_JOBS` | runtime | needs DKIM/SPF verified in Resend before any digest |
| `JOB_ALERT_ADMIN_EMAIL` | runtime | BCC on welcome mail |
| `JOB_ALERT_SEND_DAY` | runtime | `0`–`6` UTC, default `2` (Tuesday) |
| `JOB_ALERT_IP_SALT` | runtime | salt for hashing signup IPs |
| `MAILING_ADDRESS` | runtime | CAN-SPAM footer. Required before the first digest |

> **Railway must expose the two Supabase read variables to the *build* step, not only the
> deploy step.** `generateStaticParams` on `/jobs/[slug]` and the job query in
> `sitemap()` both run at build time.

### 3. Set GitHub repository secrets

`.github/workflows/job-alerts.yml` needs:

- `CRON_SECRET` — must match the value on the Railway frontend service
- `SITE_URL` — e.g. `https://therobotage.com`

---

## Adding a job

### With the agent (preferred)

The `job-writer` agent (`.claude/agents/job-writer.md`) takes a careers-page URL or a
pasted description, classifies it into the taxonomy, writes it in the house voice, shows
you the draft, and only writes the file after you approve. It then runs `jobs:check`
itself.

It is instructed never to invent a salary or an apply URL, and never to create a new role
family without asking.

### By hand

Copy `jobs/_template.md` to `jobs/<slug>.md`. The filename must equal the `slug`
frontmatter field. If the company is new, add it to `jobs/_companies.yml` first.

### Publishing

```bash
npm run jobs:check          # validate only, exits 1 on any error
npm run jobs:publish:dry    # validate + print the change plan, write nothing
npm run jobs:publish        # validate, upsert, revalidate the site
npm run jobs:publish -- --prune          # additionally hard-delete draft rows
npm run jobs:publish -- --allow-samples  # permit sample-*.md (see below)
```

**The run aborts on any validation error and writes nothing.** A partial publish would
make git and the database disagree, which is the failure this design exists to prevent.

What the script enforces:

- `slug` matches the filename, is unique, and is lowercase-hyphenated
- `role_family`, `seniority`, `employment_type`, `remote_type` are members of
  `jobs/taxonomy.json`
- `state` is one of the 50 states plus DC — **this is where US-only is enforced**, along
  with the `jobs.state_code` foreign key
- `city` and `state` are present unless `remote_type` is `remote-us`
- `apply_url` is https, or `apply_email` is a valid address; at least one is present
- `salary_min`/`salary_max` are both present or both absent, ordered, and within a
  plausible range for the period (warns if the band is more than 3x, usually a typo'd zero)
- `title` does not contain the company name (a Google Jobs policy violation)
- `summary` is 180 characters or fewer with no curly quotes
- body is at least 200 characters

### What happens on re-publish and delete

- **Unchanged jobs are skipped entirely.** Each row carries a `content_hash`; a routine
  run does not rewrite every row or bump every `updated_at`.
- **Deleting a markdown file archives the row** (`status = 'archived'`, `expires_at = now()`).
  Nothing is ever hard-deleted, so `job_alert_sends` audit rows survive and inbound links
  still resolve to a "role has closed" page rather than a 404.
- **Natural expiry needs no script run.** `expires_at > now()` is enforced in both the
  `public_jobs` view and the RLS policy, so a lapsed job drops off the site on its own.
  The script only handles *early* closure (`status: closed`).

---

## Local development without Supabase

`/jobs` works with no database at all, so the UI can be developed before the project is
provisioned.

**Sample data.** `jobs/sample-*.md` contains 13 placeholder listings across all 12 role
families, all 7 seniority levels, all 3 work modes, and a mix of disclosed/undisclosed
and annual/hourly pay — enough to exercise every filter. The companies in
`jobs/_companies.yml` are invented, every website points at `example.com`, and every
blurb begins "Sample data".

**The fallback.** `src/lib/jobsLocal.ts` reads the same markdown files and produces the
identical `JobDetail` shape. `getLiveJobs()` uses it when Supabase is unconfigured. It is
guarded on `NODE_ENV`: **in production an unconfigured Supabase throws instead**, so a
deployment can never silently serve whatever markdown happens to be in the image.

**The publish guard.** `npm run jobs:publish` refuses any `sample-*.md` file unless you
pass `--allow-samples`. Fabricated listings reaching a live job board would put fake jobs
in front of real job seekers and into Google Jobs, so `rm jobs/sample-*.md` is not the
only thing preventing it.

---

## Going live checklist

1. Apply the four migrations.
2. Set every environment variable above, including on the Railway **build** step.
3. `rm jobs/sample-*.md` and delete the sample block from `jobs/_companies.yml`.
4. Write 15–25 real listings. A board with four listings converts nobody.
5. `npm run jobs:check`, then `npm run jobs:publish`.
6. Verify a job page in Google's Rich Results Test and LinkedIn's Post Inspector.
7. Add `{ label: 'JOBS', href: '/jobs' }` to `NAV_LINKS` in
   `packages/ui/src/components/Nav/Nav.js` — **only now**, once listings exist. That file
   is shared with the LMS, so confirm the LMS passes a `baseUrl` before merging.
8. Add the GitHub secrets, then run the alerts workflow manually with `dry_run: true`.
9. Send one real digest to your own address before opening signups.

---

## Schema

`companies` · `jobs` · `job_alert_subscribers` · `job_alert_sends`, plus the
`job_role_families` and `us_states` lookup tables.

Lookup tables rather than Postgres enums for role families and states: the taxonomy will
grow, `alter type ... add value` cannot run inside a transaction, and the rows carry the
display label and blurb the UI needs. The small stable dimensions (seniority, employment
type, remote type) are `text` + `CHECK`.

**`public_jobs` is the only surface the application reads.** It joins companies, states
and role families and applies the live-listing predicate. Nothing in `src/` queries the
`jobs` table directly except `getExpiredJobBySlug`.

The view is declared `with (security_invoker = true)`. This is load-bearing: a plain
Postgres view runs as its owner and would silently bypass RLS, turning it into an
unrestricted read of every draft and expired row.

**RLS.** `jobs` and `companies` are anon-readable (jobs only where published, posted, and
unexpired). The two alert tables have RLS enabled with **no policies at all**, plus an
explicit `revoke` — that is deny-by-default. There is deliberately no INSERT policy on
subscribers; adding one would expose an unauthenticated write endpoint through PostgREST.
Signup writes go through a Server Action using the service-role client instead.

**Denormalized `company_name`.** A Postgres `GENERATED ALWAYS AS ... STORED` column may
only reference columns in its own row, so the `search_vector` cannot join to `companies`.
The publish script writes `jobs.company_name`; nothing else does.

---

## Filters

`/jobs?q=&role=&level=&state=&remote=&type=&company=&pay=&posted=`

| Facet | Param | Values |
|---|---|---|
| Free text | `q` | matched against title, company, summary, city, state, discipline, tags |
| Discipline | `role` | 12 role family slugs |
| Level | `level` | `intern` `entry` `mid` `senior` `staff` `lead` `director-plus` |
| State | `state` | 2-letter codes, 50 + DC |
| Work mode | `remote` | `onsite` `hybrid` `remote-us` |
| Type | `type` | `full-time` `part-time` `contract` `internship` `temporary` |
| Company | `company` | company slug |
| Pay | `pay` | `disclosed` `100k` `150k` `200k` `250k` |
| Posted | `posted` | `3d` `7d` `14d` `30d` |

`src/lib/jobFilters.ts` owns URL ⇄ state ⇄ predicate in one module, shared by the
explorer and the alert form so the two cannot drift.

**Two semantics worth knowing:**

- **A remote-US role matches every state filter.** Someone filtering for Wyoming wants the
  roles they could actually take from Wyoming, which includes the remote ones. Work mode
  is the filter for "onsite only". This matches the subscriber matching in the alert cron,
  so the board and the weekly digest cannot disagree about what a state preference means.
- **Hourly roles are annualized at 2080 hours** before a pay floor is applied, so they do
  not silently vanish from a `pay=150k` filter.

**Multi-value params** encode as comma-separated (`?role=perception-ml,controls-motion`),
capped at 8 values per key. Unknown values are dropped silently rather than 404ing, so a
stale shared link still renders something useful. The controls themselves are
single-select; the parser accepts lists so a link generated elsewhere (an alert
preference link) still filters correctly on first render.

**Facet options are derived from the visible job set**, not from the taxonomy, so the UI
never offers a filter that would return zero results.

---

## Related roles

Shown on `/jobs/[slug]`, up to 3.

**Qualifying** requires sharing the discipline *or* the employer. Location, work mode and
seniority only **rank** candidates that already qualify. Without that precondition, a
mechanical engineering job surfaces on a perception listing purely because both are
onsite in California — not a relation a job seeker cares about.

There is no score threshold: the qualifying filter decides what counts as related, and
the score only orders results. A threshold on top of it silently dropped same-employer
matches, which are a normal and useful thing to show.

Showing nothing is a valid outcome, and better than three padded results.

---

## Job alerts

### Signup

`JobAlertSignup` appears below the fold on `/jobs` and on every `/jobs/[slug]` — post-value,
never gating. The detail-page instance pre-selects that job's discipline and state.

Each signup records a `source` (`jobs-index`, `job-detail:<slug>`) for lead attribution,
plus declared role/level/state preferences. An empty preference array means "everything",
which is the default and the highest-converting path.

Abuse protection, in layers: an off-screen honeypot field (not `display:none`, which some
bots detect), a 2-second time trap, a DB-backed rate limit of 3 signups per hashed IP per
hour, email format validation, and `citext unique` on email so repeat submissions upsert
rather than duplicate. Raw IPs are never stored. No CAPTCHA — it would be the first
third-party script on the site.

A returning subscriber who previously unsubscribed is reactivated rather than swallowed
by the unique constraint.

### The digest

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://therobotage.com/api/cron/job-alerts
```

Query params: `?dryRun=1` computes everything and sends nothing (this is the test
harness); `?force=1` bypasses the send-day guard.

Triggered by `.github/workflows/job-alerts.yml` on Tuesdays at 14:00 UTC, with a
`workflow_dispatch` for manual runs. Railway has no Vercel Cron, and GitHub Actions is
free, version-controlled, and re-runnable from the Actions tab.

**The digest is safe to run more than once.** Three independent mechanisms:

1. A **send-day guard** on `JOB_ALERT_SEND_DAY`, so a daily or mistimed trigger is a no-op.
2. A **unique `(subscriber_id, job_id)`** constraint on `job_alert_sends`, so no subscriber
   can receive the same job twice regardless of `last_sent_at` drift or overlapping runs.
3. **Claim-before-send**: rows are inserted *before* the email goes out. A crash between
   the two costs one missed job rather than a duplicate email. On a send failure the
   claims for that batch are released so the next run retries them.

Subscribers with zero matches are **skipped**, not sent an empty digest. Subject lines are
generated per send (`New robotics jobs: {top title} at {company} + N more`) because a
static weekly subject gets threaded and collapsed in Gmail.

### Compliance

The existing `emailHtml()` footer has **no physical postal address**, which is a CAN-SPAM
gap for bulk mail. Bulk sends use `bulkEmailHtml()` instead, which appends the address and
unsubscribe block. **`emailHtml()` is deliberately unchanged** — four transactional senders
depend on its exact output.

Every digest carries the RFC 8058 headers Gmail and Yahoo require from bulk senders:

```
List-Unsubscribe:      <.../api/jobs/alerts/unsubscribe?token=…>, <.../jobs/alerts/unsubscribe?token=…>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
```

**Unsubscribe is two endpoints, and the GET must never mutate.** Corporate mail scanners
and Gmail's link prefetcher issue GET requests against every URL in an email, so a
mutating GET silently unsubscribes people who never clicked.

- `GET /jobs/alerts/unsubscribe?token=` renders a confirmation page. An unknown token
  renders a neutral "this link has expired" — never confirm whether an address is on the
  list.
- `POST /api/jobs/alerts/unsubscribe?token=` is the one-click endpoint. Always returns 200.

**Opt-in model:** v1 is single opt-in, matching the site's four existing Resend forms
(CAN-SPAM requires opt-out, not opt-in). The `status = 'pending'` value and a
`confirm_token` column exist from day one so switching to double opt-in needs no
migration. Switch before the list passes ~500 addresses — a cold single opt-in list is a
deliverability liability under Gmail's bulk-sender rules.

---

## SEO and sharing

**`JobPosting` JSON-LD** on every detail page is what makes listings eligible for the
Google Jobs box, the largest organic channel available to a small board. Four rules decide
whether it actually indexes, all enforced in `buildJobPostingJsonLd`:

1. `title` is the **bare job title**. Never "Title at Company — The Robot Age".
2. `directApply` is `false`. We link out; claiming `true` without hosting the apply flow
   is a policy violation.
3. Hybrid roles carry both `jobLocation` **and** `jobLocationType: 'TELECOMMUTE'`.
4. List pages emit `ItemList`, **never** `JobPosting`. `JobPosting` on a list page is a
   structured-data violation.

`validThrough` comes from `expires_at`, which is `NOT NULL`, so it is always present.

**Expired jobs do not 404.** Under ISR a page can outlive its `expires_at`, and hard
404ing would discard inbound links and every LinkedIn share. The page renders a "role has
closed" state instead: no `JobPosting` markup (Google requires expired postings drop it),
`robots: { index: false, follow: true }`, no apply button, and prominent related roles.
A genuinely unknown slug still calls `notFound()`.

**OG image.** `/jobs/[slug]/opengraph-image.tsx` generates a 1200×630 card via `next/og`,
leading with the salary band — the single biggest driver of click-through on a shared job.
LinkedIn caches OG data for roughly 7 days per URL, so get it right before promoting.

**Crawl control.** `robots.ts` disallows `/jobs?*` so crawlers never enumerate filter
permutations, and `/jobs/alerts/`. The indexable surfaces are `/jobs` and the individual
job pages, both registered in `sitemap.ts`.

---

## Rendering and caching

The site is otherwise 100% static. These choices are deliberate and easy to break.

**`/jobs` is statically prerendered and does not read `searchParams`.** This project does
not set `cacheComponents` in `next.config.ts`, so it is on Next 16's legacy caching model,
where reading `searchParams` opts a segment into full dynamic rendering on every request.
That would make `/jobs` the first non-static route on the site and cost a database
round-trip per pageview. Filtering happens client-side instead; filtered views stay
shareable because the explorer reads the URL via `useSearchParams`.

**The `<Suspense>` boundary around `JobBoardExplorer` is mandatory.** A client component
calling `useSearchParams()` inside a prerendered route fails `next build` without it.
This passes in dev and breaks the Railway build.

**Data access uses `unstable_cache`, not `use cache`.** The latter requires
`cacheComponents`. One cached query (`getLiveJobs`, tag `jobs`, 15 min) backs the index,
the detail pages, the sitemap and site search.

**`revalidateTag` takes two arguments in Next 16.** The single-argument form is deprecated
and fails typecheck. `/api/revalidate-jobs` passes `{ expire: 0 }`, the documented form for
external systems that need immediate expiry.

**`revalidate` values must be statically analyzable literals** — `900`, never `15 * 60`.

**Build-time data access is a deploy risk.** `generateStaticParams` on `/jobs/[slug]` and
the job query in `sitemap()` run at build time. Both are wrapped so a Supabase outage
degrades the job board rather than failing the deploy for the entire site. `/jobs` and
site search have the same guard. Verify this still holds if you touch them: build with the
Supabase variables unset and confirm the build succeeds.

**`lib/jobs.ts` must stay free of server-only imports.** `JobCard` renders inside the
client component `JobBoardExplorer`, so everything reachable from `lib/jobs.ts` is bundled
to the browser. All Supabase access lives in `lib/jobsQueries.ts`. The `server-only`
imports on the Supabase clients enforce this at build time rather than by convention — they
already caught one leak.

---

## File map

**Data**

```
src/lib/jobs.ts             types, formatters, facets, related roles, JSON-LD  (client-safe)
src/lib/jobsQueries.ts      all Supabase reads                                 (server only)
src/lib/jobsLocal.ts        markdown fallback for local dev                    (server only)
src/lib/jobFilters.ts       URL <-> state <-> predicate
src/lib/jobsTaxonomy.ts     typed access to jobs/taxonomy.json
src/lib/jobAlertEmail.ts    digest and welcome email HTML
src/lib/supabase/read.ts    anon client, RLS-limited
src/lib/supabase/admin.ts   service-role client
```

**Routes**

```
src/app/jobs/page.tsx                            index
src/app/jobs/[slug]/page.tsx                     detail
src/app/jobs/[slug]/opengraph-image.tsx          1200x630 share card
src/app/jobs/alerts/unsubscribe/page.tsx         confirmation page (mutates nothing)
src/app/actions/subscribeJobAlerts.ts
src/app/actions/unsubscribeJobAlerts.ts
src/app/api/cron/job-alerts/route.ts             weekly digest
src/app/api/jobs/alerts/unsubscribe/route.ts     RFC 8058 one-click POST
src/app/api/revalidate-jobs/route.ts             called by the publish script
```

**Components**

```
src/components/JobBoard/JobBoardExplorer.tsx     'use client', filter bar + list
src/components/JobBoard/JobCard.tsx
src/components/JobBoard/JobList.tsx
src/components/JobBoard/JobMetaStrip.tsx
src/components/JobBoard/RelatedJobs.tsx
src/components/JobAlerts/JobAlertSignup.tsx
```

**Content and tooling**

```
jobs/_template.md            frontmatter reference
jobs/_companies.yml          company registry
jobs/taxonomy.json           shared enum source (TS + the Node validator)
jobs/sample-*.md             placeholder listings, local dev only
scripts/publish-jobs.mjs     validator + idempotent upsert
.claude/agents/job-writer.md authoring agent
.github/workflows/job-alerts.yml
```

**Modified site files:** `src/app/sitemap.ts`, `src/app/robots.ts`,
`src/lib/searchIndex.ts`, `src/lib/emailTemplate.ts` (added `bulkEmailHtml`),
`src/components/NewsArticle/ShareButton.tsx` (added an optional `label` prop).

---

## Troubleshooting

**`/jobs` shows "temporarily unavailable"** — the Supabase read failed. In development it
should have fallen back to markdown; check the server log for the `[jobs]` warning. In
production, check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`.

**`/jobs` is empty but the markdown exists** — the fallback skips files whose `status` is
not `published`, whose `company` key is missing from `_companies.yml`, or whose
`expires_at` has passed.

**A published job does not appear** — check `status`, `posted_at` (not in the future), and
`expires_at` (not in the past). All three are enforced in the `public_jobs` view *and* the
RLS policy.

**`next build` fails on `/jobs`** — most likely the `<Suspense>` boundary around
`JobBoardExplorer` was removed, or something started reading `searchParams` in a
prerendered route.

**The whole site's build fails on a Supabase error** — a try/catch guard was removed from
`generateStaticParams`, `sitemap()`, `/jobs`, or `searchIndex.ts`.

**The digest sent nothing** — check the send-day guard (`JOB_ALERT_SEND_DAY` vs today's UTC
weekday), then run with `?dryRun=1&force=1` to see the computed plan. Subscribers with no
new matching jobs are skipped by design.

**The digest sent duplicates** — this should be impossible; `job_alert_sends` has a unique
constraint. Check whether rows are being deleted somewhere.

**`server-only` build error** — a client component is importing something that reaches
`lib/supabase/*`. Move the import to `lib/jobsQueries.ts` or split the shared helper into
`lib/jobs.ts`.

---

## Load-bearing constraints

Change these only deliberately. Each one prevents a specific failure.

| Constraint | Prevents |
|---|---|
| `public_jobs` declared `security_invoker = true` | A plain view bypassing RLS and exposing drafts |
| No INSERT policy on `job_alert_subscribers` | An unauthenticated write endpoint via PostgREST |
| `unique (subscriber_id, job_id)` on `job_alert_sends` | Duplicate digest emails |
| Claim rows before sending, not after | Duplicate emails on a mid-run crash |
| Unsubscribe GET renders, POST mutates | Mail scanners silently unsubscribing people |
| `bulkEmailHtml` separate from `emailHtml` | Breaking four transactional senders / CAN-SPAM gap |
| `<Suspense>` around `JobBoardExplorer` | `next build` failing on `/jobs` |
| `/jobs` never reads `searchParams` | The first fully dynamic route on a static site |
| try/catch on every build-time Supabase read | A Supabase blip failing the whole site's deploy |
| `server-only` on both Supabase clients | Server code and keys reaching the browser bundle |
| `lib/jobs.ts` free of server imports | The same, via the client-rendered `JobCard` |
| Publish aborts on any validation error | git and the database disagreeing |
| Publish refuses `sample-*.md` | Fabricated jobs reaching real job seekers |
| Archive on delete, never hard-delete | Losing the send audit trail and inbound links |
| `title` is the bare job title | Google Jobs rejecting the listing |
| `state` restricted to 50 + DC | Non-US listings on a US-only board |
