# Sitemap — The Robot Age

Generated: 2026-05-21

---

## Site Diagram

```
therobotage.com
│
├── / (Homepage)
│   ├── /research
│   │   ├── /research/[slug]               ← individual articles
│   │   └── /research/field-signals/[slug] ← Field Signals essays
│   │       └── /research/field-signals    ⚠️ BROKEN — no index page exists
│   │
│   ├── /rxd                               ← RXD Framework (in main nav)
│   │
│   ├── /learn
│   │   ├── /learn/rep
│   │   │   └── /learn/rep/curriculum
│   │   ├── /learn/rpdp
│   │   ├── /learn/rsp
│   │   └── → /robotics-literacy           ← linked from Learn page footer callout
│   │
│   ├── /connect
│   │
│   ├── /summit
│   │
│   └── /enterprise
│
├── /rxd                                    ← RXD Framework page — also in main nav (redirects: /href → /rxd, /hrx → /rxd)
├── /robots                                 ← Robot of the Week archive
│   └── /robots/[slug]                     ← individual robot profiles
├── /news/[slug]                            ← individual news articles
├── /search                                 ← Full-text search results (dynamic, ?q= param)
├── /access                                 ← Waitlist signup
├── /privacy
├── /terms
└── /ai-statement
```

---

## Navigation Inventory

### Main Navigation (header — all pages)

| Label | Route | Page exists? |
|---|---|---|
| Research | /research | ✅ |
| RXD Framework | /rxd | ✅ |
| Learn | /learn | ✅ |
| Connect | /connect | ✅ |
| Summit | /summit | ✅ |
| Enterprise | /enterprise | ✅ |
| Search (icon) | /search?q= | ✅ — inline animated input on desktop; form in mobile menu |

### Footer Navigation

| Label | Route | Page exists? |
|---|---|---|
| Research | /research | ✅ |
| Learn | /learn | ✅ |
| Access | /access | ✅ |
| Connect | /connect | ✅ |
| Summit | /summit | ✅ |
| REP | /learn/rep | ✅ |
| RPDP | /learn/rpdp | ✅ |
| RSP | /learn/rsp | ✅ |
| Privacy Policy | /privacy | ✅ |
| Terms of Use | /terms | ✅ |
| Fair Use of AI | /ai-statement | ✅ |
| LinkedIn | https://www.linkedin.com/company/therobotage/ | ✅ external |
| YouTube | # | ⚠️ PLACEHOLDER |
| Instagram | # | ⚠️ PLACEHOLDER |

---

## Broken Links

| Location | Broken href | Issue | Likely Fix |
|---|---|---|---|
| `InstrumentFeature.tsx` | `/research/ref#rubric` | Route `/research/ref` does not exist | `/rxd#rubric` |
| `FieldSignals` component | `/research/field-signals` | No index page at this route | Create index page or remove link |
| `/summit` — "Get Notified" button | *(none)* | Button has no href/action | Wire up to /access or a form |
| `/summit` — "Apply to Speak" button | *(none)* | Button has no href/action | Wire up to /connect or a form |
| Footer — YouTube icon | `#` | Placeholder, no real URL | Add YouTube channel URL |
| Footer — Instagram icon | `#` | Placeholder, no real URL | Add Instagram profile URL |

---

## Orphan Pages

Pages with no incoming links from the main navigation or any other in-site link:

| Route | How it's reached | Risk |
|---|---|---|
| `/rxd` | In main nav; also linked from `/learn/[credential]/curriculum` and `/research` | ✅ No longer an orphan |
| `/robotics-literacy` | Removed from main nav; linked from `/learn` page footer callout | Low — reachable via Learn |
| `/robots` | Not in main nav; only referenced from within the Research page robot archive section | Medium — hard to find |
| `/news/[slug]` | No `/news` index page; articles only surfaced via homepage grid and Research page | Medium — no browseable news archive |
| `/access` | Linked from CTAs on /robotics-literacy, /learn/[credential]; not in main nav | Low — reachable via CTAs |
| `/privacy` | Footer only | Low — expected pattern for legal |
| `/terms` | Footer only | Low — expected pattern for legal |
| `/ai-statement` | Footer only | Low — expected pattern for legal |

---

## Missing Pages (routes referenced but not implemented)

| Route | Referenced from | Notes |
|---|---|---|
| `/research/field-signals` | FieldSignals component "View full index" CTA | No directory index page; individual essays exist but are not browseable as a list |
| `/notify` | Certification component on homepage | Appears to be a placeholder CTA route for notification signup |

---

## External Links

| Destination | Context | Status |
|---|---|---|
| https://www.linkedin.com/company/therobotage/ | Footer, Connect page | ✅ real URL |
| https://learn.therobotage.com | /learn/[credential]/curriculum enrol CTA | ✅ real URL (external platform) |
| https://creativecommons.org/licenses/by-nc/4.0/ | Research footer, RXD page | ✅ real URL |
| /pdf/rxd-therobotage-v2.pdf | Research page, RXD page | Internal PDF — exists in /public/pdf/ ✅ |

---

## Dynamic Routes Summary

| Route pattern | Content source | Status |
|---|---|---|
| `/research/[slug]` | News/research markdown files | ✅ Active |
| `/research/field-signals/[slug]` | Field Signals markdown files | ✅ Active (4 essays published) |
| `/learn/[credential]` | Credential data (rep, rpdp, rsp) | ✅ Active |
| `/learn/[credential]/curriculum` | Curriculum data | ✅ Active (REP only) |
| `/robots/[slug]` | Robot profile markdown files | ✅ Active (2 profiles published) |
| `/news/[slug]` | News markdown files | ✅ Active (7 articles published) |
| `/search` | Full-text search — dynamic server route | ✅ Active |
