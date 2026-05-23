# SEO & LLM Indexing

How The Robot Age is configured for search engine indexing and discovery by AI/LLM tools.

---

## Title template

Defined in `src/app/layout.tsx`:

```ts
title: {
  default: "The Robot Age",
  template: "%s — The Robot Age",
}
```

Every page that exports a `title` string (e.g. `"RXD"`) automatically renders as `"RXD — The Robot Age"` in the browser tab and in search results. The homepage uses the default (`"The Robot Age"`).

---

## Root metadata (`layout.tsx`)

- **Description:** "Robotic literacy education, research, and certification for designers, strategists, and leaders who work alongside robots."
- **OpenGraph:** `siteName`, `type: website`, `locale: en_US` set on root layout.
- **metadataBase:** `https://therobotage.com` (falls back to `NEXT_PUBLIC_SITE_URL` env var).
- **Canonical:** `https://therobotage.com` set on root layout; individual pages can override.

---

## Structured data (JSON-LD)

Two JSON-LD blocks are injected on the homepage (`src/app/page.tsx`):

### EducationalOrganization
```json
{
  "@type": "EducationalOrganization",
  "name": "The Robot Age",
  "url": "https://therobotage.com",
  "sameAs": ["https://linkedin.com/company/therobotage"],
  "offers": { "@type": "Course", "name": "Robotics Experience Practitioner (REP)" }
}
```

### WebSite + SearchAction
```json
{
  "@type": "WebSite",
  "name": "The Robot Age",
  "url": "https://therobotage.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://therobotage.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

The `SearchAction` schema tells Google about the `/search` endpoint, enabling the Sitelinks Searchbox once the site has sufficient authority.

---

## Sitemap (`src/app/sitemap.ts`)

Auto-generated at `/sitemap.xml`. Includes:

| Content | Priority | Change frequency |
|---|---|---|
| Homepage | 1.0 | weekly |
| /research, /learn, /rxd | 0.9 | weekly / monthly |
| /robotics-literacy, /summit | 0.8 | monthly |
| /enterprise, /access, /robots | 0.7 | monthly |
| /connect | 0.6 | monthly |
| All news articles | 0.7 | yearly |
| All research articles | 0.7 | yearly |
| All field signals essays | 0.6 | yearly |
| All robot profiles | 0.6 | yearly |
| All certification + curriculum pages | 0.7–0.8 | monthly |
| /privacy, /terms, /ai-statement | 0.2 | yearly |

Dynamic content (news, robots, research, field signals) pulls actual `lastModified` dates from frontmatter. Static pages use `new Date()` (current build time).

---

## robots.txt (`src/app/robots.ts`)

- All crawlers: allow `/`, disallow `/api/`
- LLM crawlers explicitly welcomed: `GPTBot`, `ChatGPT-User`, `Claude-Web`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Perplexity-User`, `Gemini`, `Google-Extended`, `cohere-ai`
- `/search` is served to crawlers but carries `noindex` in its page metadata — crawlers follow links through it but don't index the results page itself.

---

## llms.txt (`public/llms.txt`)

Plain-text file at `/llms.txt` following the emerging LLM indexing standard. Contains:

- Platform overview and mission
- Full RXD framework description (all 6 dimensions)
- Research section: RES instrument, Field Signals (all 4 essays with URLs)
- Research articles index
- News section
- All 4 certification tracks (REP, RPDP, RSP, RXR) with URLs and descriptions
- Robot of the Week, Summit, Enterprise, Robotic Literacy, Search
- Contact emails and key page URL inventory

Update `public/llms.txt` whenever new sections, routes, or major content areas are added.

---

## Page-level metadata notes

- **Search page (`/search`):** `robots: { index: false, follow: true }` — excluded from Google index, link equity still flows through it.
- **News articles:** OG title, description, and image populated from frontmatter `title`, `excerpt`, `headerImage`.
- **Research/field signal pages:** generate their own metadata from static data sources.

---

## Redirects (`src/lib/redirects.ts`)

Centralized redirect table imported by `next.config.ts`. Current redirects:

| Source | Destination | Type |
|---|---|---|
| `/href` | `/rxd` | 301 permanent |
| `/hrx` | `/rxd` | 301 permanent |
| `/pdf/href-therobotage-v2.pdf` | `/pdf/rxd-therobotage-v2.pdf` | 301 permanent |

Add all future URL changes here — do not add inline redirects to `next.config.ts`.
