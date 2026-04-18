# The Robot Age — Monorepo

## Structure

| Directory   | Purpose            | Instructions             |
|---|---|---|
| `frontend/` | Next.js App Router | See `frontend/CLAUDE.md` |
| `backend/`  | API server         | See `backend/CLAUDE.md`  |

## Agents

Project agents live in `frontend/.claude/agents/` and are active when
Claude Code is opened from the `frontend/` directory.

| Agent                    | When to use                                           |
|---|---|
| `page-builder`           | Creating any new page, route, or page section         |
| `content-writer`         | Writing or revising any visible copy, headlines, CTAs |
| `design-system-enforcer` | Final check before any UI change is considered done   |

## Frontend styling

The frontend uses per-component CSS files co-located with each component
(CSS Modules). There is no Tailwind and no CSS-in-JS. Do not add either.
All style values must come from the CSS custom properties defined in
`frontend/src/app/globals.css`.
