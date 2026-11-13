/**
 * Dataset for the "What Robot Are You?" quiz.
 *
 * NOTE: this is deliberately separate from `src/lib/robots.ts` (which loads the
 * markdown robot *profiles* under `/robots`). This file is the self-contained,
 * typed dataset the quiz + result cards + OpenGraph images read from. Adding a
 * robot here (with a `traitVector`) makes it matchable without touching the
 * questions — the matching engine scores against whatever robots exist.
 *
 * Learning notes link to manufacturer sources. Keep edition-dependent specs and
 * prices on those sources instead of presenting stale values in quiz cards.
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

export interface QuizRobot {
  slug: string
  name: string
  maker: string
  /** Short archetype tagline. */
  archetype: string
  /** Position in the five-axis trait space (see Axis). */
  traitVector: TraitVector
  /** Local source path; resolve through the verified R2 image manifest. */
  photo: string
  learning: {
    category: string
    use: string
    takeaway: string
    source: { label: string; url: string }
  }
}

/**
 * Nine editorial quiz archetypes, not capability measurements or RXD scores.
 * Reachy Mini is stationary and expressive; NEO and Stretch inspire helper
 * archetypes; Digit and Optimus inspire work-focused archetypes.
 */
export const QUIZ_ROBOTS: QuizRobot[] = [
  {
    slug: 'unitree-g1',
    name: 'Unitree G1',
    maker: 'Unitree Robotics',
    archetype: 'The Nimble Generalist',
    traitVector: {
      environment: 0.5,
      sociability: 0.35,
      mobility: 0.85,
      role: 0.5,
      scale: 0.7,
    },
    photo: '/robots/unitree-g1.jpg',
    learning: {
      category: 'Humanoid · Research and development',
      use: 'G1 is a compact, two-legged robot platform for exploring movement and manipulation: using hands or grippers to work with objects.',
      takeaway: 'Hardware matters. The base G1 and EDU editions have different development access and hand options. A demo does not tell you what every configuration includes.',
      source: { label: 'Unitree’s G1 specifications', url: 'https://www.unitree.com/g1/' },
    },
  },
  {
    slug: 'optimus',
    name: 'Tesla Optimus Gen 2',
    maker: 'Tesla',
    archetype: 'The Factory Workhorse',
    traitVector: {
      environment: 0.9,
      sociability: 0.2,
      mobility: 0.55,
      role: 0.45,
      scale: 1.0,
    },
    photo: '/robots/optimus.jpg',
    learning: {
      category: 'Humanoid · General-purpose development',
      use: 'Optimus is Tesla’s humanoid robotics program, aimed at tasks that are repetitive, physically demanding, or hazardous. This quiz’s character is based on Gen 2.',
      takeaway: 'General-purpose describes a goal. Balance, navigation, perception, and object handling are separate engineering problems; being human-shaped does not solve all of them.',
      source: { label: 'Tesla’s robotics overview', url: 'https://www.tesla.com/SI' },
    },
  },
  {
    slug: 'figure-03',
    name: 'Figure 03',
    maker: 'Figure',
    archetype: 'The AI-Native Operator',
    traitVector: {
      environment: 0.7,
      sociability: 0.6,
      mobility: 0.6,
      role: 0.5,
      scale: 0.95,
    },
    photo: '/robots/figure-03.jpg',
    learning: {
      category: 'Humanoid · Home and workplace tasks',
      use: 'Figure 03 combines a humanoid body with Helix, Figure’s system for turning what a robot sees and understands into physical actions. Its hands include cameras and touch sensing.',
      takeaway: 'A robot needs feedback while it acts. A camera in the palm can keep an object in view when the head camera cannot see the grasp.',
      source: { label: 'Figure’s introduction to Figure 03', url: 'https://www.figure.ai/news/introducing-figure-03' },
    },
  },
  {
    slug: 'atlas',
    name: 'Atlas',
    maker: 'Boston Dynamics',
    archetype: 'The Athlete',
    traitVector: {
      environment: 0.8,
      sociability: 0.2,
      mobility: 1.0,
      role: 0.85,
      scale: 0.9,
    },
    photo: '/robots/atlas.jpg',
    learning: {
      category: 'Humanoid · Industrial material handling',
      use: 'Boston Dynamics designs the electric Atlas to move parts and materials in industrial workplaces. Its joints can rotate through ranges that a human body cannot.',
      takeaway: 'Movement is only part of the job. Boston Dynamics is developing specific workflows with early customers; a dramatic movement demo is different from a reliable work shift.',
      source: { label: 'Boston Dynamics’ Atlas overview', url: 'https://bostondynamics.com/products/atlas/' },
    },
  },
  {
    slug: 'unitree-go2',
    name: 'Unitree Go2',
    maker: 'Unitree Robotics',
    archetype: 'The Loyal Scout',
    traitVector: {
      environment: 0.5,
      sociability: 0.35,
      mobility: 0.95,
      role: 0.6,
      scale: 0.4,
    },
    photo: '/robots/unitree-go2.jpg',
    learning: {
      category: 'Quadruped · Exploration and development',
      use: 'Go2 is a quadruped: a robot with four legs. It uses LiDAR, a sensor that measures distance with light, to help perceive its surroundings.',
      takeaway: 'Four legs help with movement over uneven ground, but navigation, battery life, and developer access vary by edition. A robot dog is a machine with defined limits.',
      source: { label: 'Unitree’s Go2 overview and editions', url: 'https://www.unitree.com/go2/' },
    },
  },
  {
    slug: 'reachy-mini',
    name: 'Reachy Mini',
    maker: 'Pollen Robotics',
    archetype: 'The Communicator',
    traitVector: {
      environment: 0.2,
      sociability: 1.0,
      mobility: 0.0,
      role: 0.85,
      scale: 0.0,
    },
    photo: '/robots/reachy-mini.jpg',
    learning: {
      category: 'Desktop robot · Human–robot interaction',
      use: 'Reachy Mini is an open-source platform for experimenting with voice, vision, and expressive movement. Its moving head and antennas help make interaction feel more legible.',
      takeaway: 'A robot can be useful without walking or lifting things. Reachy Mini stays on a surface and has no arms; its focus is interaction and creative coding.',
      source: { label: 'Pollen Robotics and Hugging Face’s introduction', url: 'https://huggingface.co/blog/reachy-mini' },
    },
  },
  {
    slug: 'neo',
    name: '1X NEO',
    maker: '1X Technologies',
    archetype: 'The Domestic',
    traitVector: {
      environment: 0.05,
      sociability: 0.7,
      mobility: 0.6,
      role: 0.15,
      scale: 0.9,
    },
    photo: '/robots/neo.jpg',
    learning: {
      category: 'Humanoid · Household assistance',
      use: '1X designs NEO for household tasks and conversation. Its product experience includes both autonomous actions and remote assistance for unfamiliar chores.',
      takeaway: 'Autonomous and teleoperated are different. In 1X’s scheduled Expert Mode, a human can remotely guide the robot. Ask who is controlling a task before judging a demo.',
      source: { label: '1X’s NEO and Expert Mode overview', url: 'https://www.1x.tech/neo' },
    },
  },
  {
    slug: 'digit',
    name: 'Digit',
    maker: 'Agility Robotics',
    archetype: 'The Operator',
    traitVector: {
      environment: 0.95,
      sociability: 0.15,
      mobility: 0.7,
      role: 0.45,
      scale: 0.85,
    },
    photo: '/robots/digit.jpg',
    learning: {
      category: 'Humanoid · Logistics and manufacturing',
      use: 'Agility Robotics’ Digit moves materials in workplaces. The company reports commercial use of Digit 4 for tote handling and has introduced Digit 5 for broader workflows.',
      takeaway: 'A deployment is a whole system: the robot, charging, safety measures, and connections to conveyors or warehouse software. Always check which generation a claim refers to.',
      source: { label: 'Agility’s Digit generations and deployments', url: 'https://www.agilityrobotics.com/content/agility-unveils-digit-5-humanoid-robot-built-for-cooperatively-safe-work-at-scale' },
    },
  },
  {
    slug: 'stretch',
    name: 'Stretch',
    maker: 'Hello Robot',
    archetype: 'The Helper',
    traitVector: {
      environment: 0.25,
      sociability: 0.35,
      mobility: 0.55,
      role: 0.1,
      scale: 0.6,
    },
    photo: '/robots/stretch.jpg',
    learning: {
      category: 'Mobile manipulator · Indoor assistance research',
      use: 'Hello Robot’s Stretch combines a wheeled base with a lift, extending arm, and gripper. It is a mobile manipulator: a robot that moves around and handles objects.',
      takeaway: 'Helpful robots do not need a human body. Hello Robot labels several Stretch 3 household demonstrations as teleoperated, meaning a person controls the actions remotely.',
      source: { label: 'Hello Robot’s Stretch 3 demonstrations', url: 'https://hello-stretch3.com/' },
    },
  },
]

export function getQuizRobot(slug: string): QuizRobot | undefined {
  return QUIZ_ROBOTS.find((r) => r.slug === slug)
}

export function allQuizRobotSlugs(): string[] {
  return QUIZ_ROBOTS.map((r) => r.slug)
}

/* Playful archetype tendencies. These are editorial, not performance or RXD
 * scores. Avoid presenting inferred size or setting as strength or precision. */
export interface StatBar {
  label: string
  value: number // 0..1
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

export function statBars(v: TraitVector): StatBar[] {
  return [
    { label: 'On the move', value: clamp01(v.mobility) },
    { label: 'Social energy', value: clamp01(v.sociability) },
    { label: 'Spotlight energy', value: clamp01(v.role) },
  ]
}
