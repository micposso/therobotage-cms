import { z } from 'zod'

export const METHODOLOGY_VERSION = '1.0' as const
export const dimensionIds = ['signal', 'spatial', 'presence', 'failure', 'fit', 'recovery'] as const
export const dimensionNames = ['Signal Clarity', 'Spatial Legibility', 'Perceived Presence', 'Failure Transparency', 'Interaction Fit', 'Recovery Design'] as const
export const assessmentMethods = ['research', 'observational', 'hands-on'] as const
export const availabilityStatuses = ['purchase', 'quotation', 'temporary', 'unverified', 'archived'] as const
export const deploymentStatuses = ['consumer', 'commercial', 'integration', 'developer'] as const
const text = z.string().trim().min(1)
const date = z.iso.date()
const url = z.url({ protocol: /^https?$/ })
const refs = z.array(text)
const dimension = z.enum(dimensionIds)
const review = z.strictObject({ state: z.enum(['draft', 'pending', 'approved', 'rejected']), reviewer: text.nullable(), date: date.nullable(), notes: z.string() })

export const RobotSchema = z.strictObject({
  id: text, manufacturer: text, model: text, category: text, applications: z.array(text).min(1), physicalFunction: text,
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(), variant: text.nullable().optional(), description: text.optional(),
  imagery: z.array(z.strictObject({ url, alt: text, sourceEvidenceIds: refs })).optional(),
  editorialStatus: z.enum(['draft', 'pending', 'approved', 'archived']).optional(), createdAt: date.optional(), updatedAt: date.optional(),
  commerciallyReleased: z.boolean(), physical: z.boolean(), humanInteraction: text, ownershipAvailable: z.boolean(),
  availability: z.enum(availabilityStatuses), deployment: z.enum(deploymentStatuses), prerequisites: z.array(text),
  acquisition: z.strictObject({ channel: z.enum(['manufacturer', 'retailer', 'distributor', 'enterprise-quotation', 'integrator']).nullable(), url: url.nullable(), verifiedAt: date.nullable(), evidenceIds: refs, region: text, notes: text }),
  specifications: z.array(z.strictObject({ name: text, value: text.nullable(), evidenceIds: refs })),
})
export const EvidenceSchema = z.strictObject({
  id: text, title: text, url, publicationDate: date.nullable(), accessedAt: date,
  provenance: z.enum(['manufacturer-documentation', 'manufacturer-demonstration', 'independent-video', 'third-party-research', 'operator-interview', 'firsthand-testing', 'historical-editorial']),
  independence: z.enum(['manufacturer-controlled', 'independent', 'undisclosed']),
  context: text, locator: text, observations: z.array(text).min(1), limitations: z.array(text).min(1),
  demonstratesFailure: z.boolean(), participantEvidence: z.boolean(),
  publisher: text.optional(), robotId: text.optional(), dimensions: z.array(dimension).optional(),
  claimType: z.enum(['claim', 'observation', 'measurement', 'testimonial']).optional(),
})
export const DimensionAssessmentSchema = z.strictObject({
  dimension, status: z.enum(['not-assessed', 'insufficient', 'assessed']), score: z.number().int().min(1).max(5).nullable(),
  evidenceQuality: z.enum(['low', 'moderate', 'high']).nullable(), method: z.enum(assessmentMethods),
  protocolId: text.nullable(), protocolVersion: text.nullable(), evidenceIds: refs,
  observations: z.array(text), limitations: z.array(text).min(1), evaluatorNotes: z.string(),
})
export const TrialSchema = z.strictObject({
  id: text, protocolId: text, protocolVersion: text, scenario: text, operator: text, participants: z.array(text),
  environment: text, conditions: text, date, repetition: z.number().int().positive(),
  task: text, successCriterion: text, failureCriterion: text,
  result: z.enum(['success', 'failure', 'aborted']), observedBehavior: text, intervention: text,
  participantFeedback: z.string(), evidenceIds: refs, notes: z.string(),
})
export const RevisionSchema = z.strictObject({ previousVersion: text.nullable(), version: text, date, reviewer: text.nullable(), description: text, reason: text })
export const ProtocolSchema = z.strictObject({
  id: text, dimension, version: text, scenarioName: text, categories: z.array(text).min(1),
  objective: text, setup: z.array(text).min(1), instructions: z.array(text).min(1),
  observableMeasures: z.array(text).min(1), measurementApproach: text,
  evidenceRequirements: z.array(text).min(1), minimumEvidence: text, environmentalConsiderations: text,
  repetitionGuidance: text, successCriterion: text, failureCriterion: text,
  rubricReference: text, scoringCriteria: z.array(text).min(1), limitations: z.array(text).min(1), review,
})
export const EvaluationSchema = z.strictObject({
  id: text, version: text, robotId: text, methodologyVersion: z.literal(METHODOLOGY_VERSION),
  classification: z.enum(assessmentMethods), date: date.nullable(), evaluator: text.nullable(),
  firmware: text.nullable(), configuration: text, environment: text, participants: z.array(text),
  dimensions: z.array(DimensionAssessmentSchema).length(6), findings: z.array(text), limitations: z.array(text).min(1),
  trials: z.array(TrialSchema), review, aiAssisted: z.boolean(),
  disclosures: z.strictObject({ payment: text, relationships: text, manufacturerParticipation: text }),
})
export const PackageSchema = z.strictObject({
  schemaVersion: z.literal('1.0'), robot: RobotSchema, evaluation: EvaluationSchema,
  evidence: z.array(EvidenceSchema), revisions: z.array(RevisionSchema),
})
export type Robot = z.infer<typeof RobotSchema>
export type RXDEvaluation = z.infer<typeof EvaluationSchema>
export type RXDDimensionAssessment = z.infer<typeof DimensionAssessmentSchema>
export type RXDProtocol = z.infer<typeof ProtocolSchema>
export type RXDEvidence = z.infer<typeof EvidenceSchema>
export type RXDTrial = z.infer<typeof TrialSchema>
export type RXDRevision = z.infer<typeof RevisionSchema>
export type RXDPackage = z.infer<typeof PackageSchema>

export function eligibleRobot(robot: Robot, evidence: RXDEvidence[]): boolean {
  return robot.physical && robot.commerciallyReleased && robot.ownershipAvailable &&
    !!robot.acquisition.channel && !!robot.acquisition.url && !!robot.acquisition.verifiedAt &&
    robot.acquisition.evidenceIds.length > 0 && robot.acquisition.evidenceIds.every(id => evidence.some(e => e.id === id))
}

/** Semantic checks complement the exported structural JSON Schema. Protocols are trusted repository data, never supplied by an importer. */
export function validatePackage(input: unknown, protocols: RXDProtocol[], mode: 'draft' | 'submission' | 'publication' = 'draft') {
  const parsed = PackageSchema.safeParse(input)
  if (!parsed.success) return { success: false as const, errors: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`) }
  const data = parsed.data
  const { robot, evaluation: e, evidence } = data
  const errors: string[] = []
  const fail = (message: string) => errors.push(message)
  const unique = (values: string[], label: string) => { if (new Set(values).size !== values.length) fail(`Duplicate ${label}`) }
  unique(evidence.map(x => x.id), 'evidence IDs')
  unique(e.dimensions.map(x => x.dimension), 'dimensions')
  unique(e.trials.map(x => x.id), 'trial IDs')
  if (e.robotId !== robot.id) fail('Evaluation robotId does not match robot')
  if (e.classification === 'observational' && !evidence.some(source => ['manufacturer-demonstration', 'independent-video', 'third-party-research', 'operator-interview', 'firsthand-testing'].includes(source.provenance))) fail('Observational classification requires contextual behavioral evidence, not product documentation alone')
  const checkRefs = (ids: string[]) => { for (const id of ids) if (!evidence.some(x => x.id === id)) fail(`Unresolved evidence: ${id}`) }
  checkRefs(robot.acquisition.evidenceIds)
  robot.specifications.forEach(s => checkRefs(s.evidenceIds))
  if (['purchase', 'quotation'].includes(robot.availability) && !eligibleRobot(robot, evidence)) fail('Availability requires released physical product and dated acquisition evidence')
  if (robot.acquisition.verifiedAt && !evidence.some(x => robot.acquisition.evidenceIds.includes(x.id) && x.accessedAt === robot.acquisition.verifiedAt)) fail('Availability verification date must match a supporting source access date')
  for (const d of e.dimensions) {
    checkRefs(d.evidenceIds)
    if (d.method !== e.classification) fail(`${d.dimension}: method mismatch`)
    if ((d.protocolId === null) !== (d.protocolVersion === null)) fail(`${d.dimension}: protocol ID and version must be supplied together`)
    if ((d.status === 'assessed') !== (d.score !== null)) fail(`${d.dimension}: assessed status and score must agree`)
    if (d.protocolId && !protocols.some(p => p.id === d.protocolId && p.version === d.protocolVersion && p.dimension === d.dimension)) fail(`${d.dimension}: unknown protocol or version`)
    if (d.score === null) continue
    if (e.classification === 'research') fail('Research profiles cannot contain scores')
    const p = protocols.find(p => p.id === d.protocolId && p.version === d.protocolVersion)
    if (!p || p.review.state !== 'approved' || !p.review.reviewer || !p.review.date) fail(`${d.dimension}: scoring requires a human-approved protocol`)
    if (!d.observations.length || !d.evidenceIds.length || !d.evidenceQuality || !d.evaluatorNotes.trim()) fail(`${d.dimension}: scored dimensions require observations, evidence, quality and justification`)
    const sources = evidence.filter(x => d.evidenceIds.includes(x.id))
    if (!sources.some(x => x.independence === 'independent' && !['manufacturer-documentation', 'manufacturer-demonstration', 'historical-editorial'].includes(x.provenance))) fail(`${d.dimension}: manufacturer claims or historical summaries alone cannot justify a score`)
    if (['failure', 'recovery'].includes(d.dimension) && !sources.some(x => x.demonstratesFailure)) fail(`${d.dimension}: breakdown evidence required`)
    if (['signal', 'presence'].includes(d.dimension) && !sources.some(x => x.participantEvidence)) fail(`${d.dimension}: human interpretation evidence required`)
    if (e.classification === 'hands-on' && !e.trials.some(t => t.protocolId === d.protocolId && t.protocolVersion === d.protocolVersion && t.evidenceIds.some(id => d.evidenceIds.includes(id)))) fail(`${d.dimension}: linked firsthand trial required`)
  }
  for (const t of e.trials) {
    checkRefs(t.evidenceIds)
    if (!protocols.some(p => p.id === t.protocolId && p.version === t.protocolVersion)) fail(`Trial ${t.id}: unknown protocol`)
    if (!t.evidenceIds.length) fail(`Trial ${t.id}: evidence required`)
    if (!evidence.some(source => t.evidenceIds.includes(source.id) && source.provenance === 'firsthand-testing')) fail(`Trial ${t.id}: firsthand test source required`)
  }
  unique(e.trials.map(t => `${t.protocolId}/${t.scenario}/${t.operator}/${t.repetition}`), 'trial repetitions')
  if (e.classification !== 'hands-on' && e.trials.length) fail('Firsthand trial records require hands-on classification')
  if (e.classification === 'hands-on' && (!e.trials.length || !e.firmware || !e.participants.length || !e.date || !e.evaluator)) fail('Hands-on records require trials, firmware, participants, date and evaluator')
  if (e.review.state === 'approved' && (!e.review.reviewer || !e.review.date)) fail('Approval requires human reviewer and date')
  if (mode === 'submission' && e.review.state !== 'pending') fail('Imports must be pending human review')
  if (mode === 'submission' && (!eligibleRobot(robot, evidence) || !['purchase', 'quotation'].includes(robot.availability))) fail('New index submissions require verified current commercial acquisition')
  if (mode === 'publication') {
    if (!eligibleRobot(robot, evidence)) fail('New publication requires verified commercial eligibility')
    if (e.review.state !== 'approved' || !e.review.reviewer || !e.review.date) fail('Publication requires human approval')
    if (!e.date || !e.evaluator) fail('Publication requires evaluation date and evaluator')
    if (!data.revisions.length) fail('Publication requires a revision record')
  }
  return errors.length ? { success: false as const, errors } : { success: true as const, data }
}

/** Additive research envelope; stripping `research` is the deterministic website conversion. */
export const ResearchPackageSchema = PackageSchema.extend({
  robot: RobotSchema.extend({ slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), variant: text.nullable(), description: text,
    imagery: z.array(z.strictObject({ url, alt: text, sourceEvidenceIds: refs })), editorialStatus: z.literal('pending'), createdAt: date, updatedAt: date }),
  research: z.strictObject({
    synthetic: z.boolean(), question: text, date, evaluatorId: text, gaps: z.array(text), editorialNotes: z.array(text),
    fulfillmentConfirmed: z.boolean(), fulfillmentEvidenceIds: refs,
    sourceDecisions: z.array(z.strictObject({ url, decision: z.enum(['included', 'excluded']), reason: text })),
    disagreements: z.array(text), finalDecision: z.literal('pending'),
    overallScore: z.number().min(1).max(5).nullable(), coverage: z.strictObject({ documented: z.number().int().min(0).max(6), assessed: z.number().int().min(0).max(6), total: z.literal(6) }),
  }),
})
export type ResearchPackage = z.infer<typeof ResearchPackageSchema>
export function validateResearchPackage(input: unknown, protocols: RXDProtocol[], allowSynthetic = false, mode: 'draft' | 'submission' = 'submission') {
  const parsed = ResearchPackageSchema.safeParse(input)
  if (!parsed.success) return { success: false as const, errors: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`) }
  const { research, ...data } = parsed.data
  const checked = validatePackage(data, protocols, mode)
  const errors = checked.success ? [] : [...checked.errors]
  if (research.synthetic && !allowSynthetic) errors.push('Synthetic fixtures cannot enter the index')
  if (mode === 'submission' && (!research.fulfillmentConfirmed || !research.fulfillmentEvidenceIds.length)) errors.push('Confirmed commercial fulfillment evidence required; preorder alone is insufficient')
  if (data.evaluation.review.state !== 'pending' || data.evaluation.review.reviewer !== null || data.evaluation.review.date !== null) errors.push('Research exports require pending review with no claimed reviewer or approval date')
  if (research.fulfillmentEvidenceIds.some(id => !data.evidence.some(e => e.id === id))) errors.push('Unresolved fulfillment evidence')
  if (data.robot.slug !== data.robot.id) errors.push('Canonical slug must match robot ID')
  if (data.robot.updatedAt < data.robot.createdAt) errors.push('Updated date precedes creation')
  if (data.evaluation.date !== research.date || data.evaluation.evaluator !== research.evaluatorId) errors.push('Research and evaluation identity/date must match')
  if (research.overallScore !== null) errors.push('Pending-review research exports cannot assert an overall score')
  if (research.coverage.assessed !== data.evaluation.dimensions.filter(d => d.status === 'assessed').length) errors.push('Coverage mismatch')
  if (research.coverage.documented !== data.evaluation.dimensions.filter(d => d.observations.length && d.evidenceIds.length).length) errors.push('Documented evidence coverage mismatch')
  for (const e of data.evidence) {
    if (!e.publisher || e.robotId !== data.robot.id || !e.dimensions || !e.claimType) errors.push(`Evidence ${e.id}: publisher, matching model ID, dimensions and claim type required`)
  }
  for (const image of data.robot.imagery) if (!image.sourceEvidenceIds.length || image.sourceEvidenceIds.some(id => !data.evidence.some(e => e.id === id))) errors.push('Imagery requires resolving source references')
  return errors.length ? { success: false as const, errors } : { success: true as const, data: parsed.data, websitePackage: data }
}

export function evaluationSummary(data: RXDPackage, protocols: RXDProtocol[]) {
  const assessed = data.evaluation.dimensions.filter(d => d.status === 'assessed' && d.score !== null).length
  const valid = validatePackage(data, protocols, 'publication').success
  return { assessed, documented: data.evaluation.dimensions.filter(d => d.observations.length && d.evidenceIds.length).length, total: 6, overall: valid && assessed === 6 && data.evaluation.classification !== 'research'
    ? data.evaluation.dimensions.reduce((sum, d) => sum + d.score!, 0) / 6 : null }
}
