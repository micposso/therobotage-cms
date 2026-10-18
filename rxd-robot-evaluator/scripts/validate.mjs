import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { schema, protocols } from '../../frontend/scripts/rxd-runtime.mjs'
import { fixtureProtocols } from '../tests/fixture-protocols.mjs'

const args = process.argv.slice(2)
const fixture = args.includes('--fixtures')
const draft = args.includes('--draft')
const file = args.find(a => !a.startsWith('--'))
if (!file) { console.error('Usage: node rxd-robot-evaluator/scripts/validate.mjs <evaluation.json> [--fixtures]'); process.exitCode = 1 }
else {
 try {
  const resolved = await fs.realpath(file)
  const exampleRoot = await fs.realpath(fileURLToPath(new URL('../examples/', import.meta.url)))
  if (fixture && path.dirname(resolved) !== exampleRoot) throw new Error('--fixtures is restricted to bundled synthetic examples; never use it for research output.')
  const input = JSON.parse(await fs.readFile(resolved, 'utf8'))
  const result = schema.validateResearchPackage(input, fixture ? [...protocols, ...fixtureProtocols(protocols)] : protocols, fixture, draft ? 'draft' : 'submission')
  if (!result.success) throw new Error(result.errors.join('\n'))
  console.log(fixture ? 'PASS — synthetic fixture only; not eligible for ingestion.' : draft ? 'PASS — research draft only; acquisition may remain unverified. Not accepted for ingestion.' : 'PASS — structurally valid pending-review package. Human citation and findings review still required.')
 } catch (error) { console.error(error.message); process.exitCode = 1 }
}
