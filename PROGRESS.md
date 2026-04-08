# The Robot Age — Progress Log

## Project Setup
- Initialised monorepo at `/THEROBOTAGE/`
- **Frontend**: Next.js 16 (App Router, TypeScript, Tailwind removed)
- **Backend**: Strapi v5 (SQLite, quickstart)
- Root `package.json` with `npm run dev` (runs both via concurrently)
- Strapi API client at `frontend/src/lib/strapi.ts` (`strapiGet` / `strapiPost`)
- Setup instructions documented in `SETUP.md`

---

## Design System

### Fonts
- `DM Serif Display` — display/headline font (`--font-display`)
- `Outfit` — body/UI font (`--font-body`)
- Loaded via `next/font/google` in `layout.tsx`

### CSS Architecture
- All design tokens as CSS custom properties in `globals.css`
- No hardcoded values in any `.module.css` — only `var(--*)`
- Bootstrap grid only (`bootstrap-grid.min.css`) — no Bootstrap components
- No Tailwind
- Single padding source of truth: `.container-fluid` gets `var(--container-gutter)` in `globals.css`

### Global Tokens (`globals.css`)
**Colors:** `--color-bg`, `--color-bg-dark`, `--color-text`, `--color-text-muted`,
`--color-text-inverse`, `--color-accent` (#e85d24), `--color-border`,
`--color-border-strong`, `--color-bg-sand-dark`, `--color-text-on-sand`,
`--color-border-light`, `--color-footer-muted`, `--color-footer-border`

**Typography scale:** `--text-xs` through `--text-2xl`

**Spacing:** 8pt scale — `--space-1` through `--space-32`

**Misc:** `--nav-height`, `--radius-none`, `--radius-pill`, `--ease-default`, `--ease-slow`

### Global Background
- Static dot grid on `html` element via `radial-gradient`
- `background-attachment: fixed` — dots never scroll
- `background-position: 40px 40px` — 40px inset padding on all sides
- Tokens: `--grid-dot-color`, `--grid-dot-size` (1px), `--grid-gap` (28px)
- Noise texture overlay on `body::before` — `position: fixed`, `opacity: 0.04`, `pointer-events: none`

---

## Components Built

### Nav
`components/Nav/`
- Fixed position, full width, `z-index: 100`
- Transparent → `--color-bg` on scroll (JS scroll listener with cleanup)
- Logo: DM Serif Display left-aligned
- Links: RESEARCH / LEARN / ACCESS / CONNECT / SUMMIT — uppercase, 0.12em tracking
- Link hover: underline slides in from left via `::after` pseudo-element
- Hamburger SVG icon, visible below `768px`

### HeroNews
`components/HeroNews/`
- Full-viewport hero (`min-height: 100vh`)
- **Left col (col-lg-5):** Display lockup — THE / ROBOT / AGE
  - Font size: `clamp(3rem, 31cqi, 11rem)` — responsive to column width via `container-type: inline-size`
  - Line height: 0.85, letter-spacing: -0.02em
  - Framer Motion staggered entrance (y: 60→0, opacity, 0.9s per line)
  - "ROBOT" pulses sand brown → accent orange → sand brown via CSS keyframe (`4s ease-in-out infinite`)
  - Subtitle "robotics literacy for all" — large, full `--color-text`, weight 400, scales with `cqi`
- **Right col (col-lg-7):** FeaturedArticle carousel
- Parallax scroll effect via `useScroll` + `useTransform`

### FeaturedArticle (Carousel)
`components/FeaturedArticle/`
- 3 articles cycling with Framer Motion `AnimatePresence` (mode: wait)
- Direction-aware slide animation (x ±48px + opacity)
- Auto-advances every 5 seconds; timer resets on manual navigation
- Square nav dots below — outlined → filled black when active
- Articles: Embodied AI UX / Human Readiness Framework / RLP Module 1.1

### ArticleGrid + ArticleCard
`components/ArticleGrid/` + `components/ArticleCard/`
- 3-column Bootstrap grid (`col-md-4`)
- Scroll-triggered stagger entrance via Framer Motion `whileInView`
- Each card: border-top, 16:9 thumbnail, category tag, display headline
- Hover: headline transitions to `--color-accent`
- No border-radius anywhere — flat editorial aesthetic

### Certification
`components/Certification/`
- Two-row layout: section header + featured card + module cards
- **Featured card** (col-lg-7): dark bg, badge pill, program name, description
  - 3-column specs grid: Duration / Total learning / Group sessions
  - Count-up animation on scroll enter (1.2s, useEffect interval)
  - CTA: "Explore the Curriculum" → `/learn`
- **Module cards** (col-lg-5): 4 stacked, flex-fill height, hover border
  - Status pills: "Live" (accent orange) / "Coming Soon" (muted)
  - Modules: 1.1 Foundations (Live) / 1.2 HRI / 1.3 UX Pressure Points / 1.4 Robot Readiness Audit
- Scroll-triggered animations throughout
- Fully self-contained — no required props

### Summit
`components/Summit/`
- Sand-dark background (`--color-bg-sand-dark`) with noise texture overlay
- **Left col:** eyebrow, headline, subheadline, two CTA buttons
  - "Get Notified" (filled) + "Apply to Speak" (ghost border)
  - Hover on both → `--color-accent`
- **Right col:** 4 numbered track cards with border-bottom dividers
  - Tracks: Product Design & HRI / Ethics & Responsibility / Access & Equity / Business & Strategy
- Framer Motion scroll-triggered: headline slides up, tracks stagger in

### Footer
`components/Footer/`
- Dark background (`--color-bg-dark`)
- Three columns: Logo + tagline / Nav links / Social links (LinkedIn, YouTube, Instagram)
- Social links open in `_blank` with `rel="noopener noreferrer"`
- Divider + bottom row: copyright + Privacy Policy / Terms of Use links
- Nav link hover → `--color-accent`

---

## Session — 2026-04-06

### HeroHomepage — Full Redesign
`components/HeroHomepage/`

**Layout**
- Left panel fixed at `15vw`; right panel fills remaining `calc(100% - 15vw)`
- `container-fluid` made flex column so ticker pins to bottom of hero
- Ticker moved out of left column → full-width bottom bar spanning edge to edge

**Left panel**
- THE / ROBOT / AGE lockup moved to top of left column (above nav links)
- Lockup size reduced: `clamp(1.5rem, 16cqi, --text-xl)`
- Nav links stacked below the lockup
- Each nav item expands a hover panel with a short section description (Framer Motion height animation)

**Nav logo (`Nav/`)**
- Matched lockup style: `font-weight: 400`, `letter-spacing: -0.02em`
- "Robot" word pulses with same `robotPulse` keyframe as hero lockup

**Right panel copy**
- New content stack:
  - Eyebrow: *For design, product, and marketing professionals.* — sans-serif (`--font-display`), orange (`--color-accent`), uppercase
  - H1: *Robotics for All. Not just engineers.*
  - Subtext: *Robotics is no longer a technical problem…*
  - CTA block (bordered top): tagline + Join/Explore CTAs
- Eyebrow moved inside `headlineCol` so it sits flush above h1, independent of image carousel height
- Tagline + CTAs wrapped in `.ctaBlock` with `border-top: 1px solid var(--color-border)`, vertically centred via flex

**Spacing tightened throughout right panel**
- Eyebrow → H1: `2rem`
- H1 → Subtext: `1rem`
- Subtext → CTA block: `3rem`
- Subtext and tagline unified at `--text-base` (1rem), then tagline upsized to `--text-md` (1.375rem)

**Typography**
- All muted copy (`--color-text-muted`) → `--color-text`; weights lifted from 300 → 400
- Tagline: `--font-display`, `font-weight: 400`, `--text-md`
- Subtext line-height tightened: `1.8` → `1.6`

**Ticker**
- Words darkened: `--color-text-muted` + `opacity: 0.55` → `--color-text`, `font-weight: 400`
- Orange hover: `color: var(--color-accent)` with `250ms ease` transition

**ArticleGrid (`components/ArticleGrid/`)**
- Added section header: eyebrow *Latest* + headline *News & Updates*
- Matching Certification-style animation (whileInView, staggered)
- `border-top` added to section

---

## Page Assembly (`app/page.tsx`)
```
Nav
HeroHomepage      ← 15vw brand/nav panel + right copy panel + full-width ticker
Certification     ← RLP featured card + module cards
ArticleGrid       ← section header + 3 article cards
Summit            ← event section
Footer
```

---

## Next Steps (not yet built)
- [ ] Connect all components to Strapi CMS (replace internal data consts)
- [ ] Individual article page (`/articles/[slug]`)
- [ ] Learn / Certification detail page (`/learn`)
- [ ] Summit page (`/summit`)
- [ ] Nav mobile menu (hamburger open state)
- [ ] Strapi content types: Article, Module, Track, SummitConfig
- [ ] Generate Strapi API token and wire `STRAPI_API_TOKEN` in `.env.local`
