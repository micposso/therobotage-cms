# Enterprise Academy implementation

The enterprise page uses the existing PageHero brand-image carousel, navigation, footer, MediaImage, Fairview display font, IBM Plex Sans body font, brand color variables, and FoundingCohort CTA styling.

## Current page refinement

The page now has five main sections after the hero: deployment value, six industry use cases, a consolidated Academy delivery model, a measurable paid pilot, and the inquiry form. Repeated audience, capability and process sections have been consolidated. Pilot metrics cover training effort, practical workforce readiness and customer satisfaction without unsupported percentage claims. Industry cards reuse Robot Literacy's existing card styling. The headline has two explicit lines on desktop and wraps naturally on smaller screens.

Industrial, Hospitality, Healthcare, Entertainment, Security and Local Government each have an illustrated use case. The separate humanoid/inspection section was removed; the humanoid appears in Hospitality and municipal quadruped inspection appears in Local Government. Three additional optimized images are saved under the same public image directory and published through R2. English and Spanish copy, image descriptions and CTA text are synchronized. Header and body font sizes use the existing site scale.

## Files and components

- `frontend/src/app/(english)/enterprise/page.tsx`: ten-section Academy page, shared hero, editorial environments, metadata and CTA anchors.
- `enterprise.module.css`: responsive layouts using existing brand tokens.
- `content.ts`: English Academy copy and image descriptions.
- `EnterpriseForm.tsx`: localized eight-field inquiry form, pending/error/success states and accessible validation.
- `frontend/src/lib/enterpriseRequest.ts`: shared client/server validation and allowed options.
- `frontend/src/app/actions/sendEnterpriseRequest.ts`: existing Resend integration extended to retain all eight fields, escape submitted content, reject honeypots and report delivery failures.
- `frontend/src/lib/i18n/enterprise-es.json`, `messages.ts`, `content.ts`, and the localized catch-all route: Spanish content, metadata, form text and language switching.
- `HomepagePopup.tsx`: suppress the competing whitepaper popup on enterprise routes.
- `frontend/scripts/enterprise.test.mjs`: validation, notification and Spanish coverage tests.
- `frontend/src/lib/image-assets.json` and `output/r2-image-inventory.json`: verified R2 assets.

## Images

Seven original AI-generated conceptual workplace illustrations are saved as optimized WebP files in `frontend/public/images/enterprise/`: restaurant onboarding, factory training, senior living, multilingual learning, everyday adoption, humanoid onboarding, and basement quadruped inspection. Originals are preserved locally in `output/enterprise-images/originals/`. Prompts are in `docs/enterprise-image-prompts.md`. All seven assets were published and verified through the existing R2 publisher. The page labels them as conceptual illustrations rather than customer engagements.

## Validation and limits

TypeScript and targeted ESLint checks pass. Five automated tests pass, including all submitted fields reaching the existing notification and provider failure handling. Browser checks cover English and Spanish at 390, 768 and 1440 pixels with one H1 and no horizontal overflow. Hero and new scenario crops were visually inspected. Form required-field errors, internal CTA anchors, supporting links and reduced-motion scroll behavior were checked.

The production build passes (516 generated pages). Email delivery is mocked in tests; no live inquiry was sent. The page code has not been deployed. No new dependencies, CMS, form service or image host were introduced.
