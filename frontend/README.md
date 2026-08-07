This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Feature: "What Robot Are You?" quiz

A lead-gen quiz at `/what-robot-are-you`. Users answer 6 questions, get matched to
one of 9 real robots via a trait-vector engine, and receive a shareable robot card
(LinkedIn share, PNG download, or email).

**Files**
- `src/lib/quizRobots.ts` — the 9-robot dataset (typed, verified specs, trait
  vectors) and the `statBars()` display-stat derivation. Add a robot here to make
  it matchable; the questions don't need to change.
- `src/lib/matching.ts` — the 5 trait axes, the 6 questions with per-option trait
  deltas, and `matchRobot()` (lowest Euclidean distance, ties break by roster order).
- `src/app/what-robot-are-you/page.tsx` — server shell (Nav / hero / quiz / footer).
- `src/app/what-robot-are-you/Quiz.tsx` — `'use client'` question flow + all-robots gallery.
- `src/app/what-robot-are-you/ResultView.tsx` — `'use client'` shared result: the
  `<canvas>` card (drawn directly, no DOM-to-image dep — same approach as the RXD
  Scorecard), LinkedIn share, PNG/clipboard export, and the email capture form.
- `src/app/what-robot-are-you/[slug]/page.tsx` — shareable per-robot result page with
  dynamic OpenGraph metadata; `generateStaticParams` pre-renders all 9.
- `src/app/what-robot-are-you/[slug]/opengraph-image.tsx` — 1200×630 `ImageResponse`
  that server-renders the card so LinkedIn unfurls a rich preview (the viral engine).
- `src/app/api/robot-card/route.ts` — `POST { email, robotSlug, consent }` → sends the
  branded card via Resend. Soft gate only (the result is always shown first).

**Environment variables**
- `RESEND_API_KEY` — **required** for the email-me-my-card route (already used site-wide).
- `NEXT_PUBLIC_SITE_URL` — canonical origin for share/OG/email links (defaults to
  `https://therobotage.com`; set to `http://localhost:3000` locally).
- `EMAIL_FROM_RESEARCH` — optional From address (defaults to `onboarding@resend.dev`
  until the `therobotage.com` domain is verified in Resend).
- Newsletter opt-in is a documented **TODO** in `route.ts` — wire the consented email
  to a Resend audience / CRM there (e.g. `RESEND_AUDIENCE_ID`).

**Robot photos** — drop images at `public/robots/<slug>.jpg` (e.g. `public/robots/atlas.jpg`).
Slugs: `unitree-g1`, `optimus`, `figure-03`, `atlas`, `unitree-go2`, `reachy-mini`,
`neo`, `digit`, `stretch`. Until a photo exists the card and OG image show a branded
placeholder — no broken images.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
