# The Robot Age — LMS Specification
## learn.therobotage.com

> **Purpose.** This document is the complete reference for building the Robot Age Learning Management System as a standalone Next.js application at `learn.therobotage.com`. It captures the design system, voice and tone, functional requirements, route structure, data models, and component patterns needed to build an LMS that is visually and editorially consistent with `therobotage.com` while serving the specific needs of a cohort-based credential program.

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Design Tokens](#2-design-tokens)
3. [CSS Architecture Rules](#3-css-architecture-rules)
4. [Typography System](#4-typography-system)
5. [Component Patterns](#5-component-patterns)
6. [Buttons & CTAs](#6-buttons--ctas)
7. [Page Patterns](#7-page-patterns)
8. [Voice & Tone](#8-voice--tone)
9. [LMS Functional Requirements](#9-lms-functional-requirements)
10. [Route Structure](#10-route-structure)
11. [Data Models](#11-data-models)
12. [LMS-Specific Components](#12-lms-specific-components)
13. [Third-Party Integrations](#13-third-party-integrations)
14. [Forbidden Patterns](#14-forbidden-patterns)

---

## 1. Product Overview

The Robot Age LMS is a cohort-based credential delivery platform. It supports the Robot Experience Design (RXD) credential family, starting with the Robotics Experience Practitioner (REP) — a six-week hybrid program combining one live Zoom session, four self-paced modules with deliverables, and a capstone Robot Readiness Audit.

### What the LMS must support

| Capability | Why it exists |
|---|---|
| Cohort enrollment | Students join a specific cohort (founding, general, enterprise) with a defined start date |
| Weekly module delivery | Content unlocks on a schedule; weeks do not open all at once |
| Deliverable submission | Each week (except Week 1) has a written submission or structured template |
| Live session access | Week 1 is a Zoom call; the LMS provides the link and session materials |
| Robot footage delivery | TRA uploads Reachy Mini footage tied to a student's Week 5 spec; student views it in the LMS |
| Capstone submission | Week 6 RRA is a full document submission with a scoring rubric |
| Peer review | Students review each other's capstone audits before final credential issuance |
| Instructor feedback | TRA can comment on any submission |
| Progress tracking | Student and instructor can see week-by-week completion state |
| Credential issuance | Passing the capstone triggers a Credential.net badge + REP credential |
| Admin panel | TRA manages cohorts, uploads content, reviews submissions, issues credentials |

### Scope boundary

The LMS handles **delivery and assessment only**. Payment is handled by Lemon Squeezy on `therobotage.com`. After payment, Lemon Squeezy webhook grants LMS access. The LMS does not process payments.

---

## 2. Design Tokens

Copy these exactly into `src/app/globals.css` in the new Next.js app. These tokens are the single source of truth for every color, spacing, and typography value. **Never hardcode a value that has a token.**

```css
:root {
  /* ── Brand palette ───────────────────────────────────── */
  --color-primary:   #ecd9d2;
  --color-secondary: #9b5152;
  --color-tertiary:  #4d6247;
  --color-fourth:    #b7925b;
  --color-white:     #ffffff;

  /* ── Semantic surface colors ─────────────────────────── */
  --color-bg:              #eaeaea;
  --color-bg-dark:         #0D0D0D;
  --color-text:            #0D0D0D;
  --color-text-muted:      #2A2A28;
  --color-text-inverse:    #E8E4DC;
  --color-accent:          #9b5152;   /* same as --color-secondary */

  /* ── Borders ─────────────────────────────────────────── */
  --color-border:          rgba(13, 13, 13, 0.12);
  --color-border-strong:   rgba(13, 13, 13, 0.35);
  --color-border-light:    rgba(245, 240, 232, 0.2);

  /* ── Dark surface support ────────────────────────────── */
  --color-bg-sand-dark:    #b7925b;
  --color-text-on-sand:    #F5F0E8;
  --color-footer-muted:    rgba(232, 228, 220, 0.4);
  --color-footer-border:   rgba(232, 228, 220, 0.1);
  --color-border-on-dark:  rgba(255, 255, 255, 0.06);

  /* ── LMS-specific semantic colors ───────────────────── */
  --color-success:         #4d6247;   /* same as --color-tertiary — completion states */
  --color-success-fill:    rgba(77, 98, 71, 0.12);
  --color-locked:          rgba(13, 13, 13, 0.08);  /* locked module backgrounds */
  --color-progress-track:  rgba(13, 13, 13, 0.1);
  --color-progress-fill:   #9b5152;   /* accent color for progress bars */

  /* ── RES Score palette (used in RRA scoring UI) ──────── */
  --res-orange:       #e85d24;
  --res-orange-fill:  rgba(232, 93, 36, 0.18);
  --res-grid-line:    rgba(13, 13, 13, 0.09);
  --res-bar-1:        #b8b4ae;
  --res-bar-2:        #cac6be;
  --res-bar-3:        #928f89;
  --res-bar-4:        #c8652e;
  --res-bar-5:        #e85d24;

  /* ── Utility ─────────────────────────────────────────── */
  --color-red:             #dc2626;   /* error states, validation */
  --color-modal-backdrop:  rgba(13, 13, 13, 0.72);

  /* ── Typography ──────────────────────────────────────── */
  --font-display: 'IBM Plex Sans', sans-serif;
  --font-body:    'IBM Plex Serif', serif;

  --text-xs:   0.75rem;
  --text-sm:   0.9375rem;
  --text-base: 1.0625rem;
  --text-md:   1.375rem;
  --text-lg:   2.625rem;
  --text-xl:   7rem;
  --text-2xl:  11rem;

  /* ── Spacing (8pt scale) ─────────────────────────────── */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-5:  1.25rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* ── Layout ──────────────────────────────────────────── */
  --nav-height:        64px;   /* LMS nav is slightly compact vs marketing site */
  --sidebar-width:     280px;  /* course sidebar / progress panel */
  --content-max:       760px;  /* reading width for module content */
  --section-padding:   var(--space-20);
  --container-gutter:  var(--space-8);

  /* ── Borders & radius ────────────────────────────────── */
  --radius-none: 0px;
  --radius-pill: 999px;

  /* ── Transitions ─────────────────────────────────────── */
  --ease-default: 200ms ease;
  --ease-slow:    600ms cubic-bezier(0.16, 1, 0.3, 1);

  /* ── Background texture ──────────────────────────────── */
  --color-bg-top:    #d3d2d3;
  --color-bg-bottom: #ffffff;
  --noise-opacity:   0.04;
  --grid-dot-color:  rgba(13, 13, 13, 0.18);
  --grid-dot-size:   1px;
  --grid-gap:        28px;
}
```

### Surface pairing rules

Always pair text tokens with the correct background token. Mixing surfaces is a violation.

| Background | Text | Border |
|---|---|---|
| `--color-bg` | `--color-text` / `--color-text-muted` | `--color-border` / `--color-border-strong` |
| `--color-bg-dark` | `--color-text-inverse` | `--color-border-light` / `--color-footer-border` |
| `--color-bg-sand-dark` | `--color-text-on-sand` | `--color-border-light` |

### Accent usage

`--color-accent` is used only for small, high-signal moments: eyebrow text, hover states, filled CTA buttons, status badges, list markers, progress fills. Never as a section background or large surface fill.

---

## 3. CSS Architecture Rules

### File co-location

Every component has exactly one CSS module in the same directory:

```
src/components/ModuleName/
├── ModuleName.tsx
└── ModuleName.module.css
```

For pages:

```
src/app/route/
├── page.tsx
└── page.module.css
```

**Never put page-scoped styles in `globals.css`.** That file is tokens and resets only.

### Naming

CSS module class names use **camelCase**. No BEM, no kebab-case.

```css
/* correct */
.weekCard { }
.progressBar { }
.submitButton { }

/* wrong */
.week-card { }
.progress_bar { }
```

### Responsive breakpoints

Two breakpoints only.

| Breakpoint | Media query |
|---|---|
| Mobile | `max-width: 767px` |
| Tablet | `min-width: 768px` and `max-width: 1024px` |
| Desktop | ≥ 1025px (default) |

Always write mobile overrides inside a `@media (max-width: 767px)` block at the bottom of each CSS module.

### Inline styles

Permitted only for one or two dynamic values that cannot live in a CSS module (e.g., `progress: ${pct}%`). All values must reference CSS variables — never raw hex or raw pixel values.

```jsx
/* permitted */
<div style={{ width: `${pct}%`, background: 'var(--color-progress-fill)' }} />

/* forbidden */
<div style={{ width: `${pct}%`, background: '#9b5152' }} />
```

---

## 4. Typography System

### Typefaces

Two typefaces only. Load via `next/font/google` in `src/app/layout.tsx`. Do not import fonts anywhere else.

| Token | Typeface | Weights | When to use |
|---|---|---|---|
| `--font-display` | IBM Plex Sans | 300, 400, 500 | Headings, card titles, nav links, data values, week numbers |
| `--font-body` | IBM Plex Serif | 300, 400 | Eyebrows, body copy, labels, buttons, module descriptions |

**Font-weight rule:** Only 300, 400, and 500 are loaded. Never use 600, 700, or any other weight.

### Type scale

| Token | Value | Typical use |
|---|---|---|
| `--text-xs` | 0.75rem | Eyebrows, labels, meta, buttons, status badges |
| `--text-sm` | 0.9375rem | Body copy, module descriptions, deliverable text |
| `--text-base` | 1.0625rem | Default paragraph text |
| `--text-md` | 1.375rem | Card headlines, week titles, subheadings |
| `--text-lg` | 2.625rem | Large stat values, score displays |
| `--text-xl` | 7rem | Display (landing hero only) |

### Letter-spacing conventions

| Context | Value |
|---|---|
| Eyebrows and uppercase labels | `0.2em` |
| Nav links | `0.12em` |
| Meta labels (dates, categories) | `0.15em` |
| Button text | `0.06em` |
| Display / section headlines | `-0.02em` |
| Body copy | none |

### Responsive headlines

Always use `clamp()` anchored to scale tokens:

```css
/* Section headline */
font-size: clamp(2rem, 4vw, 3.25rem);

/* Page hero */
font-size: clamp(2.5rem, 6vw, 5rem);

/* Card / week title */
font-size: clamp(1.25rem, 2.5vw, 1.75rem);
```

---

## 5. Component Patterns

### LMS Nav

Persistent top navigation bar. Always visible — no scroll-reveal behavior (the LMS has no marketing homepage scroll behavior). Contains: logo linking to `/dashboard`, cohort label, user avatar + menu.

```
[Robot Age logo]   [REP · Cohort 1]          [Week 3 of 6]   [Avatar ▾]
```

**Specs:**
- Height: `var(--nav-height)` (64px)
- Background: `var(--color-bg)`
- Border-bottom: `1px solid var(--color-border)`
- Logo: `--font-display`, weight 400, `--text-sm`
- Cohort label: `--font-body`, weight 300, `--text-xs`, uppercase, `0.15em` tracking, `--color-text-muted`
- Progress indicator: `--font-body`, `--text-xs`, `--color-text-muted`

### Course Sidebar

Left-side navigation inside a course. Shows all weeks with their completion state. Fixed position on desktop, collapses to an off-canvas drawer on mobile.

```
 REP
 ─────────────────────
 ✓ 01  Week 1 · Live Zoom
 ✓ 02  Signal Clarity
 →  03  Perceived Presence     ← current (accent color)
    04  Interaction Fit
    05  Recovery Design
 ⊘  06  Capstone               ← locked (muted)
```

**Specs:**
- Width: `var(--sidebar-width)` (280px)
- Background: `var(--color-bg)`
- Border-right: `1px solid var(--color-border)`
- Week numbers: `--font-display`, weight 300, `--text-xs`, `--color-text-muted`
- Week titles: `--font-body`, weight 300, `--text-sm`, `--color-text`
- Current week: `--color-accent` left border (4px), title weight 400
- Completed week: checkmark SVG in `--color-success`, title `--color-text-muted`
- Locked week: title `--color-text-muted`, opacity 0.5, no pointer events

**Week states:**
| State | Visual treatment |
|---|---|
| `locked` | Muted text, lock icon, non-interactive |
| `available` | Full opacity, no icon |
| `current` | Accent left border, weight 400 |
| `submitted` | Checkmark in `--color-success` |
| `complete` | Checkmark in `--color-success`, muted text |

### Week Card (Dashboard)

Compact card in the dashboard grid showing a week's status at a glance.

```
┌────────────────────────────────┐
│ 03                    CURRENT  │
│                                │
│ Perceived Presence             │
│ Self-paced · ~2.5 hours        │
│                                │
│ Deliverable due: Week 4 start  │
└────────────────────────────────┘
```

**Specs:**
- Border-top: `1px solid var(--color-border-strong)`
- Padding: `var(--space-6)`
- Week number: `--font-display`, weight 300, `--text-xs`, `--color-text-muted`
- Status badge: same pill pattern as therobotage.com (`--radius-pill`)
- Title: `--font-display`, weight 400, `--text-md`
- Meta: `--font-body`, weight 300, `--text-xs`, `--color-text-muted`

### Progress Bar

Linear track showing module completion within a week, or overall course progress.

```css
.track {
  height: 2px;
  background: var(--color-progress-track);
  border-radius: var(--radius-none);
}
.fill {
  height: 100%;
  background: var(--color-progress-fill);
  transition: width var(--ease-slow);
}
```

**Rule:** Progress bars are always 2px height. Never pill-shaped. No border-radius.

### Deliverable Submission Panel

Right-side panel or full-width block below module content. Shows the deliverable prompt, word count target, submission state, and feedback.

**States:**
- `pending` — prompt visible, text editor open, submit button active
- `submitted` — content locked, "Submitted" badge, awaiting feedback
- `feedback` — content locked, instructor comment visible below submission
- `approved` — green completion state, week marked complete

### RES Score Card (RRA Capstone)

Used in Week 6. Displays the Robot Readiness Audit scoring rubric — six RXD dimensions, each scored 1–5. The same visual language as the RES score card on therobotage.com, using the `--res-*` tokens.

```
Signal Clarity        ████░░  3 / 5
Spatial Legibility    ██████  5 / 5
Perceived Presence    ████░░  3 / 5
Failure Transparency  ███░░░  2 / 5
Interaction Fit       █████░  4 / 5
Recovery Design       ████░░  3 / 5
─────────────────────────────────────
Robot Experience Score         3.3 / 5
```

**Specs:**
- Dimension label: `--font-body`, weight 300, `--text-sm`
- Score value: `--font-display`, weight 400, `--text-sm`, `--color-accent`
- Bar fill: `--res-orange` at full score, graduating through `--res-bar-*` tokens at lower scores
- Total RES: `--font-display`, weight 400, `--text-md`, `--color-text`
- Track line: `--color-border`

### Status Badge

Reusable pill badge. Uses `--radius-pill`. Two variants:

| Variant | Background | Text | When to use |
|---|---|---|---|
| `live` | `--color-accent` | `--color-text-inverse` | Live week, active cohort |
| `soon` | `--color-border` | `--color-text-muted` | Coming soon, locked |
| `complete` | `--color-success-fill` | `--color-success` | Completed, passed |
| `submitted` | `--color-border` | `--color-text-muted` | Submitted, awaiting review |
| `feedback` | `rgba(232,93,36,0.1)` via token | `--res-orange` | Feedback waiting |

---

## 6. Buttons & CTAs

Three patterns. Match these exactly. Do not invent new button styles.

### Pattern A — Filled button (primary action: submit, enroll, confirm)

```css
display: inline-block;
padding: var(--space-4) var(--space-8);
background: var(--color-accent);
color: var(--color-text-inverse);
font-family: var(--font-body);
font-weight: 500;
font-size: var(--text-xs);
letter-spacing: 0.06em;
border: none;
border-radius: var(--radius-none);  /* always square */
cursor: pointer;
transition: background var(--ease-default);

/* hover */
background: var(--color-text);
```

**Used for:** Submit deliverable, Submit capstone, Mark complete, Admin: approve submission.

### Pattern B — Underline text link (navigation, secondary actions)

```css
display: inline-block;
padding-bottom: 2px;
background: none;
border: none;
border-bottom: 2.5px solid var(--color-text);
font-family: var(--font-body);
font-weight: 500;
font-size: var(--text-xs);
letter-spacing: 0.06em;
color: var(--color-text);
text-decoration: none;
transition: color var(--ease-default), border-color var(--ease-default);

/* hover */
color: var(--color-accent);
border-color: var(--color-accent);
```

**Used for:** Continue to next week, View full rubric, Download resources, Back links.

### Pattern C — Ghost / destructive (cancel, log out)

```css
display: inline-block;
padding: var(--space-3) var(--space-6);
background: none;
border: 1px solid var(--color-border-strong);
font-family: var(--font-body);
font-weight: 300;
font-size: var(--text-xs);
letter-spacing: 0.06em;
color: var(--color-text-muted);
border-radius: var(--radius-none);
transition: border-color var(--ease-default), color var(--ease-default);

/* hover */
border-color: var(--color-text);
color: var(--color-text);
```

**Used for:** Cancel submission, Log out, Dismiss modals.

### Disabled state (all patterns)

```css
opacity: 0.4;
pointer-events: none;
cursor: not-allowed;
```

---

## 7. Page Patterns

### 7.1 Auth pages (sign in / sign up)

Centered single-column form. `max-width: 480px`. Logo top-center. No nav. No footer sidebar. The form is the page.

```
[Robot Age logo]

Sign in to your account.

Email ___________________
Password ________________

[Sign In →]

Forgot your password?
```

**Eyebrow:** none on auth pages.
**Heading:** `--font-display`, weight 400, `clamp(1.5rem, 3vw, 2.25rem)`.
**Form inputs:** border-bottom only (`1px solid var(--color-border-strong)`), no box border. On focus: `--color-accent` border. `--font-display` for typed text, `--font-body` for labels.

### 7.2 Dashboard

Three-column layout on desktop: nav sidebar (left), main content (center), context panel (right).

```
┌──────────┬───────────────────────────┬──────────────┐
│ Sidebar  │  Main: week cards grid    │ Context:     │
│ (weeks)  │  + next action            │ cohort info  │
│          │                           │ + deadlines  │
└──────────┴───────────────────────────┴──────────────┘
```

Main area top: eyebrow (`REP · Cohort 1`), headline (`Week 3 is open.`), subhead with deadline or session info. Below: week card grid (2 columns on desktop, 1 on mobile).

### 7.3 Module content page

Two-column layout: sidebar (week nav) + content area.

Content area structure, top to bottom:
1. Eyebrow: `Week 03 · Perceived Presence`
2. Headline (week title)
3. Meta row: format, dimensions, estimated time
4. Module body (rich text — paragraphs, headings, lists)
5. Topic list (styled as the numbered outcome pattern)
6. Resources section (PDFs, links)
7. Deliverable panel (full-width, border-top separated)

**Content max-width:** `var(--content-max)` (760px). The sidebar sits outside this constraint.

### 7.4 Deliverable submission page

Single-column. Full-width within content area. Sections:

1. Eyebrow + deliverable title
2. Prompt block (the exact deliverable text, quoted visually with a left-border in `--color-accent`)
3. Word count target (badge: "500–800 words")
4. Text editor area
5. File attachment (optional, for structured templates)
6. Submit button (Pattern A) + word count live counter

### 7.5 Capstone / RRA page (Week 6)

Three sections stacked:

1. **Footage viewer** — embedded video or link to TRA-provided Reachy Mini footage + interaction log download
2. **RES scoring panel** — six dimension sliders (1–5) with written rationale field per dimension
3. **Summary + submit** — calculated total RES score, peer review assignment notice, submit button

### 7.6 Admin panel

Accessible at `/admin` (role-gated). Sections:

- Cohort list → cohort detail (enrolled students, week unlock controls)
- Submission inbox (by week, by student) → inline commenting
- Footage upload (tied to specific student + week 5)
- Credential issuance (manual trigger or auto on passing score)
- Student profiles

---

## 8. Voice & Tone

The LMS copy must match `therobotage.com` exactly. The audience is the same person — a practitioner who signed up for a credential, not a student who needs hand-holding.

### Core rules

**Direct.** State the point first. "Week 3 is open." Not "We're excited to share that Week 3 is now available for you to explore."

**Specific.** Name the thing, the deliverable, the skill. "Your signal audit is due before Week 4 begins." Not "Your assignment is due soon."

**No encouragement copy.** Never write "Great job!", "You're doing great!", "Almost there!" Status is stated as fact. "Week 2 complete." Not "You crushed Week 2!"

**No filler transitions.** Never open a page or section with "Welcome back," or "In this week, we'll cover..." Start with what the week is, not a greeting.

**Anti-hype stays consistent inside the LMS.** The programme is not described as "life-changing" or "industry-leading." It is described by what it produces: a credential, a skill, an audit.

### Vocabulary for LMS context

| Preferred | Avoid |
|---|---|
| week (Week 3) | module, lesson, unit |
| deliverable | assignment, homework, task |
| cohort | class, group, batch |
| credential | certificate, badge (standalone) |
| Robot Readiness Audit | final project, capstone project |
| submit | upload, hand in |
| complete | finish, done |
| instructor feedback | comments, grading notes |
| founding cohort | first group, early access group |

### Spelling: American English

Use American spellings throughout the LMS.

| American ✅ | British ❌ |
|---|---|
| program | programme |
| enrollment | enrolment |
| behavior | behaviour |
| analyze | analyse |
| organization | organisation |

### Status copy patterns

| State | Copy pattern |
|---|---|
| Week locked | "Opens after Week [n] is complete." |
| Week available | "Week [n] is open." |
| Deliverable pending | "Deliverable due before Week [n+1] begins." |
| Submitted | "Submitted. Feedback within 5 business days." |
| Feedback received | "Feedback added. Review and resubmit if needed." |
| Week complete | "Week [n] complete." |
| Capstone passed | "Robot Readiness Audit passed. Credential issued." |
| Capstone failed | "Audit returned for revision. See instructor notes." |

### CTA copy patterns

| Action | Label |
|---|---|
| Start a week | "Begin Week [n] →" |
| Continue a week | "Continue →" |
| Submit deliverable | "Submit deliverable" |
| View feedback | "View instructor feedback →" |
| Download resource | "Download [resource name] →" |
| Return to dashboard | "← Back to dashboard" |
| Join live session | "Join the Zoom session →" |

---

## 9. LMS Functional Requirements

### 9.1 Authentication

- Email + password sign-in. No social OAuth required for V1.
- Email verification on sign-up.
- Password reset via email.
- Session via `next-auth` or equivalent. JWT preferred for App Router compatibility.
- Role field on user record: `student` | `instructor` | `admin`.

### 9.2 Enrollment & access control

- Access is granted by a Lemon Squeezy webhook on successful purchase. Webhook creates a `student_enrollment` record with `cohort_id`, `user_id`, `status: active`.
- Weeks unlock based on the cohort's `week_start_dates` schedule — not on individual pace.
- Week 1 unlocks on cohort start date. Subsequent weeks unlock 7 days apart.
- Instructors and admins bypass all locks.

### 9.3 Module content

- Content is authored in markdown (or MDX) and stored in the codebase or a headless CMS.
- Each week has: description, topics (array), deliverable prompt, learning outcomes, resources (array of links/PDFs).
- Content is read-only for students. Instructors can edit via admin panel (or direct CMS access).
- Rich text rendering must support: paragraphs, headings (h2, h3 only), unordered lists, blockquotes, inline code, bold.

### 9.4 Live session (Week 1)

- A Zoom link is stored on the cohort record and displayed in Week 1 content.
- The link is visible only after Week 1 unlocks.
- A calendar `.ics` file is downloadable from the Week 1 page.
- Session recording link is added by admin after the session and displayed in the same Week 1 content area.

### 9.5 Deliverable submissions

- Each of Weeks 2–5 has a text-based deliverable (500–800 words).
- Submissions are stored as plain text or markdown in the database.
- A live word count is displayed as the student types.
- Students can save drafts before submitting. Draft auto-saves every 60 seconds.
- Once submitted, the student cannot edit without instructor unlock.
- Instructor can add a comment and either `approve` (marks week complete) or `request revision` (student can resubmit).

### 9.6 Reachy Mini footage delivery (Week 5)

- Student submits an interaction specification as their Week 5 deliverable (written prompt).
- TRA receives the spec, runs the session on Reachy Mini, and uploads a video file via the admin panel.
- The video is linked to the student's Week 5 submission record.
- Student is notified (email) when footage is available.
- Student views footage embedded in the Week 5 completion view, then proceeds to Week 6.

### 9.7 Capstone — Robot Readiness Audit (Week 6)

- Week 6 unlocks only after Week 5 deliverable is approved and footage has been viewed (tracked).
- The RRA form includes:
  - Six RXD dimension scores (1–5 integer, via slider or button group)
  - Written rationale for each score (min 100 words each)
  - Overall summary (min 200 words)
- On submit, the form is locked for scoring.
- Instructor scores the RRA and records a `pass` or `revision_requested`.
- Passing threshold: overall RES ≥ 3.0 with no single dimension below 2.

### 9.8 Peer review

- After capstone submission, each student is assigned one peer's RRA to review.
- Peer review is a structured form: two written comments (what scores well, what could be stronger) and an overall holistic rating (not a numeric score).
- Peer review is not required for credential issuance (V1) but is required for cohort completion recognition.

### 9.9 Credential issuance

- When instructor marks RRA as `passed`, a webhook or API call triggers Credential.net badge issuance.
- Student receives an email with their badge URL and credential ID.
- The LMS dashboard shows the credential badge and a link to the public credential page.
- Founding cohort members receive an additional "Founding Cohort" annotation on their credential (handled via Credential.net custom attribute).

### 9.10 Progress tracking

Track the following states per student per week:

| State key | Description |
|---|---|
| `locked` | Not yet available per schedule |
| `available` | Unlocked, not started |
| `in_progress` | Content viewed, deliverable not submitted |
| `submitted` | Deliverable submitted, awaiting review |
| `revision_requested` | Instructor returned for revision |
| `complete` | Approved by instructor |

Overall course completion is derived from all weeks reaching `complete`.

### 9.11 Email notifications

Trigger transactional emails (via Resend) for:

- Welcome + first week unlocked
- Each subsequent week unlock
- Footage ready (Week 5)
- Instructor feedback received
- Peer review assigned
- Credential issued

**From address:** Use the Resend API with sender name "The Robot Age". Until the `therobotage.com` domain is verified in Resend, use `onboarding@resend.dev` as the sender address.

---

## 10. Route Structure

```
/                           → Redirect to /dashboard if authenticated,
                              or /signin if not

/signin                     → Auth: sign in
/signup                     → Auth: sign up (invite-only or post-purchase)
/forgot-password            → Auth: reset
/reset-password/[token]     → Auth: new password

/dashboard                  → Main learner hub (authenticated)

/courses                    → List of enrolled courses
/courses/[slug]             → Course overview + week list (e.g., /courses/rep)
/courses/[slug]/week/[n]    → Week content page
/courses/[slug]/week/[n]/submit   → Deliverable submission
/courses/[slug]/week/[n]/footage  → Robot footage viewer (Week 5 only)
/courses/[slug]/capstone    → RRA submission (Week 6)
/courses/[slug]/peer-review → Peer review assignment

/profile                    → Learner profile + earned credentials
/profile/credentials        → All credentials, badge links

/admin                      → Admin panel root (role-gated)
/admin/cohorts              → Cohort management
/admin/cohorts/[id]         → Cohort detail: students, week schedule
/admin/submissions          → Submission inbox
/admin/submissions/[id]     → Individual submission + feedback form
/admin/footage              → Upload robot footage, link to student
/admin/credentials          → Issue / revoke credentials

/api/webhooks/lemonsqueezy  → Enrollment webhook from Lemon Squeezy
/api/webhooks/credentialnet → Credential issuance callback
```

---

## 11. Data Models

### User
```ts
type User = {
  id: string
  email: string
  name: string
  role: 'student' | 'instructor' | 'admin'
  createdAt: Date
  credentialNetId?: string
}
```

### Cohort
```ts
type Cohort = {
  id: string
  courseSlug: string        // 'rep' | 'rpdp' | 'rsp' | 'rxr'
  name: string              // 'Founding Cohort' | 'Cohort 2' etc.
  startDate: Date
  weekStartDates: Date[]    // [week1Start, week2Start, ...] — length matches course weeks
  zoomUrl?: string          // Week 1 live session link
  status: 'upcoming' | 'active' | 'complete'
}
```

### Enrollment
```ts
type Enrollment = {
  id: string
  userId: string
  cohortId: string
  courseSlug: string
  status: 'active' | 'paused' | 'complete'
  lemonsqueezyOrderId: string
  createdAt: Date
}
```

### WeekProgress
```ts
type WeekProgress = {
  id: string
  enrollmentId: string
  weekNumber: number        // 1-6 for REP
  state: 'locked' | 'available' | 'in_progress' | 'submitted' | 'revision_requested' | 'complete'
  contentViewedAt?: Date
  submittedAt?: Date
  approvedAt?: Date
}
```

### Submission
```ts
type Submission = {
  id: string
  enrollmentId: string
  weekNumber: number
  draft: string             // auto-saved draft text
  content?: string          // final submitted text
  submittedAt?: Date
  status: 'draft' | 'submitted' | 'revision_requested' | 'approved'
  instructorComment?: string
  reviewedAt?: Date
  reviewedBy?: string       // userId
}
```

### RRASubmission (Capstone)
```ts
type RRAdimension = {
  score: 1 | 2 | 3 | 4 | 5
  rationale: string         // min 100 words
}

type RRASubmission = {
  id: string
  enrollmentId: string
  dimensions: {
    signalClarity: RRAdimension
    spatialLegibility: RRAdimension
    perceivedPresence: RRAdimension
    failureTransparency: RRAdimension
    interactionFit: RRAdimension
    recoveryDesign: RRAdimension
  }
  overallSummary: string    // min 200 words
  totalRES: number          // computed: average of six scores
  submittedAt?: Date
  status: 'draft' | 'submitted' | 'passed' | 'revision_requested'
  instructorComment?: string
  passedAt?: Date
}
```

### RobotFootage
```ts
type RobotFootage = {
  id: string
  enrollmentId: string
  weekNumber: 5
  videoUrl: string          // hosted video URL (uploaded by TRA)
  uploadedAt: Date
  viewedAt?: Date           // student first viewed timestamp
}
```

### Credential
```ts
type Credential = {
  id: string
  userId: string
  courseSlug: string
  credentialNetBadgeUrl: string
  credentialNetPublicUrl: string
  issuedAt: Date
  foundingCohort: boolean
}
```

---

## 12. LMS-Specific Components

In addition to the base design system components, the LMS needs these:

| Component | Location | Purpose |
|---|---|---|
| `LMSNav` | `components/LMSNav/` | Authenticated top nav with cohort label + user menu |
| `CourseSidebar` | `components/CourseSidebar/` | Week list with completion states |
| `WeekCard` | `components/WeekCard/` | Dashboard card showing week status |
| `ProgressBar` | `components/ProgressBar/` | Linear 2px progress track |
| `StatusBadge` | `components/StatusBadge/` | Reusable pill badge (5 variants) |
| `DeliverablePanel` | `components/DeliverablePanel/` | Prompt + editor + submit (3 states) |
| `SubmissionEditor` | `components/SubmissionEditor/` | Auto-save textarea with word count |
| `FeedbackBlock` | `components/FeedbackBlock/` | Instructor comment display (locked content) |
| `RESScoreCard` | `components/RESScoreCard/` | 6-dimension score display with bars |
| `RRAForm` | `components/RRAForm/` | Capstone audit form: sliders + rationale fields |
| `FootageViewer` | `components/FootageViewer/` | Video embed + interaction log download |
| `CredentialCard` | `components/CredentialCard/` | Earned credential display with badge + share link |
| `AdminSubmissionRow` | `components/AdminSubmissionRow/` | Submission list item in admin inbox |
| `InstructorFeedbackForm` | `components/InstructorFeedbackForm/` | Comment + approve/return controls |

---

## 13. Third-Party Integrations

| Service | Purpose | Notes |
|---|---|---|
| **Lemon Squeezy** | Payment processing | Webhooks grant LMS access on purchase. Store `lemonsqueezyOrderId` on enrollment. |
| **Credential.net** | Badge issuance | API call on capstone pass. Store badge URL on credential record. Founding cohort members get a custom attribute. |
| **Zoom** | Live session (Week 1) | Store Zoom URL on cohort. Display in Week 1 content. No Zoom API needed — link only. |
| **Resend** | Transactional email | Use `onboarding@resend.dev` until `therobotage.com` domain is verified. All email from "The Robot Age". |
| **Vercel** | Hosting | Deploy as a separate Next.js app from `therobotage.com`. Configure `learn.therobotage.com` subdomain. |
| **Database** | Data persistence | Postgres via Neon or Supabase. Prisma as ORM. |
| **Video hosting** | Robot footage delivery | Cloudflare R2 or similar for robot footage uploads. Stream via signed URL. |

---

## 14. Forbidden Patterns

All rules from the main design system apply. Additional LMS-specific constraints:

### Design

- **Never use `box-shadow`.** No cards, no dropdowns, no modals.
- **Never round a button.** `border-radius: var(--radius-none)` on all interactive elements except status badges (`--radius-pill`).
- **Never use more than two typefaces.** IBM Plex Sans + IBM Plex Serif only.
- **Never use a font-weight outside 300, 400, 500.**
- **Never hardcode a color.** Every color value must be `var(--color-*)` or `var(--res-*)`.

### Content & copy

- **Never write encouragement copy.** No "Great job!", "You're almost there!", "Well done!"
- **Never use "module", "lesson", "unit", or "class"** when referring to a week of the program. Use "week."
- **Never use "course" and "program" interchangeably.** "Course" refers to the specific REP (or RPDP, etc.) content. "Program" is a more general term — use sparingly.
- **Never use emoji in structural UI.**
- **Never use British spellings.** programme → program, behaviour → behavior, enrolment → enrollment.

### Engineering

- **Never process payments in the LMS.** Lemon Squeezy handles all transactions. The LMS only receives webhooks.
- **Never store video files in the repo or in the LMS database.** Footage lives in object storage (R2 or S3). Store URLs only.
- **Never expose admin routes to `student` role.** All `/admin/*` routes must check `role === 'admin' || role === 'instructor'` server-side.
- **Never auto-unlock weeks based on student action alone.** Week unlocks are schedule-driven (`cohort.weekStartDates`). Student actions (submitting, completing) do not accelerate the schedule.
- **Never send email from a hardcoded address.** Use the Resend sender configured in environment variables.
