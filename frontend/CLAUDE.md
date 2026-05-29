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

## Agents

| Agent                    | When to use                                           |
|---|---|
| `page-builder`           | Creating any new page, route, or page section         |
| `content-writer`         | Writing or revising any visible copy, headlines, CTAs |
| `design-system-enforcer` | Final check before any UI change is considered done   |

Always run `design-system-enforcer` on new or modified UI files before
declaring work done.
