# Website image storage

- Store all new or replacement website images in the existing Cloudflare R2 bucket. This includes images generated during development.
- Save a local source under `frontend/public/` first, then run `node scripts/publish-images.mjs --publish` from `frontend`. Credentials belong only in ignored `frontend/.env.local`; never print or commit them.
- The publisher verifies every public object before updating `frontend/src/lib/image-assets.json`. Commit this public URL manifest with the consuming code. Do not wire an unverified remote URL into a page.
- Use `@/components/MediaImage` for rendered site images and `imageUrl` from `@/lib/image-assets` for metadata or other URL consumers. For static imports, preserve dimensions and blur metadata with `imageAsset(publicPath, importedImage)`.
- Keep images below the fold lazy-loaded with responsive `sizes`. Only above-the-fold hero/LCP imagery should load eagerly. Preserve image dimensions or aspect ratios to prevent layout shifts.
- Do not delete local source images or existing R2 objects as part of a normal publish. Hashed filenames prevent overwriting previous versions.

# RXD research

- For robot eligibility research, RXD evaluation drafts, comparisons or reassessment, use `rxd-robot-evaluator/SKILL.md`.
- Canonical types and validation live in `frontend/src/lib/rxd/schema.ts`; generate the skill JSON schemas from that source. Never maintain competing schemas.
- All current protocols are drafts. Do not generate or publish new real RXD scores until human-approved protocols and scoring anchors exist. Preserve historical profile and score markdown.
- Research outputs belong in versioned `output/<robot-id>/v<version>/` drafts. The skill never publishes automatically.
