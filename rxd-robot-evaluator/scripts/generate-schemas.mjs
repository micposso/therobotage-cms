import fs from 'node:fs/promises'
import { schema, z } from '../../frontend/scripts/rxd-runtime.mjs'
const directory = new URL('../schemas/', import.meta.url)
await fs.mkdir(directory, { recursive: true })
const exportSchema = (value, title) => ({ ...z.toJSONSchema(value, { target: 'draft-2020-12' }), title, $comment: 'GENERATED from frontend/src/lib/rxd/schema.ts. Run generate-schemas.mjs; do not hand-edit. Semantic validation is mandatory.' })
const robot = exportSchema(schema.ResearchPackageSchema.shape.robot, 'RXD Robot 1.0')
robot.allOf = [{ if: { properties: { availability: { enum: ['purchase', 'quotation'] } } }, then: { properties: { physical: { const: true }, commerciallyReleased: { const: true }, ownershipAvailable: { const: true }, acquisition: { properties: { channel: { type: 'string' }, url: { type: 'string', format: 'uri' }, verifiedAt: { type: 'string', format: 'date' }, evidenceIds: { minItems: 1 } } } } } }]
const evaluation = exportSchema(schema.ResearchPackageSchema, 'RXD Evaluation Research Package 1.0')
evaluation.properties.robot = robot
evaluation.properties.research.properties.overallScore = { type: 'null', description: 'Draft packages cannot assert an approved aggregate. Compute after human approval through evaluationSummary.' }
const dim = evaluation.properties.evaluation.properties.dimensions.items
dim.allOf = [{ if: { properties: { status: { const: 'assessed' } } }, then: { properties: { score: { type: 'integer', minimum: 1, maximum: 5 }, evidenceIds: { minItems: 1 }, observations: { minItems: 1 }, evidenceQuality: { enum: ['low', 'moderate', 'high'] }, protocolId: { type: 'string', minLength: 1 }, protocolVersion: { type: 'string', minLength: 1 } } }, else: { properties: { score: { type: 'null' } } } }]
evaluation.properties.evaluation.allOf = [
 { if: { properties: { classification: { const: 'research' } } }, then: { properties: { dimensions: { items: { properties: { score: { type: 'null' }, status: { enum: ['not-assessed', 'insufficient'] } } } } } } },
 { if: { properties: { classification: { const: 'hands-on' } } }, then: { properties: { trials: { minItems: 1 }, firmware: { type: 'string', minLength: 1 }, evaluator: { type: 'string', minLength: 1 }, participants: { minItems: 1 }, date: { type: 'string', format: 'date' } } } },
]
for (const [name, data] of [['robot', robot], ['evaluation', evaluation]]) await fs.writeFile(new URL(`${name}.schema.json`, directory), JSON.stringify(data, null, 2) + '\n')
await fs.mkdir(new URL('../../docs/rxd/', import.meta.url), { recursive: true })
console.log('Generated robot and evaluation schemas from the website contract (JSON Schema 2020-12).')
