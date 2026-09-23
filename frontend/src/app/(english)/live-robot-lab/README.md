# Live Robot Lab

Route: `/live-robot-lab`. Uses the existing shared Nav/Footer, global design tokens,
CSS modules, IBM Plex fonts, local Next Image assets, and Resend server-action pattern.
`Nav` accepts a page-specific CTA; other pages retain their current sign-in CTA.

## Editing

- `content.ts`: repeatable program content, pricing, FAQ, verified metrics and testimonials.
- `Sections.tsx`: server-rendered sections, media placeholders, and anchor CTAs.
- `LiveRobotLabRequestForm.tsx`: client validation, pending/error/success states and focus handling.
- `../../lib/liveRobotLab.ts`: shared field definitions and server/client validation.
- `../actions/sendLiveRobotLabRequest.ts`: isolated Resend submission handler.

Pricing CTAs all scroll to the request form. Organization type is intentionally chosen
by the visitor; corporate/organization pricing can apply to companies or nonprofits.
The two-hour agenda is the standard program; corporate formats can run 90–120 minutes
and event formats are quoted separately. NYC transport is included; metro-area/travel
details should be confirmed in the quote.

## Assets to supply

Existing Go2 product imagery is used for the hero and robot card; the Reachy card uses
the existing local photo. A new hero image is optional, not required.

- Captioned Live Robot Lab video (replace the 16:9 figure with a titled embed or video with controls).
- Approved workshop photography (replace the labeled placeholder).
- Verified metrics and approved, attributed testimonials (replace null content entries).

No statistics, participant quotations, or workshop images have been fabricated.

## Email delivery

No new service or credentials are required. Deployment must have the existing
`RESEND_API_KEY` and a verified `EMAIL_FROM_HELLO`. The destination is the existing
contact-form organizer address, `micposso@gmail.com`; the requester's validated work
email is set as Reply-To. All ten fields and the consent context are included.
The form returns success only after Resend accepts the organizer notification.
Acceptance is not a guarantee of inbox delivery. Missing configuration, rejection,
and network failure produce an error and preserve the user's input.

Tests substitute Resend and abort browser submissions; they do not send email.
Before launch, verify delivery with an authorized end-to-end request in the deployment.

## Verification

```sh
node ../node_modules/prettier/bin/prettier.cjs --write --single-quote --no-semi src/app/live-robot-lab src/lib/liveRobotLab.ts src/app/actions/sendLiveRobotLabRequest.ts scripts/live-robot-lab.test.mjs
npm run lint
npm run typecheck
node --test scripts/live-robot-lab.test.mjs
npm run build
```

Browser checks cover 320, 375, 768, 1024 and 1440px, anchor destinations and fixed-header
offsets, one H1, local image loading, native FAQ keyboard activation, field errors,
error-summary focus, pending state, failed submission and retained input.
