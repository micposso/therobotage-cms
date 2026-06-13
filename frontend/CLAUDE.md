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

## Agents

| Agent                    | When to use                                           |
|---|---|
| `page-builder`           | Creating any new page, route, or page section         |
| `content-writer`         | Writing or revising any visible copy, headlines, CTAs |
| `design-system-enforcer` | Final check before any UI change is considered done   |

Always run `design-system-enforcer` on new or modified UI files before
declaring work done.
