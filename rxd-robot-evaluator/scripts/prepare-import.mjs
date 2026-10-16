import fs from 'node:fs/promises'
import path from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { schema, protocols } from '../../frontend/scripts/rxd-runtime.mjs'
try {
 const dir = process.argv[2]
 if (!dir) throw new Error('Usage: node rxd-robot-evaluator/scripts/prepare-import.mjs <draft-directory>')
 const input = JSON.parse(await fs.readFile(path.join(dir, 'evaluation.json'), 'utf8'))
 for (const report of ['evidence.md', 'editorial-review.md', 'research-summary.md']) {
  if (!(await fs.readFile(path.join(dir, report), 'utf8')).trim()) throw new Error(`Required report is empty: ${report}`)
 }
 const robot = JSON.parse(await fs.readFile(path.join(dir, 'robot.json'), 'utf8'))
 const result = schema.validateResearchPackage(input, protocols)
 if (!result.success) throw new Error(result.errors.join('\n'))
 if (!isDeepStrictEqual(robot, result.data.robot)) throw new Error('robot.json differs from evaluation.json robot')
 await fs.writeFile(path.join(dir, 'website-package.json'), JSON.stringify(result.websitePackage, null, 2) + '\n', { flag: 'wx' })
 console.log('Prepared website-package.json for human review. Keep evaluation.json and all reports: they preserve the research envelope. No content was published or overwritten.')
} catch (error) { console.error(error.message); process.exitCode = 1 }
