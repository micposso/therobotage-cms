# Search — /search

Full-text search across all site content. Results page at `/search?q=`.

---

## Route

- **URL:** `/search?q={query}`
- **Rendering:** Dynamic (server-rendered on demand — not statically generated)
- **Robots:** `noindex, follow` — search result pages are excluded from Google indexing to avoid duplicate-content penalties

---

## Navigation entry point

Search is accessible from the main nav on every page:

- **Desktop:** Search icon button (right of nav links). Clicking it animates an inline text input open (width 0 → 220px via Framer Motion). Pressing Enter or submitting navigates to `/search?q=`. Escape closes the input. Nav links are hidden while search is open.
- **Mobile:** Full-screen menu includes a search form at the top (above the nav link list). Submitting closes the menu and navigates to `/search?q=`.

---

## Search index

Defined in `src/lib/searchIndex.ts`. Searches across:

| Content type | Source | Label shown |
|---|---|---|
| News articles | `news/*.md` (read at runtime via `getAllNewsArticles()`) | `News` |
| Field Signals essays | `src/lib/fieldSignals.ts` (static) | `Field Signal` |
| Certifications | `src/lib/certifications.ts` (static) | `Certification` |
| Research articles | `src/lib/articles.ts` (static) | `Research` |
| Static pages | Inline array in `searchIndex.ts` | `Page` |

### Scoring

Title matches are weighted 3× over body/excerpt matches. Results are sorted by score descending. No minimum score threshold — all non-zero matches are returned.

---

## Results page

- Shows result count, re-search form, and result list.
- Each result: type label, optional tag (e.g. RXD dimension), title (linked), 2-line clamped excerpt.
- Empty state: message with links to Research, Learn, and RXD.
- No query: shows "What are you looking for?" with the search form.

---

## Adding content to the index

- **News articles:** automatically included — any `.md` file in `news/` is picked up at runtime.
- **Research articles:** add to `src/lib/articles.ts`.
- **Field Signals:** add to `src/lib/fieldSignals.ts`.
- **Certifications:** add to `src/lib/certifications.ts`.
- **Static pages:** add an entry to the `staticPages` array in `src/lib/searchIndex.ts`.
