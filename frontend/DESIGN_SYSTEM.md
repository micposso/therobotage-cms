# The Robot Age — Design System

> **Purpose.** This file is the single source of truth for visual and structural decisions in the frontend. It is written to be consumed by an automated enforcement agent as well as by human developers. Every rule is stated as an imperative. Violations are flagged at the bottom of this file.

---

## Table of Contents

1. [Token Reference](#1-token-reference)
2. [CSS Architecture Rules](#2-css-architecture-rules)
3. [Component Library](#3-component-library)
4. [Page Patterns](#4-page-patterns)
5. [Buttons & CTAs](#5-buttons--ctas)
6. [Forbidden Patterns](#6-forbidden-patterns)
7. [How to Add a New Token](#7-how-to-add-a-new-token)
8. [Violations Found in Current Codebase](#8-violations-found-in-current-codebase)

---

## 1. Token Reference

All tokens are defined in `src/app/globals.css` under `:root`. Every CSS value in every component file **must** reference a token via `var(--token-name)`. No raw hex codes, no raw rgba, no raw pixel values, no raw font-name strings.

---

### 1.1 Color

| Token | Value | When to use |
|---|---|---|
| `--color-bg` | `#E8E4DC` | Page background; light surface default |
| `--color-bg-dark` | `#0D0D0D` | Footer; dark hero sections; dark cards |
| `--color-text` | `#0D0D0D` | Primary text on light surfaces |
| `--color-text-muted` | `#2A2A28` | Secondary text, labels, subtitles, descriptions |
| `--color-text-inverse` | `#E8E4DC` | Text on dark (`--color-bg-dark`) surfaces |
| `--color-accent` | `#e85d24` | Eyebrows; filled CTA buttons; hover states; status-live badge; stat values; list markers |
| `--color-border` | `rgba(13,13,13,0.12)` | Default section dividers; card separators; list-item borders |
| `--color-border-strong` | `rgba(13,13,13,0.35)` | Emphasized dividers; form input underlines; top border of spec cards |
| `--color-bg-sand-dark` | `#A89880` | Summit section background only |
| `--color-text-on-sand` | `#F5F0E8` | All text on `--color-bg-sand-dark` surfaces |
| `--color-border-light` | `rgba(245,240,232,0.2)` | Dividers on dark or sand surfaces |
| `--color-footer-muted` | `rgba(232,228,220,0.4)` | Footer secondary text and labels |
| `--color-footer-border` | `rgba(232,228,220,0.1)` | Footer internal dividers |
| `--color-accent-grid` | `rgba(232,93,36,0.04)` | Accent grid lines on dark backgrounds (Hero component) |
| `--color-accent-glow` | `rgba(232,93,36,0.07)` | Accent radial glow on dark backgrounds (Hero component) |
| `--color-border-on-dark` | `rgba(255,255,255,0.06)` | Divider borders on dark backgrounds (ticker strip) |
| `--color-ticker-on-dark` | `rgba(245,240,232,0.18)` | Ticker label text on dark backgrounds |

**Surface pairing rules.** Always use the matching text token for each background:

| Background | Text | Border |
|---|---|---|
| `--color-bg` | `--color-text` / `--color-text-muted` | `--color-border` / `--color-border-strong` |
| `--color-bg-dark` | `--color-text-inverse` | `--color-border-light` / `--color-footer-border` |
| `--color-bg-sand-dark` | `--color-text-on-sand` | `--color-border-light` |

**Accent usage.** `--color-accent` is never used as a section background or large surface fill. It is reserved for small, high-signal moments: eyebrow text, hover targets, button fills, badge fills, list-marker characters.

---

### 1.2 Typography

Two typefaces. No others.

| Token | Value | Loaded weights | When to use |
|---|---|---|---|
| `--font-display` | `'IBM Plex Sans', sans-serif` | 300, 400, 500 | Headings, card titles, stat values, nav links, logo, form input text (user-typed) |
| `--font-body` | `'IBM Plex Serif', serif` | 300, 400 | Eyebrows, body copy, subtitles, labels, meta, buttons, footer |

Both fonts are loaded in `src/app/layout.tsx` via `next/font/google` and injected as CSS variables. Do not import them anywhere else.

**Type scale.**

| Token | Value | Typical use |
|---|---|---|
| `--text-xs` | `0.75rem` | Eyebrows, labels, meta, buttons, caps |
| `--text-sm` | `0.9375rem` | Body copy, descriptions, form text |
| `--text-base` | `1rem` | Nav logo, baseline |
| `--text-md` | `1.375rem` | Card headlines, subheadings, pricing copy |
| `--text-lg` | `2.625rem` | Large stat values |
| `--text-xl` | `7rem` | Display (hero lockup lines) |
| `--text-2xl` | `11rem` | Maximum display |

For responsive headings, always use `clamp()` anchored to scale tokens:

```css
/* Standard section headline */
font-size: clamp(2rem, 4vw, 3.25rem);

/* Large headline (PageHero title) */
font-size: clamp(2.5rem, 6vw, 5rem);

/* Feature section headline */
font-size: clamp(1.75rem, 3.5vw, 2.625rem);
```

**Font-weight rules.** Only 300, 400, and 500 are available (the only loaded weights). Do not use 600, 700, or any other weight.

**Letter-spacing conventions.**

| Context | Value |
|---|---|
| Eyebrows and uppercase labels | `0.2em` |
| Nav links (uppercase) | `0.12em` |
| Small-caps meta (dates, categories) | `0.15em` |
| Button text | `0.06em` |
| Display / section headlines | `-0.02em` (negative tracking) |
| Body copy | none |

---

### 1.3 Spacing

8pt scale. Use only these tokens for all margin, padding, and gap values. The only exception is the 2px sub-pixel offset used on underline CTAs (documented in section 5).

| Token | Value | px |
|---|---|---|
| `--space-1` | `0.25rem` | 4 |
| `--space-2` | `0.5rem` | 8 |
| `--space-3` | `0.75rem` | 12 |
| `--space-4` | `1rem` | 16 |
| `--space-5` | `1.25rem` | 20 |
| `--space-6` | `1.5rem` | 24 |
| `--space-8` | `2rem` | 32 |
| `--space-10` | `2.5rem` | 40 |
| `--space-12` | `3rem` | 48 |
| `--space-16` | `4rem` | 64 |
| `--space-20` | `5rem` | 80 |
| `--space-24` | `6rem` | 96 |
| `--space-32` | `8rem` | 128 |

**Section vertical padding.** Three levels:

| Amount | When |
|---|---|
| `var(--space-16) 0` | Compact sub-sections |
| `var(--space-20) 0` | Standard content sections |
| `var(--space-24) 0` | Feature / flagship sections (Certification, Summit) |

---

### 1.4 Layout

| Token | Value | Use |
|---|---|---|
| `--nav-height` | `72px` | Offset for fixed nav in padding calculations |
| `--section-padding` | `var(--space-20)` | Default section vertical rhythm |
| `--container-gutter` | `var(--space-8)` | Horizontal page margin; overrides Bootstrap default |

**Content max-widths.** These are not tokens — they are documented conventions applied via `max-width` in CSS modules.

| Content type | Max-width |
|---|---|
| Body text / overview copy | `680px`–`720px` |
| PageHero inner block | `860px` |
| Page subtitle / description | `600px` |
| Form | `560px` |
| Hero body text | `480px`–`640px` |

---

### 1.5 Borders & Radius

| Token | Value | Use |
|---|---|---|
| `--radius-none` | `0px` | Default — all cards, buttons, inputs, sections |
| `--radius-pill` | `999px` | Status badges only (Live / Coming Soon) |

No other radius values are permitted. The circular image carousel in HeroHomepage (`border-radius: 50%`) is an intentional design-unique exception and must not be replicated elsewhere.

**Documented non-token pixel value.** The underline CTA offset `padding-bottom: 2px` and the underline height `height: 2px` are intentional sub-pixel values with no corresponding scale token. They are not violations.

---

### 1.6 Transitions

| Token | Value | Use |
|---|---|---|
| `--ease-default` | `200ms ease` | All CSS hover transitions (color, border, opacity, background) |
| `--ease-slow` | `600ms cubic-bezier(0.16,1,0.3,1)` | Reference for Framer Motion — use as `ease: [0.16,1,0.3,1]` |

All content-entry animations use Framer Motion with `ease: [0.16, 1, 0.3, 1]`. CSS transitions are reserved for hover-state changes only.

---

### 1.7 Texture

| Token | Value | Use |
|---|---|---|
| `--noise-opacity` | `0.04` | Global noise overlay on `body::before` |
| `--grid-dot-color` | `rgba(13,13,13,0.18)` | Dot grid on `html` background |
| `--grid-dot-size` | `1px` | Dot grid |
| `--grid-gap` | `28px` | Dot grid repeat interval |

The noise overlay and dot grid are applied globally in `globals.css`. Components must not re-apply them. The Summit section applies its own noise at `0.06` opacity via `::before` — this is the only permitted per-section texture override.

---

## 2. CSS Architecture Rules

### 2.1 File co-location

Every component has exactly one CSS module, colocated in the same directory:

```
src/components/ComponentName/
├── ComponentName.js        (or .tsx)
└── ComponentName.module.css
```

For page-level styles:

```
src/app/route-name/
├── page.tsx
├── ClientComponent.tsx     (if interactivity is needed)
└── route-name.module.css
```

**Rule: never put page-specific styles into `globals.css`.** That file contains tokens and resets only. Any rule that scopes to a specific route or component belongs in a module.

### 2.2 Naming convention

CSS module class names use **camelCase**. No BEM, no kebab-case.

```css
/* correct */
.cardTitle { }
.sectionEyebrow { }
.submitButton { }

/* wrong */
.card-title { }
.section__eyebrow { }
.submit_button { }
```

Modifier classes are added alongside the base class in JSX:

```jsx
<div className={`${styles.card} ${isActive ? styles.cardActive : ''}`} />
```

### 2.3 No global utility classes

Do not add utility classes to `globals.css` (e.g., `.flex`, `.text-center`, `.mt-4`). The project uses Bootstrap grid for layout and CSS modules for everything else. All styling is scoped.

### 2.4 Inline styles

Inline `style={{}}` is permitted **only** in server-component page files where creating a full CSS module for one or two values would be disproportionate. When used, inline style values must reference CSS variables — never raw values:

```jsx
/* permitted */
<section style={{ padding: 'var(--space-16) 0', borderTop: '1px solid var(--color-border)' }}>

/* forbidden */
<section style={{ padding: '64px 0', borderTop: '1px solid rgba(13,13,13,0.12)' }}>
```

Any page that uses more than three inline style blocks is a refactor candidate — extract a CSS module.

### 2.5 Component CSS structure

Write CSS modules in this order, with section comments:

```css
/* ─── Section/wrapper ──── */
/* ─── Header / eyebrow ─── */
/* ─── Content elements ─── */
/* ─── Interactive states ── */
/* ─── Responsive ────────── */
```

### 2.6 Responsive breakpoints

Two breakpoints. Bootstrap's `lg` grid activates at 992px.

| Breakpoint | Media query | Use |
|---|---|---|
| Mobile | `max-width: 767px` | Stack columns, hide non-essential elements, increase tap targets |
| Tablet | `min-width: 768px` and `max-width: 1024px` | Intermediate adjustments (rarely needed) |
| Desktop | ≥ 1025px (default) | Full multi-column layouts |

Always write mobile overrides inside a `@media (max-width: 767px)` block at the bottom of the CSS module.

---

## 3. Component Library

### Inventory

| Component | Path | Type | Props |
|---|---|---|---|
| `Nav` | `components/Nav/Nav.js` | Client | `pinned?: boolean` |
| `PageHero` | `components/PageHero/PageHero.tsx` | Server | `eyebrow, title, subtitle` |
| `HeroHomepage` | `components/HeroHomepage/HeroHomepage.js` | Client | none |
| `HeroNews` | `components/HeroNews/HeroNews.module.css` | — | Used on news landing |
| `Hero` | `components/Hero/Hero.js` | Client | `eyebrow, headline, subtext, ctas` |
| `ArticleCard` | `components/ArticleCard/ArticleCard.js` | Client | `article: {slug,image,headline,category,date?}` |
| `ArticleGrid` | `components/ArticleGrid/ArticleGrid.js` | Client | none |
| `FeaturedArticle` | `components/FeaturedArticle/FeaturedArticle.js` | Client | `parallaxY` |
| `Certification` | `components/Certification/Certification.js` | Client | none |
| `FoundingCohort` | `components/FoundingCohort/FoundingCohort.tsx` | Server | `checkoutUrl: string` |
| `Summit` | `components/Summit/Summit.js` | Client | none |
| `Footer` | `components/Footer/Footer.js` | Client | none |

---

### Component specifications

#### Nav — `components/Nav/Nav.js`

Fixed to the top of the viewport. Transparent and hidden by default; becomes visible on scroll past 40px or when `pinned` is true.

```jsx
<Nav />          // homepage — fades in on scroll
<Nav pinned />   // all other pages — always visible
```

| State | Background | Opacity |
|---|---|---|
| Default (unscrolled, not pinned) | transparent | 0 (invisible) |
| Scrolled or pinned | `--color-bg` | 1 |
| Mobile (always) | `--color-bg` | 1 |

Desktop links: `--font-display`, `text-xs`, uppercase, `letter-spacing: 0.12em`. Hover reveals a `2px` underline expanding from 0% to 100% width via `::after`.

Mobile: hamburger opens a full-screen overlay with links at `--text-lg`. Body scroll locks while open.

**Rule:** Every page except the homepage must use `<Nav pinned />`. The homepage uses `<Nav />`.

---

#### PageHero — `components/PageHero/PageHero.tsx`

Standard page introduction. Accounts for `--nav-height` in top padding. Inner content max-width: `860px`. Subtitle max-width: `600px`.

```jsx
<PageHero
  eyebrow="Category Label"
  title="The page headline."
  subtitle="One or two sentences of supporting copy."
/>
```

**Rule:** Use `PageHero` for all non-homepage routes that need a page-level header. Do not create bespoke hero sections for standard pages.

---

#### Footer — `components/Footer/Footer.js`

Dark background (`--color-bg-dark`). Four columns: logo + tagline, pages, certifications, social. No props.

```jsx
<Footer />
```

**Rule:** `<Footer />` is always the last element on every page. Never create a one-off footer variation.

---

#### ArticleCard — `components/ArticleCard/ArticleCard.js`

Linked card with 16:9 thumbnail, category + date meta row, display headline. Top-border separator. Hover turns headline to `--color-accent`.

```jsx
<ArticleCard article={{ slug, image, headline, category, date }} />
```

---

#### ArticleGrid — `components/ArticleGrid/ArticleGrid.js`

Self-contained section that fetches and renders article cards in a Bootstrap grid. Includes an eyebrow, section headline, card grid, and a "View All" underline button.

---

#### FeaturedArticle — `components/FeaturedArticle/FeaturedArticle.js`

Auto-advancing carousel of featured articles. 2:3 portrait image on the left, content on the right. Square dot-nav for manual control. Accepts a `parallaxY` motion value for scroll-linked parallax on the image.

---

#### Certification — `components/Certification/Certification.js`

Flagship section. Contains: header row (eyebrow, headline, CTA), dark featured card with count-up spec metrics, 2×2 stat cards, and a credential-track grid.

---

#### FoundingCohort — `components/FoundingCohort/FoundingCohort.tsx`

Two-column promotional block: cohort description on the left, pricing and CTA on the right. The "Reserve Your Seat" button here is the **canonical filled button reference** — see section 5.

```jsx
<FoundingCohort checkoutUrl="https://…" />
```

---

#### Summit — `components/Summit/Summit.js`

Sand-surface section (`--color-bg-sand-dark`). Two columns: headline + CTA buttons on the left, track list on the right. All text uses `--color-text-on-sand`. CTAs are underline-text style (Pattern B adapted for sand surface — Pattern C).

---

#### Hero — `components/Hero/Hero.js`

Full-height dark section (`--color-bg-dark`) with animated word-by-word headline, radial accent glow, and grid texture background. Used on secondary marketing pages, not the homepage.

---

### Component candidates (not yet extracted)

The following patterns appear identically in three or more places and should be extracted into shared components. Until that happens, each implementation must match the specification exactly.

| Pattern | Current locations | Notes |
|---|---|---|
| **Eyebrow** (uppercase accent label) | 8 CSS modules + 7 page files | Identical 6-line CSS block re-declared everywhere. Strong candidate for a `<Eyebrow>` component or a shared CSS class. |
| **Underline CTA (Pattern B)** | 15 declarations across 10 files | The exact same `border-bottom: 2.5px` + font-body + weight-500 block. Should be a `<TextCta>` or `<UnderlineLink>` component. |
| **Back link** | `ArticlePage.module.css`, `CredentialPage.module.css` | Identical CSS. Should be a `<BackLink>` component. |
| **Status badge / pill** | `Certification.module.css`, `CredentialPage.module.css` | Same `.statusPill/.statusLive/.statusSoon` defined twice. Should be a shared `<StatusBadge>` component. |
| **`robotPulse` keyframe** | `HeroHomepage.module.css`, `HeroNews.module.css`, `Nav.module.css` | Identical `@keyframes` block defined three times. Should live in `globals.css` as a named animation and be referenced by class. |
| **Ticker** (scrolling label strip) | `Hero.module.css`, `HeroHomepage.module.css` | Near-identical markup and CSS. Only the speed differs (28s vs 38s). Should be a `<Ticker>` component accepting an `items` array and optional `duration`. |

---

## 4. Page Patterns

### 4.1 Standard content page

Every non-homepage route follows this shell:

```tsx
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'Page Name — The Robot Age',
  description: 'One sentence for search engines.',
}

export default function PageName() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Category"
        title="The headline."
        subtitle="Supporting copy."
      />
      {/* content sections */}
      <Footer />
    </>
  )
}
```

Metadata title format: `{Page} — The Robot Age`.

---

### 4.2 Content section

Every section below the hero follows this structure:

```jsx
<section className={styles.section}>       {/* border-top + padding */}
  <div className="container-fluid">
    <p className={styles.eyebrow}>Category</p>
    <h2 className={styles.headline}>Section headline.</h2>
    {/* content */}
  </div>
</section>
```

Section CSS minimum:

```css
.section {
  padding: var(--space-20) 0;
  border-top: 1px solid var(--color-border);
}
```

---

### 4.3 Three-column card grid

Used when presenting three parallel concepts (e.g., Enterprise "Why this matters"). Separator borders, no box borders.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
}
.card {
  padding: var(--space-8);
  border-left: 1px solid var(--color-border);
}
.card:first-child { border-left: none; }

@media (max-width: 767px) {
  .grid { grid-template-columns: 1fr; }
  .card { border-left: none; border-top: 1px solid var(--color-border); }
  .card:first-child { border-top: none; }
}
```

---

### 4.4 Numbered outcome list

Used for "what you'll walk away with" / outcome-style lists. Zero-padded accent numbers.

```css
.item {
  display: flex;
  gap: var(--space-6);
  padding: var(--space-6) 0;
  border-top: 1px solid var(--color-border);
}
.item:last-child { border-bottom: 1px solid var(--color-border); }

.number {
  font-family: var(--font-display);
  font-size: var(--text-xs);
  color: var(--color-accent);
  letter-spacing: 0.1em;
  min-width: 2rem;
  flex-shrink: 0;
}
```

Numbers are strings: `"01"`, `"02"`, etc.

---

### 4.5 Two-column content + sidebar

Used in article pages, credential pages, FoundingCohort. CSS Grid (not Bootstrap columns) at this level.

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 38%;
  gap: var(--space-16);
  align-items: start;
}

@media (max-width: 767px) {
  .layout { grid-template-columns: 1fr; }
}
```

---

### 4.6 Dark featured card

Used inside Certification and as a general pattern for high-emphasis blocks on dark backgrounds.

```css
.card {
  background: var(--color-bg-dark);
  color: var(--color-text-inverse);
  padding: var(--space-12);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 520px;
}
```

---

### 4.7 Spec / key-value list

Used in FoundingCohort right column and CredentialPage sidebar. Top border strong, items separated by default border.

```css
.list { border-top: 1px solid var(--color-border-strong); }
.item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--color-border);
}
.label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-text-muted);
}
.value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text);
}
```

---

### 4.8 Stat card grid (2×2)

Used in Certification. Equal-border grid using selective border rules to avoid doubled lines.

```css
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.card {
  border: 1px solid var(--color-border);
  border-top: none;
  border-right: none;
  padding: var(--space-6);
}
.card:nth-child(1), .card:nth-child(2) { border-top: 1px solid var(--color-border); }
.card:nth-child(2), .card:nth-child(4) { border-right: 1px solid var(--color-border); }
```

---

## 5. Buttons & CTAs

Three patterns. Use the correct one for the context. Do not invent new button styles.

---

### Pattern A — Filled button (form submit, primary purchase)

The reference implementation is `FoundingCohort.module.css .cta`. Every form submit button in the project must match this exactly.

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
border-radius: 0;            /* always square — never pill */
cursor: pointer;
transition: background var(--ease-default);

/* hover */
background: var(--color-text);
```

Rules:
- Background is always `--color-accent` (orange). Never any other color.
- `border-radius` is always `0`. Never pill-shaped.
- Hover background is always `--color-text` (dark).
- Used only for form submissions and transactional CTAs (checkout, waitlist, request).

---

### Pattern B — Underline text link (light surface)

Used for navigation CTAs, "View All" actions, back links, inline calls to action on `--color-bg`.

```css
display: inline-block;        /* inline-flex when pairing with an icon */
padding: 0;
padding-bottom: 2px;          /* intentional sub-pixel offset — not a token */
background: none;
border: none;
border-bottom: 2.5px solid var(--color-text);
font-family: var(--font-body);
font-weight: 500;
font-size: var(--text-xs);
letter-spacing: 0.06em;
color: var(--color-text);
cursor: pointer;
text-decoration: none;
transition: color var(--ease-default), border-color var(--ease-default);

/* hover */
color: var(--color-accent);
border-color: var(--color-accent);
```

When paired with an inline arrow SVG, use `inline-flex` and `align-items: center; gap: var(--space-2)`. On hover the arrow translates `4px` right.

---

### Pattern C — Underline text link (dark or sand surface)

Same as Pattern B but adapted for `--color-bg-dark` or `--color-bg-sand-dark` backgrounds. Used in Summit CTAs and footer.

```css
color: var(--color-text-on-sand);       /* or --color-text-inverse on dark */
border-bottom: 2.5px solid var(--color-text-on-sand);
font-family: var(--font-body);
font-weight: 400;
font-size: var(--text-xs);
text-transform: uppercase;
letter-spacing: 0.1em;
padding-bottom: 2px;

/* hover */
color: var(--color-accent);
border-color: var(--color-accent);
```

---

### Arrow SVG (canonical)

All inline directional arrows use this SVG. No other arrow variants.

```jsx
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round" />
</svg>
```

---

## 6. Forbidden Patterns

These rules are stated as enforceable constraints. An agent reviewing a PR should flag each one.

### Tokens

- **Never hardcode a color.** No hex values (`#e85d24`), no `rgb()`, no `rgba()` in component CSS or JSX. Use `var(--color-*)`.
- **Never hardcode a font-size** in component CSS. Use `var(--text-*)` or `clamp()` built from those tokens.
- **Never hardcode a font-family string** in component CSS. Use `var(--font-display)` or `var(--font-body)`.
- **Never use a font-weight outside 300, 400, or 500.** Only these weights are loaded.
- **Never hardcode a spacing value** (margin, padding, gap) with a raw pixel or rem value from outside the scale. Use `var(--space-*)`. Exception: `2px` on `padding-bottom` for underline CTA offset, and `4px` for `translateX` on arrow hover — both are documented intentional micro-values.
- **Never reference a border-radius** other than `var(--radius-none)` or `var(--radius-pill)`. The `50%` circle in HeroHomepage's image carousel is an intentional exception; do not replicate it.

### Styling method

- **Never use Tailwind utility classes.** The package is installed but not used. No `className="flex gap-4 text-sm text-gray-600"`.
- **Never add a `<style>` tag** inside a component or page file.
- **Never add component-scoped CSS to `globals.css`.** That file is tokens and resets only.
- **Never use inline styles for more than three simple values on a single element.** If you need more, extract a CSS module.
- **Never use a raw numeric `maxWidth` in JSX.** `maxWidth: 560` has no unit and resolves to `560px` only by accident. Always use a string: `maxWidth: '560px'` or reference a token: `maxWidth: 'var(--space-32)'` — or better, put it in a CSS module.

### Buttons and forms

- **Never round a button.** `border-radius: 0` on all buttons. No pill-shaped buttons anywhere.
- **Never use a filled button color other than `--color-accent`.** Form submit buttons are always orange.
- **Never re-style the submit button** per-page. Refer to Pattern A.
- **Never put a box border on all four sides of a card.** Use the border-separator pattern (border-left or border-top).
- **Never use `box-shadow`** anywhere in the codebase.

### Components and content

- **Never use emoji in structural UI.** No emoji in card headers, eyebrows, button labels, list markers, or section titles.
- **Never import or use an icon library.** All icons are hand-authored inline SVG with `aria-hidden="true"`.
- **Never create a custom footer.** Always reuse `<Footer />`.
- **Never omit `<Nav pinned />`** on a non-homepage page.
- **Never omit `<Footer />`** on any page.
- **Never omit `export const metadata`** from a page file.
- **Never use `text-align: justify`** in any component. It produces inconsistent word spacing and is not part of the design language.

### Animation

- **Never animate content with CSS keyframes.** Only Framer Motion for content transitions. The only CSS keyframe animations permitted are `robotPulse` and `tickerScroll` — both are purely decorative, non-content animations.
- **Never trigger a Framer Motion entrance animation without `useInView` with `once: true`** for sections below the fold. Animations should not replay when the user scrolls back up.

---

## 7. How to Add a New Token

Tokens are the only global shared state in the styling system. Adding one requires a deliberate process so the token list stays curated rather than growing unbounded.

### Step 1 — Verify the need

Before adding a token, ask:
1. Does an existing token cover this value? Check the full list in section 1.
2. Is this value used in more than one component? If it appears only once, hardcoding it in the component module (as a local CSS variable or value) is acceptable.
3. Is it a value that will evolve over time and needs to be changed globally? If so, it belongs in tokens.

### Step 2 — Name the token

Follow the naming convention for the category:

| Category | Pattern | Example |
|---|---|---|
| Color | `--color-{role}` or `--color-{role}-{variant}` | `--color-bg-alt`, `--color-text-dim` |
| Typography | `--font-{role}` or `--text-{size-name}` | `--text-3xl` |
| Spacing | `--space-{scale-step}` | `--space-14` |
| Layout | `--{thing}-{property}` | `--sidebar-width` |
| Radius | `--radius-{name}` | `--radius-sm` |
| Transition | `--ease-{name}` | `--ease-bounce` |

Names must be semantic (what it *is* or *means*), not descriptive (what it *looks like*). `--color-accent` is correct; `--color-orange` is not.

### Step 3 — Add to `globals.css`

Add the new token to the appropriate group inside `:root` in `src/app/globals.css`. Include a comment if the purpose isn't immediately obvious from the name.

```css
:root {
  /* existing tokens... */

  /* new token — added for [feature/component name] */
  --color-bg-elevated: #EDEAE2;
}
```

### Step 4 — Reference it

Use `var(--new-token)` in the component CSS module. Never paste the raw value.

### Step 5 — Document it

Add a row to the relevant table in section 1 of this file with: token name, value, and when to use it.

---

## 8. Violations Found in Current Codebase

The following violations were identified during the initial audit. They are documented here rather than silently fixed so the team can track and prioritize remediation. An enforcement agent should treat these as known exceptions until they are resolved, then resume flagging.

---

### ~~V-01~~ — Hardcoded rgba values in component CSS modules — **RESOLVED**

Tokens added to `globals.css`: `--color-accent-grid`, `--color-accent-glow`, `--color-border-on-dark`, `--color-ticker-on-dark`. All hardcoded `rgba()` values in `Certification.module.css` and `Hero.module.css` replaced with token references.

---

### ~~V-02~~ — `access/page.tsx` uses inline styles for an entire form — **RESOLVED**

Extracted to `src/app/access/access.module.css`. All inline styles removed; submit button now has a working `:hover` state.

---

### ~~V-03~~ — `connect/page.tsx` uses inline styles for the contact list — **RESOLVED**

Extracted to `src/app/connect/connect.module.css`. Link hover state (accent color) now works correctly.

---

### ~~V-04~~ — Raw numeric `maxWidth` values without units in JSX — **RESOLVED**

Resolved as part of V-02 and V-03: all max-width constraints moved into CSS modules (`access.module.css`, `connect.module.css`).

---

### ~~V-05~~ — `border-radius: 0` not using token — **RESOLVED**

All occurrences in `enterprise.module.css` and `FoundingCohort.module.css` replaced with `var(--radius-none)`.

---

### ~~V-06~~ — Hardcoded font-size values not using tokens — **RESOLVED**

- `HeroHomepage.module.css` `.tickerSep`: changed to `font-size: var(--text-xs); opacity: 0.4`.
- `Summit.module.css` responsive headline: changed to `font-size: clamp(1.75rem, 4vw, 2.5rem)`.

---

### ~~V-07~~ — `text-align: justify` in FeaturedArticle — **RESOLVED**

Changed to `text-align: left` in `FeaturedArticle.module.css`.

---

### V-08 — `robotPulse` keyframe defined three times

**Files:** `HeroHomepage.module.css:120`, `HeroNews.module.css:51`, `Nav.module.css:43`

**Violation:** Identical `@keyframes robotPulse` block defined independently in three CSS modules. Because CSS modules are scoped, each becomes a separate animation. This is a maintenance risk — a change to the animation must be made in three places. **Component candidate:** move the keyframe to `globals.css` and reference it as a named animation class from each component.

---

### V-09 — `tickerScroll` keyframe and ticker CSS defined twice

**Files:** `Hero.module.css:165–197`, `HeroHomepage.module.css:138–172`

**Violation:** The ticker pattern (scrolling strip of uppercase labels) is implemented independently in two components with near-identical CSS. Only the scroll duration differs (28s vs 38s). **Component candidate:** extract a `<Ticker>` component accepting `items: string[]` and optional `duration?: number`.

---

### V-10 — Underline CTA (Pattern B) declared 15 times across 10 files

**Files:** `ArticleGrid.module.css`, `Certification.module.css` (×4), `FeaturedArticle.module.css`, `Hero.module.css` (×2), `HeroHomepage.module.css` (×2), `CredentialPage.module.css` (×2), `ArticlePage.module.css`

**Violation:** The same 8–10 line CSS block (`border-bottom: 2.5px`, font-body, weight 500, text-xs, 0.06em tracking, hover to accent) is re-declared in 15 places. Any change to the style — thickness, color, weight — requires 15 edits. **Strong component candidate:** extract `<TextCta>` or `<UnderlineLink>` component.

---

### V-11 — Eyebrow pattern CSS declared 8 times

**Files:** `enterprise.module.css`, `CredentialPage.module.css`, `ArticleGrid.module.css`, `Certification.module.css`, `Hero.module.css`, `HeroHomepage.module.css`, `PageHero.module.css`, `Summit.module.css`

**Violation:** Identical eyebrow CSS (font-body, 300, text-xs, uppercase, letter-spacing 0.2em, accent color) is re-declared 8 times. **Component candidate:** extract `<Eyebrow>` component or a shared CSS module utility class.

---

### V-12 — Back link CSS declared twice

**Files:** `ArticlePage.module.css:90–104`, `CredentialPage.module.css:255–270`

**Violation:** Identical `.backLink` CSS in two separate page modules. **Component candidate:** extract `<BackLink>` component.

---

### V-13 — Status badge CSS declared twice

**Files:** `Certification.module.css` (`.statusPill/.statusLive/.statusSoon`), `CredentialPage.module.css` (`.status/.statusLive/.statusSoon`)

**Violation:** Same status badge pattern (pill shape, accent for Live, border-color for Coming Soon) defined in two components. **Component candidate:** extract `<StatusBadge status="Live" | "Coming Soon">`.

---

### ~~V-14~~ — `Hero.module.css` eyebrow incorrect weight and letter-spacing — **RESOLVED**

`.eyebrow` had `font-weight: 500` (only 300/400/500 loaded but 300 is the eyebrow standard) and `letter-spacing: 0.18em` (standard is `0.2em`). Fixed to `font-weight: 300; letter-spacing: 0.2em`.

---

### ~~V-15~~ — `Hero.module.css` subtext wrong surface color — **RESOLVED**

`.subtext` used `color: var(--color-text-muted)` (`#2A2A28`) on a `--color-bg-dark` (`#0D0D0D`) background — near-invisible contrast. Fixed to `color: var(--color-text-inverse); opacity: 0.65`.

---

### ~~V-16~~ — `HeroHomepage.module.css` eyebrow uses wrong font — **RESOLVED**

`.eyebrow` used `var(--font-display)` with `font-weight: 400` instead of the standard `var(--font-body)` with `font-weight: 300`. Fixed to match all other eyebrow implementations.

---

### ~~V-17~~ — `HeroHomepage.module.css` tagline uses sand surface color on light background — **RESOLVED**

`.tagline` had `color: var(--color-text-on-sand)` (`#F5F0E8`) on a `--color-bg` (`#E8E4DC`) surface — effectively invisible. Fixed to `var(--color-text)`.

---

### ~~V-18~~ — `--space-5` used but undefined — **RESOLVED**

`FoundingCohort.module.css` referenced `var(--space-5)` in two places but the token was missing from `globals.css`. Added `--space-5: 1.25rem` to the spacing scale.

---

### ~~V-19~~ — `enterprise.module.css` textarea `min-height` hardcoded in px — **RESOLVED**

`min-height: 96px` equates to `var(--space-24)` (6rem). Replaced with the token.
