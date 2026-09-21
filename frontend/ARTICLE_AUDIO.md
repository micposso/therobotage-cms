# Article narration pilot

The first pilot article is the latest file under `news/` (currently `military-field-robots-china-ukraine-west`). Audio is generated at publish time, stored in the public Supabase Storage bucket `article-audio`, and shown on article pages only when `SITE_NOINDEX=true` (the staging setting). Production pages do not show the player.

## Staging setup

Keep these values in `frontend/.env.local`, `frontend/.env`, a repo-root `.env.local` or `.env`, or the CI environment used to publish. Never commit them or put them in the deployed frontend:

- `OPENAI_API_KEY` — speech generation.
- `SUPABASE_SERVICE_ROLE_KEY` — Storage upload and bucket creation.
- `NEXT_PUBLIC_SUPABASE_URL` — the staging Supabase project URL.

Set `SITE_NOINDEX=true` and `NEXT_PUBLIC_SUPABASE_URL` in the staging frontend build environment. The deployed frontend needs neither secret key. The script requires `--project-ref` to match the project ref in the Supabase URL before it will make paid API calls or upload anything.

## Generate the pilot

Run from `frontend/`:

```sh
npm run audio:dry -- --latest --show-text
npm run audio:publish -- --latest --project-ref YOUR_STAGING_PROJECT_REF
```

Review the spoken text represented by the dry run and listen to the resulting MP3 before promoting the change. The script creates the public bucket if absent, uploads a content-addressed MP3, verifies the public response, then writes `news/audio-manifest.json`. Commit that manifest with the code so the staging build knows which article has approved audio. Re-running for unchanged content is safe and checks the existing file instead of regenerating it.

For a specific article, replace `--latest` with `--slug article-slug`. An edit to the article Markdown changes its source hash; the player disappears until narration is regenerated and the manifest is updated. On failure, the article remains readable without audio.

## Verification

1. Run `npm run audio:test`, `npm run typecheck`, and `npm run build` in `frontend/`.
2. On staging, open `/news/military-field-robots-china-ukraine-west` and confirm the player appears between the hero and article text, identifies the narration as AI-generated, plays, pauses, and seeks on desktop and mobile.
3. Check the same page on production: the pilot player must not appear.
4. Confirm that the public MP3 URL returns `audio/mpeg` and supports a range request before sharing the staging page.

The MP3 object path includes hashes of the article Markdown and voice settings. This makes changed narration a new URL, avoiding stale browser caches. Old objects can be cleaned up separately after the pilot is approved.
