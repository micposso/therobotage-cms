---
name: publish-article
description: End-to-end article publishing for The Robot Age, in one skill. Give it a research subject and it researches the topic, writes the article, generates the header + thumbnail images with the Black Forest Labs (FLUX) API, and writes a LinkedIn promo post — saving every artifact in the right place. Use when the user gives a topic and wants the full article produced and promoted — e.g. "publish an article about warehouse robots", "research and write a piece on the new HRI study then promote it", "run the full pipeline for X". Also handles single steps: regenerating images or writing the LinkedIn post for an existing article.
---

# Publish article

One self-contained pipeline: **research -> write -> images -> LinkedIn post**. The subject is whatever the user passed as the argument or in their message; if none is given, ask for it first.

Run all commands from the `frontend/` directory. There is exactly one human stop: draft approval (Stage 2). Everything else runs straight through.

> **Single-step use:** if the article already exists and the user only wants images, jump to Stage 3; if they only want the LinkedIn post, jump to Stage 4. Identify the target article as the one they name, or the most recently modified `news/*.md` (excluding `_template.md`).

---

## Stage 0 — Read the references (always first)

Before writing anything, read:
1. `VOICE_AND_TONE.md` — the canonical voice guide, in full.
2. `news/_template.md` — frontmatter schema and markdown structure.
3. One example: `news/automation-anxiety-vs-readiness.md` (RESEARCH) or `news/the-familiar-hri-design-brief.md` (OPINION).

---

## Stage 1 — Research the subject

Gather facts before drafting (the article must be evidence-grounded and must not contain invented statistics).

- Run focused `WebSearch` queries on the subject for specific, verifiable facts: real numbers, named companies/robots/people, dates, deployments, study findings, primary sources.
- For a large or contested topic, consider invoking the `deep-research` skill for a cited report instead.
- Distill findings into a short fact sheet (bullets with sources). Only carry forward what the search actually supports.

Confirm the category with the user if ambiguous: `NEWS`, `RESEARCH`, `OPINION`, `SUMMIT`, `CERTIFICATION` (default `NEWS`). Author defaults to `The Robot Age Editorial Team`.

---

## Stage 2 — Write the article

Draft the full article following the voice guide. Key rules:

### Structure
- **Opening paragraph:** state the thesis in the first sentence. No build-up, no "In today's world". The first sentence carries the core claim.
- **Body:** 4–6 paragraphs, ~30–50 words each, each opening with its own sub-claim. Use `##` subheadings for OPINION and longer RESEARCH pieces; omit for short NEWS items.
- **Closing:** a single sentence that reframes the thesis or implies a practical next step. No "Conclusion" heading.

### Voice (see VOICE_AND_TONE.md for full detail)
Direct and evidence-grounded. Cite specific numbers, industries, roles, named deployments — only those the research supports. Anti-hype: reject both anxiety and utopia framings. Write for designers, product managers, UX strategists, operations leads — do not explain what a robot is. American English. No false contrasts ("this isn't X, it's Y"). No corporate filler ("leverage", "ecosystem", "synergy", "transformative", "cutting-edge"). Em dash `—` for elaboration; `>` for pull quotes.

### Fields
- **excerpt:** 1–2 sentences, under 160 characters — the most compelling condensation of the argument (card preview + SEO).
- **slug:** derived from the title, lowercase, hyphens, no punctuation, max 6–7 words.
- **date:** today's date, `Month Day, Year` format.

### Frontmatter schema
```yaml
---
slug: your-article-slug
title: "Your Article Headline Here"
category: NEWS
date: Month Day, Year
excerpt: A one or two sentence summary. Under 160 characters.
headerImage: /images/news/your-article-header.jpg
thumbnailImage: /images/news/your-article-thumb.jpg
author: The Robot Age Editorial Team
---
```
Leave the two image paths as `/images/news/{slug}-header.jpg` and `/images/news/{slug}-thumb.jpg` — Stage 3 fills them with real files.

### Approval gate
Present the full draft (frontmatter + body) to the user in a markdown code block, with a brief note on any framing choices. **Stop. Do not save until the user approves** (in full or with revisions). Apply revisions, then write the file to `news/{slug}.md` with the Write tool.

**Checkpoint:** confirm `news/{slug}.md` exists and capture the `slug`. Stage 3 reads this file.

### How the article reaches the homepage grid (do NOT hand-edit it)
The homepage news grid is **file-driven** — saving `news/{slug}.md` is all that is required to add the article to it. The flow: `src/lib/news.ts` `getAllNewsArticles()` auto-discovers every `news/*.md` file (excluding `_`-prefixed), sorts by `date` descending, and `src/app/page.tsx` feeds that list to `<HomeNewsSection>`. The newest-dated article appears first. The same source also powers `/news/{slug}`, search, and the sitemap.

Therefore:
- **Do not** edit `ArticleGrid`, `HomeNewsSection`, `LatestNewsSection`, or any component to register the article — that breaks the pattern.
- **Do not** add the article to `src/lib/articles.ts`. That file is a separate legacy registry used only by the `/research/[slug]` route and the sitemap, not the homepage news grid.
- The only requirements for the card to render correctly are valid frontmatter fields: `slug`, `title`, `category`, `date` (in `Month Day, Year` form so date-sorting works), `excerpt`, and `thumbnailImage` (the card image).

> All `.ts`/`.tsx`/`.md` content must use straight quotes only — curly quotes break the Turbopack build.

---

## Stage 3 — Generate the images

Prereq: `BFL_API_KEY` must be set in `frontend/.env.local`. If the bundled script reports it missing, pause and tell the user to add it (key at https://dashboard.bfl.ai/).

### 3a. Visual research
Run 1–3 `WebSearch` queries on the subject's appearance (the real robot's form factor, the setting, the event) to ground the art direction in concrete visual nouns: subject, setting, lighting, composition. You are gathering reference for a description, not downloading images.

### 3b. Two FLUX prompts (on-brand)
Append this style suffix to every prompt:

> Editorial photography, warm muted earth-tone palette — sand cream (#ecd9d2), muted brick red (#9b5152), olive green (#4d6247), tan gold (#b7925b), deep near-black (#0D0D0D) — with a single warm orange accent (#e85d24). Natural directional light, shallow depth of field, grounded and realistic, documentary feel. No text, no logos, no watermarks. Anti-hype: no glowing blue holograms, no sci-fi neon, no cyborg clichés.

- **Header** — wide cinematic hero, subject in its environment, with visual negative space (the title overlays the page); avoid busy centers.
- **Thumbnail/preview** — tighter, single clear focal subject that reads at small card size; same world as the header but a different composition, not a crop of the same shot.

Keep each to 2–4 sentences of concrete description + the suffix.

### 3c. Generate both with the bundled script
File names derive from the slug:
```bash
node .claude/skills/publish-article/bfl-generate.mjs \
  --prompt "HEADER PROMPT HERE" \
  --out "public/images/news/{slug}-header.jpg" \
  --width 1344 --height 768

node .claude/skills/publish-article/bfl-generate.mjs \
  --prompt "THUMBNAIL PROMPT HERE" \
  --out "public/images/news/{slug}-thumb.jpg" \
  --width 1024 --height 576
```
The script submits, polls, and downloads the JPEG. On content-moderation rejection it exits with a message — soften the prompt and retry. Width/height must be multiples of 32 between 256 and 1440. Default model `flux-pro-1.1`; pass `--model flux-pro-1.1-ultra` for a higher-quality header if requested.

### 3d. Wire the paths
Ensure the frontmatter reads (use Edit if the article already had placeholder/old values):
```yaml
headerImage: /images/news/{slug}-header.jpg
thumbnailImage: /images/news/{slug}-thumb.jpg
```
(Public-path form: `/images/news/...`, no `public/` prefix.) Do not overwrite an existing article's images without confirming, unless the user asked to refresh.

---

## Stage 4 — Write the LinkedIn post

Promote the article and drive readers to `https://therobotage.com/news/{slug}`.

### Structure
1. **Impact statement (para 1):** a single punchy line stating the most striking fact/claim. No warm-up — this is the scroll-stopper.
2. **Explanation (paras 2–3):** what is happening and why it matters to the reader, grounded in the article's specific evidence. No invented numbers.
3. **Conclusion (final para):** reframe the stakes or imply a next step, ending with the CTA:
   `Read the full piece on The Robot Age: https://therobotage.com/news/{slug}`

### Hard constraints
- **800–1500 characters total** (including CTA and hashtags). Count and state the final character count; revise until it fits.
- **3–4 paragraphs**, separated by blank lines.
- **Plain text only** — no markdown bold/headings/bullets (LinkedIn ignores them). Straight quotes only. At most one emoji, only if it fits; default none.
- **4–6 hashtags** on their own line after the CTA: one or two broad (#Robotics, #AI) plus two to four specific (#HumanoidRobots, #ServiceRobots, #HRI, #ProductDesign). CamelCase, no spaces/punctuation inside a tag.

### Save
Present the post in a plain code block with the character count noted. Then save it to `social/{slug}-linkedin.txt` (create `social/` if needed) with the Write tool.

---

## Stage 5 — Ship to staging (git)

Branch the article, merge it into `DEV`, and push so it deploys to the Railway staging site for preview. **Do this only after the article, images, and LinkedIn post are all complete.** Run from the repo root (`C:\dev\therobotage-cms`), not `frontend/`.

The integration branch is **`DEV`** (uppercase — matches `origin/DEV`). Article branches follow the convention `article/{slug}` (precedent: `article/nasa-competition`).

### Steps
1. Make `DEV` current and up to date:
   ```bash
   git checkout DEV && git pull origin DEV
   ```
2. Branch off `DEV`:
   ```bash
   git checkout -b article/{slug}
   ```
3. **Stage only this article's artifacts — never `git add .` / `-A`.** List the exact paths:
   ```bash
   git add frontend/news/{slug}.md \
           frontend/public/images/news/{slug}-header.jpg \
           frontend/public/images/news/{slug}-thumb.jpg \
           frontend/social/{slug}-linkedin.txt
   ```
   Confirm `git status --short` shows only those four as staged (`A`). Do **not** commit unrelated working-tree changes (e.g. `settings.local.json`, `next-env.d.ts`) or the skill's own files.
4. Commit (use separate `-m` flags — this is the Bash tool, not PowerShell; do not use `@'...'@` here-strings):
   ```bash
   git commit -m "feat(news): add {slug} article" \
              -m "<one-line description>" \
              -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
   ```
5. Merge into `DEV` and push (push triggers the Railway staging deploy). Also push the article branch to match the remote convention:
   ```bash
   git checkout DEV
   git merge --no-ff article/{slug} -m "Merge article/{slug} into DEV"
   git push origin DEV
   git push -u origin article/{slug}
   ```

### Guardrails
- **Never commit `frontend/.env.local`** — it holds `BFL_API_KEY` and is gitignored; keep it that way.
- The user asked for this git flow, so it is authorized — but still stage explicit paths only, and report the pushed commit range.
- If a merge conflict or non-fast-forward push occurs, stop and surface it rather than forcing.

---

## Stage 6 — Final summary

Report every artifact as a checklist:
- Article: `news/{slug}.md` (live at `/news/{slug}`)
- Images: `public/images/news/{slug}-header.jpg`, `public/images/news/{slug}-thumb.jpg`
- LinkedIn post: `social/{slug}-linkedin.txt`
- Shipped: branch `article/{slug}` merged into `DEV` and pushed (note the commit range) — previewable on the Railway staging site shortly.

Note the article and images appear automatically on the homepage and article page (the grid is file-driven — see Stage 2) — no code changes needed. Offer to revise any single artifact without rerunning the whole pipeline.
