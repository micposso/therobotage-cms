# Robot Profile & RXD Score — Authoring Guide

## How the system works

Each robot profile on The Robot Age is powered by two markdown files:

| File | Location | Purpose |
|---|---|---|
| `{slug}.md` | `robots-profiles/` | All profile data + overview text |
| `{slug}.md` | `src/content/scores/` | RXD scores for all 6 dimensions |

**The slug must match exactly between both files.** `reachy-mini.md` in `robots-profiles/` requires `reachy-mini.md` in `src/content/scores/`. The profile page lives at `/robots/{slug}`.

To publish a new robot: create both files, drop in the images, and the page is live — no code changes required.

---

## Slug convention

Lowercase, hyphens for spaces, no punctuation. Derived from the robot's name.

```
Reachy Mini        → reachy-mini
Spot               → spot-boston-dynamics  (include brand if name is generic)
Unitree G1         → unitree-g1
```

---

## Profile file — `robots-profiles/{slug}.md`

All structured data lives in YAML frontmatter. The markdown body (everything after the closing `---`) becomes the **Overview** paragraph on the profile page.

### Frontmatter schema

```yaml
---
slug: reachy-mini
title: Reachy Mini
manufacturer: "Pollen Robotics / Hugging Face"
category: Robot Profile
type: Desktop Companion Robot
country: France
priceRange: "$299–$449"
yearIntroduced: 2025
autonomy: Platform-Configurable
industry: "Education / Research"
image: /images/robots/reachy-mini/hero.jpg
description: "One sentence — used in page metadata and the listing card."
deploymentBoxes:
  - label: Operational Context
    title: Where and how this robot works
    body: >-
      Describe the physical environment, shift patterns, interaction range,
      and workflow this robot is designed to support.
  - label: User Population
    title: Who interacts with this robot
    body: >-
      Describe the people who encounter this robot day-to-day — their role,
      technical familiarity, and what they need from the interaction.
  - label: Friction Points
    title: Where the experience breaks down
    body: >-
      Describe observed friction, edge cases, user workarounds, and failure
      modes. Capture the gap between intended and actual use.
  - label: Field Observations
    title: What we saw in practice
    body: >-
      Specific moments and behaviors noted during evaluation. This is where
      scores get grounded in real interactions.
gallery: []
---

Overview paragraph goes here. This is plain prose — 2–4 sentences covering
what the robot is, who makes it, what problem it solves, and why it matters
from a human experience perspective. Do not use markdown headings here.
```

### Field reference

| Field | Type | Notes |
|---|---|---|
| `slug` | string | URL-safe, lowercase, hyphens. Must match score file name. |
| `title` | string | Robot's display name |
| `manufacturer` | string | Company name(s) |
| `category` | string | Always `Robot Profile` |
| `type` | string | Robot class — e.g. `Autonomous Mobile Robot`, `Desktop Companion Robot`, `Humanoid` |
| `country` | string | Country of origin |
| `priceRange` | string | e.g. `$299–$449`, `$25K–$75K`, `< $10K` |
| `yearIntroduced` | number | Year first publicly available |
| `autonomy` | string | e.g. `Fully Autonomous`, `Supervised`, `Platform-Configurable`, `Multimodal` |
| `industry` | string | Primary deployment sector — e.g. `Warehouse`, `Healthcare`, `Education / Research` |
| `image` | string | Path to hero image in `public/`. Defaults to placeholder if omitted. |
| `description` | string | One sentence for SEO and listing card. |
| `deploymentBoxes` | array | Exactly 4 boxes (see schema above). |
| `gallery` | array | List of `{src, alt, caption}` objects. Use `gallery: []` if no images yet. |

### Gallery item format

```yaml
gallery:
  - src: /images/robots/reachy-mini/field-01.jpg
    alt: Reachy Mini on a researcher's desk
    caption: Operational context — Wireless version, desk deployment.
  - src: /images/robots/reachy-mini/interaction.jpg
    alt: User interacting with Reachy Mini during a conversation
    caption: Head tracking during close-range conversation.
```

### Images

Drop robot images into `public/images/robots/{slug}/`. Recommended files:
- `hero.jpg` — used in the page header (PageHero)
- `field-01.jpg` through `field-05.jpg` — gallery images

---

## Score file — `src/content/scores/{slug}.md`

Pure YAML frontmatter. No markdown body needed.

### Schema

```yaml
---
compositeScore: 3.17
tier: Functional
dimensions:
  # 1. Signal Clarity
  - score: 4
    summary: One sentence of evidence. What specifically was observed that supports this score.
  # 2. Spatial Legibility
  - score: 2
    summary: One sentence of evidence.
  # 3. Perceived Presence
  - score: 3
    summary: One sentence of evidence.
  # 4. Failure Transparency
  - score: 2
    summary: One sentence of evidence.
  # 5. Interaction Fit
  - score: 5
    summary: One sentence of evidence.
  # 6. Recovery Design
  - score: 3
    summary: One sentence of evidence.
---
```

### Composite score

Unweighted average of all 6 dimension scores, rounded to 2 decimal places.

```
(4 + 2 + 3 + 2 + 5 + 3) / 6 = 3.17
```

### Tier labels

| Score range | Tier |
|---|---|
| 4.5 – 5.0 | Benchmark |
| 3.5 – 4.4 | Capable |
| 2.5 – 3.4 | Functional |
| 1.5 – 2.4 | Developing |
| 1.0 – 1.4 | Insufficient |

---

## The 6 RXD Dimensions

### 1. Signal Clarity
Can the user understand what the robot is communicating?
Covers: LEDs, sounds, screen output, speech, movement-as-signal.

| Score | Meaning |
|---|---|
| 1 | Signals absent, ambiguous, or misleading |
| 2 | Signals exist but inconsistent or require training |
| 3 | Signals present but gaps exist — some states uncommunicated |
| 4 | Clear and consistent across most states |
| 5 | Immediate, unambiguous, contextually appropriate |

### 2. Spatial Legibility
Can the user predict where the robot will move?
Covers: path predictability, speed, proxemics, deceleration cues.

| Score | Meaning |
|---|---|
| 1 | Erratic — users routinely step aside defensively |
| 2 | Follows logic but cues are late — users surprised |
| 3 | Predictable in open space, breaks down near obstacles |
| 4 | Readable in most environments |
| 5 | Fully legible — speed, direction, proxemics communicated in advance |

### 3. Perceived Presence
Does the robot's voice, form, and aesthetic produce a coherent identity?
Covers: visual design, voice character, personality coherence.

| Score | Meaning |
|---|---|
| 1 | No coherent identity |
| 2 | Some identity elements contradict each other |
| 3 | Recognizable but thin — doesn't hold across all modes |
| 4 | Consistent and well-considered |
| 5 | Strong, unified identity users respond to and remember |

### 4. Failure Transparency
When something goes wrong, does the robot make the problem legible?
Covers: error states, stuck states, declined requests, handoff to humans.

| Score | Meaning |
|---|---|
| 1 | Failures silent or opaque — robot stops with no explanation |
| 2 | Signals something wrong but not what or what to do |
| 3 | Communicates failure type but in technical/non-actionable language |
| 4 | Clear, plain language — user has a path forward |
| 5 | Graceful, transparent, actionable — interaction doesn't collapse |

### 5. Interaction Fit
Does the interaction model match the context and the user's expectations?
Covers: modality, vocabulary, pacing, fit with physical and social context.

| Score | Meaning |
|---|---|
| 1 | Wrong modality, wrong vocabulary — requires users to learn a new paradigm |
| 2 | Partially appropriate but significant friction |
| 3 | Works for core tasks, breaks at edges |
| 4 | Fits well — minimal friction, occasional mismatch at margins |
| 5 | Feels natural — users don't notice the model |

### 6. Recovery Design
Can the user (or robot) get back on track after a breakdown?
Covers: escape hatches, retry mechanisms, clarity of path back to working state.

| Score | Meaning |
|---|---|
| 1 | No recovery — requires external intervention |
| 2 | Recovery possible but user must figure it out |
| 3 | Mechanism exists but hard to find or slow |
| 4 | Smooth and clearly guided |
| 5 | Designed-in — robot proactively offers the path back |

---

## Scoring process

1. Gather all available information about the robot — specs, deployment context, observed behavior, manufacturer documentation, user reports.
2. Score each of the 6 dimensions on a 1–5 whole-number scale.
3. Calculate composite: sum all 6 scores, divide by 6, round to 2 decimal places.
4. Assign tier from the table above.
5. Write a one-sentence evidence summary for each dimension — describe *what was observed* that supports the score.

**Score what users experience, not what was intended.** If error handling exists in theory but users routinely get confused, score the experienced reality.

**Use the full scale.** A 5 is rare — reserve it for experiences a practitioner would hold up as a benchmark. A 3 means "works but has notable gaps" — it is not a bad score.

---

## Complete example

### `robots-profiles/reachy-mini.md`

See the live file for the full example.

### `src/content/scores/reachy-mini.md`

```yaml
---
compositeScore: 3.0
tier: Functional
dimensions:
  # 1. Signal Clarity
  - score: 3
    summary: Head movement and antenna animation communicate emotional state, but signal vocabulary is entirely developer-defined — no standardized cues exist out of the box.
  # 2. Spatial Legibility
  - score: 4
    summary: Constrained desktop form factor makes movement predictable. Head tracking and base rotation follow clear directional logic.
  # 3. Perceived Presence
  - score: 3
    summary: Charming, coherent physical design with readable expressiveness. Behavioral identity is blank-slate by design.
  # 4. Failure Transparency
  - score: 2
    summary: Platform-level failures produce silence or stillness with no user-facing explanation.
  # 5. Interaction Fit
  - score: 4
    summary: Precisely matched to developers and researchers working in Python, ROS2, and Hugging Face. Fails hard for non-technical users, by design.
  # 6. Recovery Design
  - score: 2
    summary: Recovery is SSH and terminal-only. No path for non-technical users encountering failures.
---
```
