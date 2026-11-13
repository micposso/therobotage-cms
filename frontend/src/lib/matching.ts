/**
 * Matching engine for the "What Robot Are You?" quiz.
 *
 * Answers are NOT mapped directly to robots (too brittle). Instead each answer
 * places the user on a few of the five playful trait axes (see `quizRobots.ts`).
 * We average the user's placements per axis, then match to the robot with the
 * lowest Euclidean distance in that space. Ties break deterministically by the
 * robot's authored order in QUIZ_ROBOTS.
 *
 * Adding or re-weighting a robot requires no changes here — the engine scores
 * against whatever robots exist. Adding a question only requires adding its
 * option deltas below.
 */

import {
  QUIZ_ROBOTS,
  AXES,
  type Axis,
  type TraitVector,
  type QuizRobot,
} from './quizRobots'

/** Editorial personality preferences, not measured robot performance. */
export interface QuizOption {
  id: string
  label: string
  deltas: Partial<Record<Axis, number>>
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: QuizOption[]
}

/**
 * Six personality-quiz questions. Each option carries data-driven trait deltas,
 * so scoring never hard-codes a robot. Between them the options span all five
 * axes so every robot is reachable.
 */
export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'home',
    prompt: 'Where do you feel most at home?',
    options: [
      { id: 'apartment', label: 'A cozy home with my people', deltas: { environment: 0.05, scale: 0.85 } },
      { id: 'warehouse', label: 'A workshop with a big project', deltas: { environment: 1, scale: 0.95 } },
      { id: 'crowd', label: 'Right in the middle of the crowd', deltas: { sociability: 1, environment: 0.45, scale: 0.65 } },
      { id: 'desk', label: 'My own little desk setup', deltas: { environment: 0.2, mobility: 0, scale: 0.05 } },
    ],
  },
  {
    id: 'saturday',
    prompt: 'A free afternoon. What’s the plan?',
    options: [
      { id: 'house', label: 'Make someone’s day a little easier', deltas: { role: 0, environment: 0.1, mobility: 0.5 } },
      { id: 'drills', label: 'Beat my personal best', deltas: { role: 1, mobility: 1, sociability: 0.15 } },
      { id: 'outside', label: 'Explore somewhere I’ve never been', deltas: { mobility: 1, role: 0.6, scale: 0.4 } },
      { id: 'conversation', label: 'Lose track of time talking', deltas: { sociability: 1, role: 0.85, mobility: 0 } },
    ],
  },
  {
    id: 'superpower',
    prompt: 'In a group, you’re the one who…',
    options: [
      { id: 'reliable', label: 'Quietly gets the job done', deltas: { role: 0.4, environment: 0.9, sociability: 0.05 } },
      { id: 'social', label: 'Gets everyone talking', deltas: { sociability: 1, role: 0.85 } },
      { id: 'anywhere', label: 'Takes on the wild challenge', deltas: { mobility: 1, role: 0.9 } },
      { id: 'precision', label: 'Figures out how it all works', deltas: { environment: 0.6, role: 0.5, sociability: 0.3, scale: 0.65 } },
    ],
  },
  {
    id: 'pressure',
    prompt: 'Under pressure you…',
    options: [
      { id: 'power', label: 'Put my head down and power through', deltas: { role: 0.5, environment: 0.9, scale: 1, sociability: 0.1 } },
      { id: 'adapt', label: 'Try a completely different approach', deltas: { mobility: 0.9, role: 0.75, environment: 0.5 } },
      { id: 'steady', label: 'Stay calm and help everyone else', deltas: { role: 0.05, sociability: 0.35, mobility: 0.5 } },
      { id: 'talk', label: 'Talk it through together', deltas: { sociability: 1, role: 0.8 } },
    ],
  },
  {
    id: 'flaw',
    prompt: "A flaw you'd own up to?",
    options: [
      { id: 'overheat', label: 'I forget to take a break', deltas: { environment: 0.95, sociability: 0.05, mobility: 0.6 } },
      { id: 'loud', label: 'I steal the spotlight', deltas: { sociability: 1, role: 1 } },
      { id: 'charger', label: 'I can’t sit still', deltas: { mobility: 1, role: 0.7 } },
      { id: 'reach', label: 'I get too comfortable in my little bubble', deltas: { scale: 0.1, mobility: 0, environment: 0.1 } },
    ],
  },
  {
    id: 'underestimate',
    prompt: 'What do people underestimate about you?',
    options: [
      { id: 'strength', label: 'How much I can take on', deltas: { environment: 0.9, scale: 1, sociability: 0.1 } },
      { id: 'smarts', label: 'How well I connect with people', deltas: { sociability: 1, role: 0.8 } },
      { id: 'range', label: 'How far I’ll push myself', deltas: { mobility: 1, role: 1, environment: 0.7 } },
      { id: 'staying', label: 'How much I care about the little things', deltas: { role: 0, environment: 0.1, sociability: 0.5, scale: 0.7 } },
    ],
  },
]

/** Answers: question id -> chosen option id. */
export type Answers = Record<string, string>

/**
 * Build the user's trait vector by averaging every option delta that touched
 * each axis. Axes no answer touched default to a neutral 0.5.
 */
export function scoreAnswers(answers: Answers): TraitVector {
  const sums: Record<Axis, number> = { environment: 0, sociability: 0, mobility: 0, role: 0, scale: 0 }
  const counts: Record<Axis, number> = { environment: 0, sociability: 0, mobility: 0, role: 0, scale: 0 }

  for (const q of QUESTIONS) {
    const optId = answers[q.id]
    if (!optId) continue
    const opt = q.options.find((o) => o.id === optId)
    if (!opt) continue
    for (const axis of AXES) {
      const d = opt.deltas[axis]
      if (d != null) {
        sums[axis] += d
        counts[axis] += 1
      }
    }
  }

  const vector = {} as TraitVector
  for (const axis of AXES) {
    vector[axis] = counts[axis] > 0 ? sums[axis] / counts[axis] : 0.5
  }
  return vector
}

function distance(a: TraitVector, b: TraitVector): number {
  let sum = 0
  for (const axis of AXES) {
    const d = a[axis] - b[axis]
    sum += d * d
  }
  return Math.sqrt(sum)
}

export interface MatchResult {
  robot: QuizRobot
  userVector: TraitVector
  /** Distance to the matched robot (lower = closer). */
  distance: number
  /** Human-readable "why you matched" line, derived from the user's dominant axis. */
  reason: string
  /** A single trait adjective for share captions (e.g. "expressive"). */
  traitWord: string
  /** Shared tendencies grounded in both vectors; never an opposing trait. */
  highlights: MatchHighlight[]
}

export interface MatchHighlight {
  axis: Axis
  high: boolean
  title: string
  detail: string
}

const MATCH_DETAILS: Record<Axis, { low: string; high: string }> = {
  environment: { low: 'Your choices lean toward familiar spaces and everyday life.', high: 'Your choices lean toward busy spaces and hands-on work.' },
  sociability: { low: 'You tend to focus on the task and let the work do the talking.', high: 'Conversation and connection show up in your answers.' },
  mobility: { low: 'You’re happy with a home base and a moment to settle in.', high: 'You tend to choose movement, exploration, and changing things up.' },
  role: { low: 'Making life easier for someone else comes naturally to you.', high: 'Your choices suggest you enjoy a challenge or a moment in the spotlight.' },
  scale: { low: 'A small setup and your own corner of the world suit you.', high: 'You’re drawn to taking up space and taking on big things.' },
}

/** Descriptor words for the extreme ends of each axis. */
const AXIS_WORDS: Record<Axis, { low: string; high: string }> = {
  environment: { low: 'at home in everyday life', high: 'ready to get to work' },
  sociability: { low: 'heads-down', high: 'expressive' },
  mobility: { low: 'grounded', high: 'always on the move' },
  role: { low: 'a natural helper', high: 'a performer at heart' },
  scale: { low: 'small-space energy', high: 'a big presence' },
}

/** Short single-word trait for captions, keyed to each axis end. */
const AXIS_TRAIT_WORD: Record<Axis, { low: string; high: string }> = {
  environment: { low: 'home-loving', high: 'hands-on' },
  sociability: { low: 'focused', high: 'expressive' },
  mobility: { low: 'steady', high: 'mobile' },
  role: { low: 'helpful', high: 'showstopping' },
  scale: { low: 'compact', high: 'powerful' },
}

/** Prefer distinctive shared tendencies, not just the user's strongest trait. */
function sharedTraits(user: TraitVector, robot: TraitVector): MatchHighlight[] {
  return AXES.filter((axis) => (user[axis] - 0.5) * (robot[axis] - 0.5) > 0)
    .sort((a, b) => {
      const strength = (axis: Axis) => Math.min(Math.abs(user[axis] - 0.5), Math.abs(robot[axis] - 0.5))
      return strength(b) - strength(a)
    })
    .slice(0, 2)
    .map((axis) => {
      const high = user[axis] > 0.5
      const end = high ? 'high' : 'low'
      return { axis, high, title: AXIS_WORDS[axis][end], detail: MATCH_DETAILS[axis][end] }
    })
}

/**
 * Match the user to the nearest robot by Euclidean distance in trait space.
 * Ties break by the authored QUIZ_ROBOTS order.
 */
export function matchRobot(answers: Answers): MatchResult {
  if (!QUESTIONS.every((q) => q.options.some((option) => option.id === answers[q.id]))) {
    throw new Error('Answer all six questions before finding a match.')
  }
  const userVector = scoreAnswers(answers)

  let best: QuizRobot = QUIZ_ROBOTS[0]
  let bestDist = Infinity
  for (const robot of QUIZ_ROBOTS) {
    const d = distance(userVector, robot.traitVector)
    if (d < bestDist) {
      bestDist = d
      best = robot
    }
  }

  const highlights = sharedTraits(userVector, best.traitVector)
  const primary = highlights[0]
  const traitWord = primary ? AXIS_TRAIT_WORD[primary.axis][primary.high ? 'high' : 'low'] : 'versatile'
  const reason = primary
    ? `You and ${best.name}: ${primary.title}.`
    : `A little bit of everything. ${best.name} is the closest match to your mix.`

  return { robot: best, userVector, distance: bestDist, reason, traitWord, highlights }
}
