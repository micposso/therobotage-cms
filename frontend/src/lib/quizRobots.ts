/**
 * Dataset for the "What Robot Are You?" quiz.
 *
 * NOTE: this is deliberately separate from `src/lib/robots.ts` (which loads the
 * markdown robot *profiles* under `/robots`). This file is the self-contained,
 * typed dataset the quiz + result cards + OpenGraph images read from. Adding a
 * robot here (with a `traitVector`) makes it matchable without touching the
 * questions — the matching engine scores against whatever robots exist.
 *
 * Every spec value below is real and verified. Do NOT invent numbers — if a spec
 * is unknown, phrase it qualitatively (see Figure 03 / Stretch notes).
 */

/* ─── Trait axes ──────────────────────────────────────────────────────────────
 * Five axes, each normalized 0..1. A robot's `traitVector` places it in this
 * space; the quiz places the user in the same space; the nearest robot wins.
 */
export type Axis =
  | 'environment' // 0 = home / domestic            → 1 = industrial / floor
  | 'sociability' // 0 = task-silent, heads-down     → 1 = expressive, communicative
  | 'mobility' //    0 = stationary                  → 1 = highly mobile
  | 'role' //        0 = helper → 0.5 = worker       → 1 = performer / athlete
  | 'scale' //       0 = desktop                     → 1 = adult-scale

export type TraitVector = Record<Axis, number>

export const AXES: Axis[] = [
  'environment',
  'sociability',
  'mobility',
  'role',
  'scale',
]

export interface RobotSpecs {
  height: string
  weight: string
  dof: string
  notable: string
  price: string
}

export interface QuizRobot {
  slug: string
  name: string
  maker: string
  /** Short archetype tagline. */
  archetype: string
  /** 1–2 sentence honest description. */
  blurb: string
  specs: RobotSpecs
  /** Position in the five-axis trait space (see Axis). */
  traitVector: TraitVector
  /** Placeholder photo path — drop real images at /public/robots/<slug>.jpg. */
  photo: string
}

/**
 * The nine robots. traitVectors are honest, defensible estimates of where each
 * robot sits on the five axes — not marketing. Keep them plausible: Reachy Mini
 * is stationary and expressive with no manipulation; Atlas is the most mobile;
 * NEO and Stretch are home/assistive helpers; Digit and Optimus are floor workers.
 */
export const QUIZ_ROBOTS: QuizRobot[] = [
  {
    slug: 'unitree-g1',
    name: 'Unitree G1',
    maker: 'Unitree Robotics',
    archetype: 'The Nimble Generalist',
    blurb:
      'A compact, affordable humanoid that walks, balances, and learns new skills fast. Built to be a flexible platform rather than a single-purpose worker.',
    specs: {
      height: '1.32 m',
      weight: '35 kg',
      dof: '23–43 DOF',
      notable: 'Walks up to 2 m/s; agile whole-body control',
      price: 'From ~$16,000',
    },
    traitVector: {
      environment: 0.5,
      sociability: 0.35,
      mobility: 0.85,
      role: 0.5,
      scale: 0.7,
    },
    photo: '/robots/unitree-g1.jpg',
  },
  {
    slug: 'optimus',
    name: 'Tesla Optimus Gen 2',
    maker: 'Tesla',
    archetype: 'The Factory Workhorse',
    blurb:
      'A full-size humanoid aimed squarely at repetitive factory work. Steady, strong, and built to be deployed on the floor at scale.',
    specs: {
      height: '173 cm',
      weight: '57 kg',
      dof: '28 DOF',
      notable: 'Walks ~8 km/h; deployed in Tesla facilities',
      price: 'Not yet retail',
    },
    traitVector: {
      environment: 0.9,
      sociability: 0.2,
      mobility: 0.55,
      role: 0.45,
      scale: 1.0,
    },
    photo: '/robots/optimus.jpg',
  },
  {
    slug: 'figure-03',
    name: 'Figure 03',
    maker: 'Figure',
    archetype: 'The AI-Native Operator',
    blurb:
      'A humanoid designed from the ground up around AI — gram-level tactile hands and speech-to-speech interaction, built for mass production on the BotQ line.',
    specs: {
      height: 'Adult humanoid',
      weight: 'Not disclosed',
      dof: 'Dexterous hands',
      notable: 'Gram-level tactile sensing; speech-to-speech; BotQ mass production',
      price: 'Not yet retail',
    },
    traitVector: {
      environment: 0.7,
      sociability: 0.6,
      mobility: 0.6,
      role: 0.5,
      scale: 0.95,
    },
    photo: '/robots/figure-03.jpg',
  },
  {
    slug: 'atlas',
    name: 'Atlas (electric)',
    maker: 'Boston Dynamics',
    archetype: 'The Athlete',
    blurb:
      'The all-electric Atlas moves in ways no other humanoid can — 360-degree rotational joints and a hot-swap battery. Pure range of motion and physical capability.',
    specs: {
      height: 'Adult humanoid',
      weight: '~50 kg payload capable',
      dof: '56 DOF',
      notable: '360° rotational joints; 50 kg payload; hot-swap battery',
      price: 'Not retail (commercial pilots)',
    },
    traitVector: {
      environment: 0.8,
      sociability: 0.2,
      mobility: 1.0,
      role: 0.85,
      scale: 0.9,
    },
    photo: '/robots/atlas.jpg',
  },
  {
    slug: 'unitree-go2',
    name: 'Unitree Go2',
    maker: 'Unitree Robotics',
    archetype: 'The Loyal Scout',
    blurb:
      'An agile, affordable quadruped that goes almost anywhere — stairs, trails, rough ground. Fast, sure-footed, and eager to follow.',
    specs: {
      height: 'Quadruped',
      weight: '~15 kg',
      dof: '12 DOF',
      notable: 'Highly agile; climbs stairs and rough terrain',
      price: 'From ~$1,600',
    },
    traitVector: {
      environment: 0.5,
      sociability: 0.35,
      mobility: 0.95,
      role: 0.6,
      scale: 0.4,
    },
    photo: '/robots/unitree-go2.jpg',
  },
  {
    slug: 'reachy-mini',
    name: 'Reachy Mini',
    maker: 'Pollen Robotics',
    archetype: 'The Communicator',
    blurb:
      'A small, expressive desktop robot that notices you and reacts — a moving head, antennas, voice, and a wide-angle camera. It reads the room; it does not have arms and does not pick things up.',
    specs: {
      height: '28 cm',
      weight: '1.5 kg',
      dof: '6-DOF head + 9 servos',
      notable: 'Wide-angle camera; expressive head and antennas; no arms',
      price: 'From $299',
    },
    traitVector: {
      environment: 0.2,
      sociability: 1.0,
      mobility: 0.0,
      role: 0.85,
      scale: 0.0,
    },
    photo: '/robots/reachy-mini.jpg',
  },
  {
    slug: 'neo',
    name: '1X NEO',
    maker: '1X Technologies',
    archetype: 'The Domestic',
    blurb:
      'A home humanoid with an onboard language model, designed to help around the house and hold a conversation while it does. Built for living rooms, not factories.',
    specs: {
      height: 'Adult humanoid',
      weight: 'Lightweight (home-safe design)',
      dof: 'Full-body humanoid',
      notable: 'Onboard LLM; designed for domestic tasks',
      price: '~$20,000 or $499/mo',
    },
    traitVector: {
      environment: 0.05,
      sociability: 0.7,
      mobility: 0.6,
      role: 0.15,
      scale: 0.9,
    },
    photo: '/robots/neo.jpg',
  },
  {
    slug: 'digit',
    name: 'Digit',
    maker: 'Agility Robotics',
    archetype: 'The Operator',
    blurb:
      'A warehouse-logistics biped that is actually deployed commercially, moving totes and boxes on a robots-as-a-service model. Heads-down, reliable, on the clock.',
    specs: {
      height: '~1.75 m',
      weight: '~65 kg',
      dof: 'Full-body biped',
      notable: 'Commercially deployed for logistics (RaaS)',
      price: 'Robots-as-a-service',
    },
    traitVector: {
      environment: 0.95,
      sociability: 0.15,
      mobility: 0.7,
      role: 0.45,
      scale: 0.85,
    },
    photo: '/robots/digit.jpg',
  },
  {
    slug: 'stretch',
    name: 'Stretch',
    maker: 'Hello Robot',
    archetype: 'The Helper',
    blurb:
      'A mobile manipulator built for assistance and independence — a wheeled base, a telescoping mast, and a single dexterous arm. Quiet, patient, and focused on helping one person at a time.',
    specs: {
      height: 'Telescoping mast',
      weight: '~24.5 kg',
      dof: 'Mobile base + lift + arm + wrist',
      notable: 'Wheeled base + telescoping mast + single dexterous arm (Stretch 3)',
      price: '$24,950',
    },
    traitVector: {
      environment: 0.25,
      sociability: 0.35,
      mobility: 0.55,
      role: 0.1,
      scale: 0.6,
    },
    photo: '/robots/stretch.jpg',
  },
]

export function getQuizRobot(slug: string): QuizRobot | undefined {
  return QUIZ_ROBOTS.find((r) => r.slug === slug)
}

export function allQuizRobotSlugs(): string[] {
  return QUIZ_ROBOTS.map((r) => r.slug)
}

/* ─── Display stat bars ───────────────────────────────────────────────────────
 * The result card shows five *display* bars (Mobility / Sociability / Strength /
 * Precision / Expressiveness). These are DERIVED deterministically from the five
 * trait axes so the card stays in sync with the matching model and no second set
 * of numbers can drift. The formulas are documented, honest linear blends — e.g.
 * a big robot on the factory floor reads as high Strength; a small home robot
 * that reacts to you reads as high Expressiveness.
 */
export interface StatBar {
  label: string
  value: number // 0..1
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

export function statBars(v: TraitVector): StatBar[] {
  return [
    { label: 'Mobility', value: clamp01(v.mobility) },
    { label: 'Sociability', value: clamp01(v.sociability) },
    // Big + industrial reads as strong.
    { label: 'Strength', value: clamp01(0.55 * v.scale + 0.45 * v.environment) },
    // Structured, floor-grade, stable work reads as precise.
    { label: 'Precision', value: clamp01(0.35 + 0.4 * v.environment + 0.25 * (1 - v.mobility)) },
    // Social + home-facing reads as expressive.
    { label: 'Expressiveness', value: clamp01(0.7 * v.sociability + 0.3 * (1 - v.environment)) },
  ]
}
