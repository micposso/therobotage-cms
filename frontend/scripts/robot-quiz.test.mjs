import assert from 'node:assert/strict'
import { test } from 'node:test'
import { testModule } from './test-module.mjs'

const { QUESTIONS, matchRobot } = await import(await testModule(new URL('../src/lib/matching.ts', import.meta.url)))
const { QUIZ_ROBOTS, AXES } = await import(await testModule(new URL('../src/lib/quizRobots.ts', import.meta.url)))

function* combinations(index = 0, answers = {}) {
  if (index === QUESTIONS.length) { yield answers; return }
  const question = QUESTIONS[index]
  for (const option of question.options) {
    yield* combinations(index + 1, { ...answers, [question.id]: option.id })
  }
}

test('all answer paths give valid, deterministic results and honest shared traits', () => {
  let paths = 0
  for (const answers of combinations()) {
    const result = matchRobot(answers)
    assert.deepEqual(matchRobot(answers), result)
    assert.ok(Number.isFinite(result.distance))
    for (const axis of AXES) assert.ok(result.userVector[axis] >= 0 && result.userVector[axis] <= 1)
    if (result.highlights.length === 0) assert.match(result.reason, /closest match to your mix/)
    for (const { axis, high } of result.highlights) {
      assert.ok(high ? result.userVector[axis] > 0.5 : result.userVector[axis] < 0.5)
      assert.ok(high ? result.robot.traitVector[axis] > 0.5 : result.robot.traitVector[axis] < 0.5)
    }
    paths++
  }
  assert.equal(paths, 4096)
})

test('no robot is effectively unreachable or dominates the answer space', () => {
  const counts = Object.fromEntries(QUIZ_ROBOTS.map((robot) => [robot.slug, 0]))
  let total = 0
  for (const answers of combinations()) { counts[matchRobot(answers).robot.slug]++; total++ }
  // Coverage across equally weighted combinations is not a prediction of
  // visitor behavior or a requirement for equal match frequency.
  for (const [slug, count] of Object.entries(counts)) {
    assert.ok(count / total >= 0.01, `${slug} has too few paths: ${count}`)
    assert.ok(count / total < 0.35, `${slug} dominates the quiz: ${count}`)
  }
})

test('coherent personalities lead to recognizable robot archetypes', () => {
  const scenarios = [
    ['atlas', ['warehouse', 'drills', 'anywhere', 'adapt', 'charger', 'range']],
    ['reachy-mini', ['desk', 'conversation', 'social', 'talk', 'reach', 'smarts']],
    ['neo', ['apartment', 'house', 'social', 'steady', 'loud', 'staying']],
    ['optimus', ['warehouse', 'house', 'reliable', 'power', 'overheat', 'strength']],
  ]
  for (const [expected, options] of scenarios) {
    const answers = Object.fromEntries(QUESTIONS.map((q, i) => [q.id, options[i]]))
    assert.equal(matchRobot(answers).robot.slug, expected)
  }
})

test('missing or invalid answers cannot produce a result', () => {
  const complete = combinations().next().value
  assert.throws(() => matchRobot({}), /Answer all/)
  for (const question of QUESTIONS) {
    const incomplete = { ...complete }
    delete incomplete[question.id]
    assert.throws(() => matchRobot(incomplete), /Answer all/)
    assert.throws(() => matchRobot({ ...complete, [question.id]: 'not-an-option' }), /Answer all/)
  }
})
