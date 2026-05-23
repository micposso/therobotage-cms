# News Article — /news/[slug]

*Dynamic route for individual news articles. Articles are sourced from markdown content files.*

---

## Page Structure

**Category** (e.g., News, Analysis, Opinion)

**Date** (e.g., May 7, 2026)

**Headline** — full article title

**Header image**

**Body** — article paragraphs

---

## Frontmatter fields

| Field | Required | Notes |
|---|---|---|
| `slug` | ✅ | URL path segment — must be unique |
| `title` | ✅ | Full article headline |
| `category` | ✅ | e.g. `NEWS`, `OPINION`, `RESEARCH` |
| `date` | ✅ | e.g. `May 17, 2026` |
| `excerpt` | ✅ | 1–2 sentence summary shown in cards and OG tags |
| `headerImage` | — | Full-bleed hero image path (e.g. `/images/news/filename.jpg`) |
| `thumbnailImage` | — | Card thumbnail; usually same as headerImage |
| `author` | — | Byline; defaults to "The Robot Age" if omitted |

---

## Published Articles (as of May 2026)

| Slug | Title | Date | Category |
|---|---|---|---|
| `southwest-airlines-humanoid-robot-ban` | Humanoids are here. The service industry is not ready. | May 17, 2026 | NEWS |
| `hugging-face-robot-app-store` | Open-source robotics gets an app store — and the price is the argument. | May 7, 2026 | NEWS |
| `elliq-case-study-experience-design` | Colin Angle's new robot pet is a lesson in expectation management | May 5, 2026 | NEWS |
| `automation-anxiety-vs-readiness` | *(title from file)* | — | NEWS |
| `the-familiar-hri-design-brief` | *(title from file)* | — | NEWS |
| `nasa-lunabotics-2026-autonomous-construction` | *(title from file)* | — | NEWS |
| `summit-nyc-call-for-speakers` | *(title from file)* | — | NEWS |

---

## Article page layout

- **Hero**: full-bleed image with gradient overlay; title (`h1`) and category/date/author row sit over the image. Hero title container is `max-width: 1100px`.
- **Body**: left column (`max-width: 720px`) + sticky right sidebar (Related links, waitlist CTA). Sidebar hidden on mobile.
- **Markdown support**: paragraphs, h2/h3, blockquotes, inline images, hr, lists, strong/em, links.
- **OG/Twitter**: populated from frontmatter `title`, `excerpt`, `headerImage`.

---

## Notes

- Articles are sourced from `news/*.md` at build time — drop a `.md` file to publish.
- Homepage grid shows 3 most recent; expandable to show all via "See all news" button.
- Also surfaced in the Latest News section on /research and in `/search` results.
- No dedicated `/news` index listing page exists — articles are only accessible via cards and search.
