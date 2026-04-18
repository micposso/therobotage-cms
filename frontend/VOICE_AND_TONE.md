# The Robot Age — Voice & Tone

> **Purpose.** This file is the single source of truth for copy decisions on The Robot Age frontend. It is written to be consumed by a content-writing agent as well as by human writers. Every rule is derived from copy already published on the site, with file references. Where existing copy violates a rule, it is flagged in section 8.

---

## Table of Contents

1. [Who the reader is](#1-who-the-reader-is)
2. [Voice characteristics — what the writing IS](#2-voice-characteristics--what-the-writing-is)
3. [Anti-patterns — what the writing is NOT](#3-anti-patterns--what-the-writing-is-not)
4. [Sentence and paragraph length norms](#4-sentence-and-paragraph-length-norms)
5. [Copy hierarchy — headlines, subtitles, body, CTAs](#5-copy-hierarchy--headlines-subtitles-body-ctas)
6. [Vocabulary — preferred terms and words to avoid](#6-vocabulary--preferred-terms-and-words-to-avoid)
7. [Strong copy examples](#7-strong-copy-examples)
8. [Weak and inconsistent copy that should be revised](#8-weak-and-inconsistent-copy-that-should-be-revised)

---

## 1. Who the reader is

The Robot Age is written for **designers, product managers, UX strategists, operations leads, and business leaders** who work in or adjacent to environments where robots are already deployed. They are smart, professionally experienced, and non-engineers — the people who make decisions about, design around, or work alongside robotic systems, but who did not build them.

Write for this person at their level. Do not explain what a robot is. Do not reassure them that robotics is approachable — show them it is, through the specificity and confidence of the writing itself.

**Three audience segments** appear across the site, each with slightly different concerns:

| Segment | Primary concern | Where they appear |
|---|---|---|
| Individual learner | Career relevance; concrete, transferable skills | Learn, FoundingCohort, credential pages |
| Organizational buyer | Risk, readiness, ROI, change management | Enterprise |
| Community member | Peer exchange; practitioner-to-practitioner credibility | Summit, Connect |

When writing for a specific page, identify which segment is primary and tighten vocabulary accordingly.

---

## 2. Voice characteristics — what the writing IS

### Direct

State the point first, without setup. The very first word of a section should carry weight.

> "Most robot deployments fail not because the robot breaks — but because the humans around it weren't ready." *(articles.ts, article 1)*
> "Robots are arriving faster than the training." *(enterprise/page.tsx, WHY_CARDS[0].title)*

Not: "When we think about robot deployments and what leads to their success or failure, one important factor that often gets overlooked is..."

### Specific about audience

Always name the actual person rather than a generic category. "Product designers, UX strategists, and business leaders" not "professionals" or "organizations" or "teams."

> "The REP credential is built for product designers, UX strategists, and business leaders who shape the spaces, systems, and decisions where humans and robots meet." *(Certification.js)*
> "For UX researchers and service designers studying how people behave around robots." *(certifications.ts, RXR description)*

### Confident, not boastful

State facts plainly. Do not qualify claims with "we think" or "we believe." Do not inflate them with "revolutionary" or "world-class."

> "Deployment readiness starts with people." *(enterprise/page.tsx, PageHero title)*
> "Automation anxiety is largely a design failure." *(articles.ts, article 4)*

### Anti-hype

The site takes a considered, anti-utopian stance toward robotics. It rejects both anxiety narratives (robots will destroy jobs) and hype narratives (robots will fix everything). The writing reflects this by grounding every claim in observed behaviour, specific deployment contexts, and practical constraints.

> "We are not interested in demos, product announcements, or predictions about what robots will do in 2040. We want honest accounts of what is happening now — what worked, what didn't, and what you wish you had known." *(articles.ts, article 3, Summit speaker brief)*
> "A one-day gathering for product designers, UX strategists, and business leaders navigating the age of embodied AI. Four tracks. Real robots. No hype." *(Summit.js)*

### Precise about the thing being described

Module descriptions and credential overviews name specific skills, not topics. The reader should be able to tell exactly what they will be able to do, not just what subject area will be covered.

> "Proximity, gaze, gesture — how humans and robots read each other in physical space, and what goes wrong when the signals fail." *(certifications.ts, module 1.2)*
> "The robot stopped. No one knows why. This module covers failure mode design — what the system communicates, to whom, and how." *(certifications.ts, module 2.3)*

Not: "An introduction to error states in robotic systems."

### Evidence-grounded

Research articles cite sources and numbers. Marketing copy is grounded in real-world contexts: specific industries, specific roles, specific failure modes.

> "Developed through fieldwork across logistics, healthcare, and hospitality environments..." *(articles.ts, article 1)*
> "A survey of 1,400 workers across manufacturing, logistics, and healthcare found..." *(articles.ts, article 4)*
> "A mid-sized logistics facility in Columbus, Ohio has become the first workplace to earn a collective Robot Age Practitioner designation..." *(articles.ts, article 5)*

### Reassuring through specificity, not reassurance

The site never says "don't worry" or "it's easier than you think." It reassures by being specific about what is and isn't required. "No engineering background required" is not apology — it is constraint specification. The phrase appears across multiple pages and is never elaborated or softened.

> "No code. No engineering prerequisites." *(certifications.ts, module 1.1)*
> "No engineering background. No prerequisites. Just the credential the field is missing." *(FoundingCohort.tsx)*

---

## 3. Anti-patterns — what the writing is NOT

### No false contrasts

The "this is not X, this is Y" construction is forbidden. It produces filler, delays the point, and is the most common marker of generic marketing copy.

❌ "This isn't a course. It's a credential."  
❌ "We're not here to sell you hype. We're here to help you do the work."  
✅ State what it is. The contrast is implied.

### No build-up

Do not warm up to the point. Every opening sentence of a section, paragraph, or CTA should contain real information.

❌ "In today's rapidly evolving world, robotics is changing every industry."  
❌ "As organizations look to integrate robotic systems into their operations..."  
✅ "Most deployment failures trace back to the humans around the robot, not the robot itself." *(enterprise/page.tsx)*

### No corporate abstraction

Do not use words that describe categories rather than things. The reader can tell when a sentence could apply to any company in any industry.

Banned: *solutions, ecosystem, leverage (verb), synergy, best-in-class, cutting-edge, innovative, transformative, stakeholders (prefer the actual role: "operations leads"), utilize (use "use"), optimize (use "improve" or name the specific thing being improved).*

### No vague outcomes

Outcome lists, benefit statements, and module descriptions must name what the reader will specifically be able to do, not what subject they will have been exposed to.

❌ "Gain an understanding of human-robot interaction"  
✅ "Identify the key moments where human-robot interaction is most likely to break down" *(certifications.ts)*

### No over-qualification

Do not hedge a claim that is supportable. "Research suggests that X may be related to Y" — if you have evidence, state it.

❌ "Our approach can help teams develop frameworks that may improve deployment outcomes."  
✅ "Early pilots using the HRF showed a 34% reduction in escalation events during the first 90 days of deployment." *(articles.ts)*

### No pity for the reader

Do not position the reader as someone who needs rescuing ("if you've ever felt overwhelmed by...") or who lacks capability. Write to someone competent who has a specific gap to close.

---

## 4. Sentence and paragraph length norms

### Page hero titles

3–8 words. Fragment or short complete sentence. Always ends with a period, even on fragments. Present tense or present-continuous.

| Page | Title |
|---|---|
| Learn | "Built for the people robots work beside." |
| Research | "What we're learning." |
| Enterprise | "Deployment readiness starts with people." |
| Summit | "Where the conversation happens." |
| Access | "Be first in." |
| Connect | "Let's talk." |

No page hero title is a question. None exceeds eight words.

### Page hero subtitles

One to two sentences, 20–40 words. Usually contains one em-dash elaboration. Frequently ends with a short grounding clause — a specific fact, constraint, or qualifier — that closes any abstraction opened in the sentence.

> "Original research, field observations, and critical perspectives on the human side of robotics — published for the people designing what comes next." *(research/page.tsx)* — 28 words, ends with audience specificity.

> "Four credentials for designers, strategists, and leaders who need to work confidently in a world where robots are already deployed. No engineering background required." *(learn/page.tsx)* — two sentences; the second is a 4-word constraint statement.

### Section body copy

2–4 sentences per paragraph. 20–50 words per paragraph. In articles, the opening sentence of each paragraph carries the thesis of that paragraph — do not bury the point.

### Section subheads / card titles

4–10 words. Noun phrase or short declarative sentence. Specific enough that they could not appear on a different website without sounding out of place.

> "Robots are arriving faster than the training." — 7 words, immediately clear who this is for.  
> "Non-engineering staff carry the risk." — 6 words, names the specific person, names the specific problem.

### Eyebrow labels

1–4 words. Sentence case (not Title Case unless it is a proper name). Used as a category or context anchor, not as a teaser.

> "Flagship Certification", "Latest", "What you'll walk away with", "Credential Family", "New York City — Fall 2026"

### CTA labels

2–5 words. Imperative verb phrase. Do not use "Click here", "Learn more", or "Find out more." Name what happens when you act: "Reserve Your Seat", "Get your REP credential", "Apply to Speak."

### Article body

Articles are the most developed copy on the site. Each article:
- Opens with a thesis statement in the first sentence
- Uses 4–6 paragraphs of 30–50 words each
- Grounds claims in specific data points, industry contexts, or named deployments
- Closes with a sentence that is either a call to action, a reframing of the opening thesis, or a statement that extends the reader's thinking

> "The hardest skill in a robotic workplace is knowing when to override the machine. That is not a technical skill. It is a human one." *(articles.ts, article 6)* — three short sentences, each shorter than the last; the closing rhythm is deliberate.

---

## 5. Copy hierarchy — headlines, subtitles, body, CTAs

### Page hero

The title is the single claim of the page. The subtitle unpacks it with one additional layer of specificity — audience, context, or constraint. Do not repeat the title's idea in the subtitle. Extend it.

| Element | Job | Length |
|---|---|---|
| `eyebrow` | Context anchor — category, date, or section name | 1–4 words |
| `title` | The claim | 3–8 words |
| `subtitle` | One layer deeper — audience, constraint, or context | 20–40 words |

**The title should be understandable without the subtitle.** The subtitle should be unnecessary without the title.

### Section structure

Eyebrow → headline → body copy or list. The eyebrow orients. The headline claims. The body substantiates or enumerates.

Do not write a headline that simply labels the section ("About Us", "Our Approach"). The headline should make a claim that the body copy supports.

> Eyebrow: "Why this matters" → Headline: implied (no headline here; the WHY_CARDS are the content) *(enterprise/page.tsx)*

The WHY_CARDS pattern is notable: three short card titles that each make a claim, followed by 1–2 sentences of support. This is the site's most effective body-copy pattern.

### Calls to action

**Pattern A — filled button (transactional):** Verb + specific noun. Used for checkout, waitlist, form submit.  
> "Reserve Your Seat →", "Join the Waitlist", "Request a briefing."

**Pattern B — underline text link (navigational):** Verb phrase naming the destination or action.  
> "Get your REP credential", "Explore the Full Curriculum", "View All News"

The arrow character `→` is used on Pattern A CTAs and some Pattern B links. It is placed directly after the text with no space before `→` and one space after in context.

**Note on periods in CTAs:** "Request a briefing." ends with a period. This is intentional — it mirrors the hero title punctuation pattern and makes the CTA read as a complete sentence / imperative statement rather than a label. It is used sparingly: only when the CTA is a sentence-length imperative, not a 2-word button label.

---

## 6. Vocabulary — preferred terms and words to avoid

### Preferred terms

| Preferred | Instead of | Why |
|---|---|---|
| credential | course, certification (alone), program | "Credential" signals professional standing, not just content consumed |
| practitioner | professional, user, learner | Consistent with the credential family naming (REP, RPDP, RSP, RXR) |
| deployment | implementation, rollout, launch | Specific to robotics context; used consistently across the site |
| robotic literacy | robotics knowledge, understanding robots | The site's core value proposition; use the exact phrase |
| human-robot interaction / HRI | human-machine interface (HMI is hardware-specific), robot UX | "HRI" is the research-field term; use it when writing for research contexts |
| the human side of robotics | non-technical robotics, soft side | The site's positioning phrase |
| readiness | preparedness, awareness | "Readiness" carries assessment connotations consistent with the HRF framework |
| mixed human-robot environment | hybrid environment (ambiguous), robotic workplace | Specific to the actual configuration being described |
| failure mode / failure tolerance | error, problem, issue | "Failure mode" is precise; "issue" is vague |
| frontline / operational staff | employees, workers, staff generally | Names the specific role when the general is insufficient |

### Spelling standard: American English

The site uses American English in marketing and page copy. Use American spellings:

| American ✅ | British ❌ |
|---|---|
| program | programme |
| organization | organisation |
| behavior | behaviour |
| enrollment | enrolment |
| analyze | analyse |

**Note:** The certifications data in `src/lib/certifications.ts` currently uses British spellings (`programme`, `organisation`, `behaviour`, `enrolment`). This is a known inconsistency flagged in section 8.

### Words to avoid

**Vague positive adjectives:** innovative, transformative, cutting-edge, world-class, best-in-class, comprehensive, robust, powerful, seamless, intuitive.

**Corporate verbs:** leverage (use "use"), utilize (use "use"), operationalize (use "put into practice" or "deploy"), synergize, prioritize (almost always replaceable with a more specific verb).

**Passive constructions that hide agency:** "robots are being integrated" → "organizations are deploying robots"; "challenges may be encountered" → "teams run into [specific problem]".

**Audience-flattening nouns:** users (use the actual role), professionals (name them), people (acceptable in the site's own frames: "the people who design the future", but avoid as a replacement for a specific role name).

**Future-tense hype:** will transform, is going to change, represents the future. The site is grounded in what is already happening.

---

## 7. Strong copy examples

These are the highest-performing lines on the site — specific, confident, non-replicable elsewhere.

---

### Thesis statements that open with the claim

> "Most robot deployments fail not because the robot breaks — but because the humans around it weren't ready. The machine works. The context doesn't."
> — *src/lib/articles.ts, article 1, paragraph 1*

What makes it work: the em-dash creates a hinge between expected and actual cause. "The machine works. The context doesn't." is a two-sentence hammer. Short-long-short rhythm.

---

> "Automation anxiety is largely a design failure. It is what happens when deployment is done to people rather than with them."
> — *src/lib/articles.ts, article 4, paragraph 5*

What makes it work: reframes the entire anxiety/job-displacement narrative as a solvable design problem rather than an economic inevitability. This is the strongest thesis on the site and could be its manifesto.

---

> "The hardest skill in a robotic workplace is knowing when to override the machine. That is not a technical skill. It is a human one."
> — *src/lib/articles.ts, article 6, last paragraph*

What makes it work: descending sentence length. Closing sentence lands hard because it is the shortest. "It is a human one" inverts the assumed hierarchy between technical and human skills — the whole article's argument compressed to five words.

---

### Headlines that make a claim

> "Non-engineering staff carry the risk."
> — *src/app/enterprise/page.tsx, WHY_CARDS[1].title*

What makes it work: names a specific group, assigns a specific condition. Could not appear on any other website without being wrong.

---

> "Readiness is a process, not a checklist."
> — *src/app/enterprise/page.tsx, WHY_CARDS[2].title*

What makes it work: the contrast is earned here because both terms are specific and distinct — this is a real distinction, not a rhetorical trick.

---

> "Ten seats. One rate. First in."
> — *src/components/FoundingCohort/FoundingCohort.tsx*

What makes it work: three parallel fragments. Each is a constraint or a status, not a benefit. The scarcity is stated as fact, not as urgency-manufacturing.

---

### Module/credential descriptions that specify the skill

> "Proximity, gaze, gesture — how humans and robots read each other in physical space, and what goes wrong when the signals fail."
> — *src/lib/certifications.ts, module 1.2*

What makes it work: opens with the three vocabulary items the module will build, uses the em-dash to deliver the learning outcome, ends with the failure case that makes the skill matter.

---

> "The robot stopped. No one knows why. This module covers failure mode design — what the system communicates, to whom, and how."
> — *src/lib/certifications.ts, module 2.3*

What makes it work: the opening two sentences create the scenario before naming the subject. "No one knows why" is the reader's current state; the module resolves it. Scenario-first, curriculum-second.

---

### Summit copy that commits to specificity

> "We are looking for practitioners, not theorists. People who have deployed robots in real environments, designed around their limitations, researched how humans actually behave near them, or made consequential decisions about where and how they get used."
> — *src/lib/articles.ts, article 3, paragraph 2*

What makes it work: "practitioners, not theorists" is the one place where a contrast construction is earned — the distinction is real and relevant to the selection process. The second sentence delivers four specific versions of "practitioner" rather than leaving the term abstract.

---

## 8. Weak and inconsistent copy that should be revised

These are existing lines that violate the voice rules or are inconsistent with the patterns established elsewhere on the site. They are documented here so any content revision prioritizes them.

---

### W-01 — British/American spelling inconsistency in certifications data

**File:** `src/lib/certifications.ts`

The certifications data uses British English throughout: `programme`, `organisation`, `behaviour`, `enrolment`. Marketing copy across all pages uses American English: `program` (Certification.js), `organization` (enterprise/page.tsx), `enrollment` (access/page.tsx).

**Recommended action:** Standardize `certifications.ts` to American English to match the rest of the site.

| Current (British) | Should be (American) |
|---|---|
| "Four-week hybrid programme" | "Four-week hybrid program" |
| "Organisational Readiness & Change Management" | "Organizational Readiness & Change Management" |
| "open for enrolment" | "open for enrollment" |
| "behaviour" (×4) | "behavior" |
| "organisation" (×3) | "organization" |

---

### W-02 — "RLP" vs "REP" naming inconsistency

**Files:** `src/lib/articles.ts` (articles 2 and 3), `src/components/FeaturedArticle/FeaturedArticle.js`

Two article headlines reference "RLP" (Robotic Literacy Practitioner) — the former name of the credential now called REP (Robotics Experience Practitioner). The FeaturedArticle component also uses "RLP" in its headline.

> Current: "RLP Module 1.1 is live: foundations of robotic literacy for practitioners" *(articles.ts, article 2)*  
> Current: "RLP Module 1.1 is live: foundations of robotic literacy for practitioners" *(FeaturedArticle.js)*

**Recommended action:** Update both to "REP Module 1.1 is live: foundations of robotics experience for practitioners" or similar.

---

### W-03 — Access page subtitle ends weakly

**File:** `src/app/access/page.tsx`

> Current: "The Robotics Experience Practitioner certification is launching soon. Join the waitlist and we'll notify you when enrollment opens — along with early access offers and pre-launch resources."

"Early access offers and pre-launch resources" is vague marketing language. "Pre-launch resources" is particularly hollow — what resources? "Early access offers" hedges without committing.

**Recommended revision:**
> "The first REP cohort runs May 2026. Join the waitlist and we'll notify you before the public announcement — with founding-member pricing and direct access to the instructor."

---

### W-04 — "Join the list to be notified when new tracks open"

**File:** `src/components/Certification/Certification.js`

> Current: "Join the list to be notified when new tracks open"

This is the longest CTA on the site and the only one that narrates its own mechanism ("to be notified"). Compare with "Get Notified" in Summit.js, which does the same job in two words. The long version also buries the action ("Join the list") before the reason.

**Recommended revision:** "Get notified when new tracks open" or simply "Notify me when new tracks open →"

---

### W-05 — "View All News" is inconsistent with section label

**File:** `src/components/ArticleGrid/ArticleGrid.js`

The section eyebrow and headline are "Latest" / "News & Research", but the expand CTA says "View All News" — silently dropping the research category.

**Recommended revision:** "View All" (if destination is a general archive) or "View All Research" (if destination is the research page).

---

### W-06 — "Read article" is mechanical and lowercase

**File:** `src/components/FeaturedArticle/FeaturedArticle.js`

> Current: "Read article"

Lowercase "article" is inconsistent with all other CTAs on the site. The phrasing is also the most generic CTA possible and says nothing about why to read it.

**Recommended revisions (pick one):**
- "Read the article →"
- "Read →"
- "Read it →" (matches the site's conversational register)

---

### W-07 — "Operationalizing robotics across industries"

**File:** `src/components/Summit/Summit.js`, track 04 description

> Current: "Operationalizing robotics across industries"

"Operationalizing" is the most corporate-sounding word on the site. It contradicts the anti-jargon stance of the Summit's own headline copy ("No hype.").

**Recommended revision:** "Making robotic deployment work across industries" or "Deploying robots in practice across industries"

---

### W-08 — Terms page subtitle is verbose

**File:** `src/app/terms/page.tsx`

> Current: "The terms and conditions governing your use of The Robot Age platform."

Long for a three-word concept. The Privacy page subtitle ("How we collect, use, and protect your information.") sets a cleaner precedent — it answers a question.

**Recommended revision:** "What governs your use of this platform." — consistent structure with the Privacy page subtitle.

---

### W-09 — "along with early access offers and pre-launch resources" (see W-03)

Already flagged above under W-03. Noted here separately because "early access offers" is the weakest phrase in the marketing copy — it is placeholder language that belongs in a draft.

---

### W-10 — Footer tagline vs homepage subtext are near-duplicates

**Files:** `src/components/Footer/Footer.js`, `src/components/HeroHomepage/HeroHomepage.js`

> Footer tagline: "Robotic literacy for the people who design the future."  
> Homepage subtext: "Robotic literacy isn't about code. It's about knowing enough to ask the right questions, make better decisions, and design for a world where robots are already here."

Both are good individually. The overlap is in "people who design" / "design for a world." The footer tagline could be more distinctive and use less future-tense phrasing ("the future" is one of the few future-facing phrases on an otherwise present-tense site).

**Potential revision:** "Robotic literacy for the people who shape how robots land." — ties to the site's language of "deployment" and "readiness" rather than "the future."
