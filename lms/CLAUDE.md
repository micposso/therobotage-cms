# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js version

This project uses **Next.js 16.2.6** — a version with breaking changes relative to training data. Before writing any Next.js code, check `node_modules/next/dist/docs/` for current APIs and deprecation notices. Do not assume Next.js 13/14/15 conventions apply.

## Commands

```bash
npm run dev      # start development server
npm run build    # production build
npm run start    # run production build locally
npm run lint     # ESLint (v9 flat config)
```

No test framework is installed yet.

## Architecture

**Stack:** Next.js 16 App Router · React 19 · TypeScript (strict) · React Compiler enabled

**Path alias:** `@/*` → `./src/*`

**What this is:** A cohort-based LMS at `learn.therobotage.com` for the Robot Experience Design credential program. Students enroll via Lemon Squeezy purchase (webhook), progress through 6 weekly modules, submit deliverables for instructor review, and earn a Credential.net badge on capstone pass.

### Route structure

```
/                         → redirect to /dashboard or /signin
/signin, /signup          → auth (email+password only — no OAuth)
/forgot-password, /reset-password/[token]
/dashboard                → main learner hub
/courses/[slug]/week/[n]          → module content
/courses/[slug]/week/[n]/submit   → deliverable form
/courses/[slug]/week/[n]/footage  → robot footage viewer (week 5 only)
/courses/[slug]/capstone          → RRA submission (week 6)
/courses/[slug]/peer-review
/profile, /profile/credentials
/admin/**                 → role-gated (instructor | admin only)
/api/webhooks/lemonsqueezy
/api/webhooks/credentialnet
```

### Data flow

1. **Enrollment:** Lemon Squeezy webhook → `POST /api/webhooks/lemonsqueezy` → creates `Enrollment` + initial `WeekProgress` records
2. **Week unlock:** Schedule-driven from `cohort.weekStartDates` — never unlocked by student action alone
3. **Submissions:** Auto-save draft every 60s; once submitted, student cannot edit without instructor unlock
4. **Capstone:** Week 6 unlocks only after Week 5 deliverable approved AND footage viewed (`RobotFootage.viewedAt` set)
5. **Credential issuance:** Instructor marks RRA `passed` → Credential.net API call → email via Resend

### Auth

JWT sessions via next-auth (or equivalent). User `role` field: `student` | `instructor` | `admin`. All `/admin/*` routes must check role server-side.

### Key third-party integrations

| Service | Purpose |
|---|---|
| Lemon Squeezy | Payment + enrollment webhooks |
| Credential.net | Badge issuance on capstone pass |
| Resend | Transactional email — sender `onboarding@resend.dev` until therobotage.com domain verified |
| Neon/Supabase Postgres | Database via Prisma ORM |
| Cloudflare R2 | Robot footage video storage — store URLs only, never files in DB |
| Zoom | Week 1 live session — store URL on cohort, no Zoom API needed |

## CSS & design system

CSS Modules co-located with every component (`ComponentName/ComponentName.module.css`). No Tailwind, no CSS-in-JS.

`globals.css` contains design tokens only — never page-scoped styles. The complete token set is in `LMS.md §2`. All color values must use `var(--color-*)` or `var(--res-*)` — never raw hex.

**CSS class names:** camelCase only (`.weekCard`, not `.week-card`)

**Breakpoints:** `max-width: 767px` (mobile) and `min-width: 768px` and `max-width: 1024px` (tablet). Desktop is default.

**Fonts:** IBM Plex Sans (`--font-display`) + IBM Plex Serif (`--font-body`), loaded via `next/font/google` in `layout.tsx` only. Weights 300, 400, 500 only.

**Buttons:** Three patterns defined in `LMS.md §6`. No new button styles.

**Forbidden:** `box-shadow`, `border-radius` on anything except status badges (`--radius-pill`), font weights outside 300/400/500.

## Copy rules

- Use "week" not module/lesson/unit. Use "deliverable" not assignment. Use "cohort" not class.
- No encouragement copy ("Great job!", "Almost there!", etc.). State status as fact.
- American English: program, enrollment, behavior, analyze.
- No emoji in UI.

## Full specification

`LMS.md` in this directory is the authoritative spec: design tokens, component patterns, all data models (User, Cohort, Enrollment, WeekProgress, Submission, RRASubmission, RobotFootage, Credential), functional requirements, and forbidden patterns.
