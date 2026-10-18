import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { schema, protocols } from '../../frontend/scripts/rxd-runtime.mjs'
import { fixtureProtocols } from './fixture-protocols.mjs'
const research = JSON.parse(await fs.readFile(new URL('../examples/research-profile.example.json', import.meta.url), 'utf8'))
const observational = JSON.parse(await fs.readFile(new URL('../examples/observational-evaluation.example.json', import.meta.url), 'utf8'))
const testProtocols = [...protocols, ...fixtureProtocols(protocols)]
const check = (data: unknown) => schema.validateResearchPackage(data, testProtocols, true)
const require = createRequire(new URL('../../frontend/package.json', import.meta.url))
const Ajv = require('ajv/dist/2020').default
const addFormats = require('ajv-formats')
const mutate = (change: (data: typeof research) => void, base = research) => { const value = structuredClone(base); change(value); return value }
test('commercially verified synthetic research metadata passes with null scores', () => assert.equal(check(research).success, true))
test('prototype rejected', () => assert.equal(check(mutate(p => { p.robot.commerciallyReleased = false })).success, false))
test('missing purchase pathway rejected', () => assert.equal(check(mutate(p => { p.robot.acquisition.url = null })).success, false))
test('preorder without fulfillment evidence rejected', () => assert.equal(check(mutate(p => { p.research.fulfillmentConfirmed = false })).success, false))
test('scored assessment requires evidence', () => assert.equal(check(mutate(p => { p.evaluation.dimensions[0].evidenceIds = [] }, observational)).success, false))
test('invalid evidence IDs rejected', () => assert.equal(check(mutate(p => { p.evaluation.dimensions[0].evidenceIds = ['invented'] }, observational)).success, false))
test('partial overall score rejected', () => assert.equal(check(mutate(p => { p.research.overallScore = 3 }, observational)).success, false))
test('insufficient evidence with a number rejected', () => assert.equal(check(mutate(p => { p.evaluation.dimensions[2].score = 2 }, observational)).success, false))
test('out-of-range and fractional scores rejected', () => { for (const score of [0, 6, 2.5]) assert.equal(check(mutate(p => { p.evaluation.dimensions[0].score = score }, observational)).success, false) })
test('hands-on without conditions/trials rejected', () => assert.equal(check(mutate(p => { p.evaluation.classification = 'hands-on' })).success, false))
test('partial observational example passes isolated fixture validation', () => assert.equal(check(observational).success, true))
test('fixtures cannot pass production submission', () => { assert.equal(schema.validateResearchPackage(research, protocols).success, false); assert.equal(schema.validateResearchPackage(observational, protocols).success, false) })
test('current draft protocols prevent real scoring', () => {
 const input = mutate(p => { p.research.synthetic = false; p.evaluation.dimensions[0].protocolId = protocols[0].id }, observational)
 assert.equal(schema.validateResearchPackage(input, protocols).success, false)
})
test('manufacturer promotion alone cannot justify a score', () => assert.equal(check(mutate(p => { p.evidence[1].independence = 'manufacturer-controlled' }, observational)).success, false))
test('unknown methodology and protocol versions rejected', () => {
 assert.equal(check(mutate(p => { p.evaluation.methodologyVersion = '99' })).success, false)
 assert.equal(check(mutate(p => { p.evaluation.dimensions[0].protocolVersion = '99' })).success, false)
})
test('duplicate dimensions and source IDs rejected', () => {
 assert.equal(check(mutate(p => { p.evaluation.dimensions[1] = p.evaluation.dimensions[0] })).success, false)
 assert.equal(check(mutate(p => { p.evidence.push(p.evidence[0]) })).success, false)
})
test('complete structurally valid evaluation requires independent failure and participant evidence', () => {
 const full = mutate(p => {
  p.evidence[1].demonstratesFailure = true
  p.evaluation.dimensions = p.evaluation.dimensions.map((d: typeof p.evaluation.dimensions[0], i: number) => ({ ...d, status: 'assessed', score: 3, method: 'observational', evidenceQuality: 'moderate', protocolId: fixtureProtocols(protocols)[i].id, evidenceIds: ['observation'], observations: ['Synthetic test finding'], evaluatorNotes: 'Synthetic rubric justification' }))
  p.research.coverage.assessed = 6
 }, observational)
 assert.equal(check(full).success, true)
 const { research: envelope, ...website } = full
 assert.equal(schema.evaluationSummary(website, testProtocols).overall, null)
 website.evaluation.review = { state: 'approved', reviewer: 'Synthetic reviewer', date: '2026-01-02', notes: 'Test-only approval' }
 assert.equal(schema.evaluationSummary(website, testProtocols).overall, 3)
 website.evidence[1].demonstratesFailure = false
 assert.equal(schema.evaluationSummary(website, testProtocols).overall, null)
})
test('source authenticity is not inferred from a syntactically valid URL', () => {
 const input = mutate(p => { p.evidence[0].url = 'https://example.org/not-retrieved' })
 assert.equal(check(input).success, true) // Human source verification remains mandatory.
})
test('published historical files and scores preserved', async () => {
 for (const [slug, expected] of [['reachy-mini', '3.0'], ['unitree-go2-pro', '2.33']]) {
  const content = await fs.readFile(new URL(`../../frontend/src/content/scores/${slug}.md`, import.meta.url), 'utf8')
  assert.match(content, new RegExp(`compositeScore: ${expected.replace('.', '\\.')}`))
 }
})
test('JSON schemas compile independently and accept both synthetic examples', async () => {
 const ajv = new Ajv({ strict: false, allErrors: true }); addFormats(ajv)
 const robot = ajv.compile(JSON.parse(await fs.readFile(new URL('../schemas/robot.schema.json', import.meta.url), 'utf8')))
 const evaluate = ajv.compile(JSON.parse(await fs.readFile(new URL('../schemas/evaluation.schema.json', import.meta.url), 'utf8')))
 for (const example of [research, observational]) { assert.equal(robot(example.robot), true, JSON.stringify(robot.errors)); assert.equal(evaluate(example), true, JSON.stringify(evaluate.errors)) }
 assert.equal(evaluate(mutate(p => { p.research.overallScore = 4 }, observational)), false)
 assert.equal(evaluate(mutate(p => { p.evaluation.dimensions[0].evidenceIds = [] }, observational)), false)
 assert.equal(evaluate(mutate(p => { p.evidence[0].accessedAt = '2026-02-31' })), false)
})
test('unverified research can be saved as a draft but cannot be submitted', () => {
 const draft = mutate(p => { p.robot.availability = 'unverified'; p.robot.acquisition = { ...p.robot.acquisition, channel: null, url: null, verifiedAt: null, evidenceIds: [] }; p.research.fulfillmentConfirmed = false; p.research.fulfillmentEvidenceIds = [] })
 assert.equal(schema.validateResearchPackage(draft, protocols, true, 'draft').success, true)
 assert.equal(check(draft).success, false)
})
test('documentary-only evidence cannot claim observational method', () => assert.equal(check(mutate(p => { p.evaluation.classification = 'observational'; p.evaluation.dimensions.forEach((d: typeof p.evaluation.dimensions[0]) => { d.method = 'observational' }) })).success, false))
test('pending drafts cannot claim review approval or orphan protocol versions', () => {
 assert.equal(check(mutate(p => { p.evaluation.review.reviewer = 'Someone' })).success, false)
 assert.equal(check(mutate(p => { p.evaluation.dimensions[0].protocolId = null })).success, false)
})
test('documented coverage is independent of scored coverage', () => {
 assert.equal(research.research.coverage.documented, 6)
 assert.equal(research.research.coverage.assessed, 0)
 assert.equal(check(mutate(p => { p.research.coverage.documented = 0 })).success, false)
})
test('prepare-import validates companion reports, produces deterministic draft and refuses overwrite', async () => {
 const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'rxd-validator-test-'))
 const script = fileURLToPath(new URL('../scripts/prepare-import.mjs', import.meta.url))
 try {
  const input = structuredClone(research); input.research.synthetic = false // Test input only; not a researched product.
  await fs.writeFile(path.join(directory, 'evaluation.json'), JSON.stringify(input))
  await fs.writeFile(path.join(directory, 'robot.json'), JSON.stringify(input.robot))
  assert.throws(() => execFileSync(process.execPath, [script, directory], { stdio: 'pipe' }))
  for (const report of ['evidence.md', 'editorial-review.md', 'research-summary.md']) await fs.writeFile(path.join(directory, report), 'Synthetic integration test; never published.')
  execFileSync(process.execPath, [script, directory], { stdio: 'pipe' })
  const output = JSON.parse(await fs.readFile(path.join(directory, 'website-package.json'), 'utf8'))
  const { research: envelope, ...expected } = input
  assert.deepEqual(output, expected)
  assert.equal(output.evaluation.review.state, 'pending')
  assert.throws(() => execFileSync(process.execPath, [script, directory], { stdio: 'pipe' }))
 } finally { assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir())); assert.ok(path.basename(directory).startsWith('rxd-validator-test-')); await fs.rm(directory, { recursive: true, force: true }) }
})
