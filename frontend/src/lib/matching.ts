/**
 * Matching engine for the "What Robot Are You?" quiz.
 *
 * Answers are NOT mapped directly to robots (too brittle). Instead each answer
 * places the user on one or two of the five trait axes (see `quizRobots.ts`).
 * We average the user's placements per axis, then match to the robot with the
 * lowest Euclidean distance in that space. Ties break deterministically by the
 * robot's order in QUIZ_ROBOTS (which is authored slug order).
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

/** Each option nudges 1–2 axes toward a target value in [0,1]. */
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
      { id: 'apartment', label: 'A cozy apartment', deltas: { environment: 0.1, scale: 0.45 } },
      { id: 'warehouse', label: 'A busy warehouse', deltas: { environment: 0.95, scale: 0.85 } },
      { id: 'crowd', label: 'The center of the crowd', deltas: { sociability: 1.0, environment: 0.5 } },
      { id: 'desk', label: 'A quiet desk', deltas: { environment: 0.2, mobility: 0.0, scale: 0.0 } },
    ],
  },
  {
    id: 'saturday',
    prompt: 'Your ideal Saturday?',
    options: [
      { id: 'house', label: 'Helping around the house', deltas: { role: 0.1, environment: 0.15 } },
      { id: 'drills', label: 'Running drills', deltas: { role: 0.5, environment: 0.8 } },
      { id: 'outside', label: 'Exploring outside', deltas: { mobility: 1.0, role: 0.6 } },
      { id: 'conversation', label: 'A good conversation', deltas: { sociability: 1.0, role: 0.85 } },
    ],
  },
  {
    id: 'superpower',
    prompt: "What's your superpower?",
    options: [
      { id: 'reliable', label: 'Never dropping the ball', deltas: { role: 0.4, environment: 0.7 } },
      { id: 'social', label: 'Reading the room', deltas: { sociability: 1.0 } },
      { id: 'anywhere', label: 'Going anywhere', deltas: { mobility: 1.0 } },
      { id: 'precision', label: 'Precision', deltas: { environment: 0.7, role: 0.55 } },
    ],
  },
  {
    id: 'pressure',
    prompt: 'Under pressure you…',
    options: [
      { id: 'power', label: 'Power through', deltas: { role: 0.4, environment: 0.8 } },
      { id: 'adapt', label: 'Adapt fast', deltas: { mobility: 0.8, role: 0.6 } },
      { id: 'steady', label: 'Stay steady', deltas: { role: 0.3, sociability: 0.3 } },
      { id: 'talk', label: 'Talk it out', deltas: { sociability: 1.0 } },
    ],
  },
  {
    id: 'flaw',
    prompt: "A flaw you'd own up to?",
    options: [
      { id: 'overheat', label: 'I overheat', deltas: { environment: 0.85, role: 0.45 } },
      { id: 'loud', label: "I'm loud", deltas: { sociability: 0.9, scale: 0.7 } },
      { id: 'charger', label: 'I need a charger', deltas: { mobility: 0.9 } },
      { id: 'reach', label: "I can't reach that", deltas: { scale: 0.05, mobility: 0.1, sociability: 0.7 } },
    ],
  },
  {
    id: 'underestimate',
    prompt: 'What do people underestimate about you?',
    options: [
      { id: 'strength', label: 'My strength', deltas: { environment: 0.8, scale: 0.9, role: 0.45 } },
      { id: 'smarts', label: 'My social smarts', deltas: { sociability: 1.0 } },
      { id: 'range', label: 'My range', deltas: { mobility: 1.0 } },
      { id: 'staying', label: 'My staying power', deltas: { role: 0.35, environment: 0.3 } },
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
}

/** Descriptor words for the extreme ends of each axis. */
const AXIS_WORDS: Record<Axis, { low: string; high: string }> = {
  environment: { low: 'home-centered', high: 'built for the floor' },
  sociability: { low: 'heads-down', high: 'expressive' },
  mobility: { low: 'grounded', high: 'always on the move' },
  role: { low: 'a natural helper', high: 'a performer at heart' },
  scale: { low: 'compact', high: 'full-scale' },
}

/** Short single-word trait for captions, keyed to each axis end. */
const AXIS_TRAIT_WORD: Record<Axis, { low: string; high: string }> = {
  environment: { low: 'domestic', high: 'industrial' },
  sociability: { low: 'focused', high: 'expressive' },
  mobility: { low: 'steady', high: 'mobile' },
  role: { low: 'helpful', high: 'showstopping' },
  scale: { low: 'compact', high: 'powerful' },
}

/**
 * Find the user's most extreme axis (furthest from neutral 0.5) to phrase the
 * "why you matched" line. Deterministic: ties resolve by AXES order.
 */
function dominantAxis(v: TraitVector): { axis: Axis; high: boolean } {
  let best: Axis = AXES[0]
  let bestDev = -1
  for (const axis of AXES) {
    const dev = Math.abs(v[axis] - 0.5)
    if (dev > bestDev) {
      bestDev = dev
      best = axis
    }
  }
  return { axis: best, high: v[best] >= 0.5 }
}

/**
 * Match the user to the nearest robot by Euclidean distance in trait space.
 * Ties break by QUIZ_ROBOTS order (authored slug order).
 */
export function matchRobot(answers: Answers): MatchResult {
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

  const { axis, high } = dominantAxis(userVector)
  const descriptor = high ? AXIS_WORDS[axis].high : AXIS_WORDS[axis].low
  const traitWord = high ? AXIS_TRAIT_WORD[axis].high : AXIS_TRAIT_WORD[axis].low
  const reason = `You came out ${descriptor} — and so is ${best.name}.`

  return { robot: best, userVector, distance: bestDist, reason, traitWord }
}
