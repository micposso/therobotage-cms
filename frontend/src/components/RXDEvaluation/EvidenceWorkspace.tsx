'use client'
import { useState } from 'react'
import { useCopy } from '@/lib/i18n/useCopy'
import { protocols, methodLabels } from '@/lib/rxd/registry'
import { dimensionIds, dimensionNames, validatePackage, type RXDEvidence, type RXDTrial, type RXDDimensionAssessment, type RXDPackage } from '@/lib/rxd/schema'
import styles from './RXDEvaluation.module.css'

const emptyDimensions = (): RXDDimensionAssessment[] => dimensionIds.map((dimension, i) => ({ dimension, status: 'not-assessed', score: null, evidenceQuality: null, method: 'research', protocolId: protocols[i].id, protocolVersion: protocols[i].version, evidenceIds: [], observations: [], limitations: ['Evidence not yet documented'], evaluatorNotes: '' }))
export default function EvidenceWorkspace() {
 const { t } = useCopy()
 const [meta, setMeta] = useState({ id: '', manufacturer: '', model: '', category: '', application: '', date: '', evaluator: '', firmware: '', context: '', participants: '', limitations: '', payment: '', relationships: '', participation: '' })
 const [method, setMethod] = useState<'research' | 'observational' | 'hands-on'>('research')
 const [evidence, setEvidence] = useState<RXDEvidence[]>([])
 const [trials, setTrials] = useState<RXDTrial[]>([])
 const [dimensions, setDimensions] = useState(emptyDimensions)
 const [errors, setErrors] = useState<string[]>([])
 const [message, setMessage] = useState('')
 const lines = (value: string) => value.split('\n').map(s => s.trim()).filter(Boolean)
 const field = (label: string, value: string, change: (v: string) => void, type = 'text') => <label key={label}>{t(label)}<input type={type} value={value} onChange={e => change(e.target.value)} /></label>
 const area = (label: string, value: string, change: (v: string) => void) => <label key={label}>{t(label)}<textarea value={value} onChange={e => change(e.target.value)} /></label>
 const editEvidence = (i: number, patch: Partial<RXDEvidence>) => setEvidence(evidence.map((e, n) => n === i ? { ...e, ...patch } : e))
 const editTrial = (i: number, patch: Partial<RXDTrial>) => setTrials(trials.map((e, n) => n === i ? { ...e, ...patch } : e))
 const editDimension = (i: number, patch: Partial<RXDDimensionAssessment>) => setDimensions(dimensions.map((d, n) => n === i ? { ...d, ...patch } : d))
 function exportDraft() {
  const data: RXDPackage = { schemaVersion: '1.0', robot: { id: meta.id, model: meta.model, manufacturer: meta.manufacturer, category: meta.category, applications: lines(meta.application), physicalFunction: meta.context, physical: true, commerciallyReleased: false, ownershipAvailable: false, humanInteraction: meta.context, availability: 'unverified', deployment: 'integration', prerequisites: [], acquisition: { channel: null, url: null, verifiedAt: null, evidenceIds: [], region: 'Not verified', notes: 'Scorecard draft; commercial eligibility must be researched before index submission.' }, specifications: [] },
   evaluation: { id: meta.id + '-draft', version: '1', robotId: meta.id, methodologyVersion: '1.0', classification: method, date: meta.date || null, evaluator: meta.evaluator || null, firmware: meta.firmware || null, configuration: meta.context, environment: meta.context, participants: lines(meta.participants), dimensions: dimensions.map(d => ({ ...d, method })), findings: dimensions.flatMap(d => d.observations), limitations: lines(meta.limitations), trials: method === 'hands-on' ? trials : [], review: { state: 'pending', reviewer: null, date: null, notes: 'User-authored draft; no publication approval.' }, aiAssisted: false, disclosures: { payment: meta.payment, relationships: meta.relationships, manufacturerParticipation: meta.participation } }, evidence, revisions: [] }
  const checked = validatePackage(data, protocols)
  if (!checked.success) { setErrors(checked.errors); setMessage(''); return }
  setErrors([])
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = meta.id.replace(/[^a-z0-9-]/gi, '-') + '-evaluation-draft.json'; a.click(); URL.revokeObjectURL(url)
  setMessage('Draft downloaded. Commercial eligibility and human review are required before publication.')
 }
 return <section className={styles.section}><div className={styles.inner}>
  <h2>{t('Evidence-based assessment workspace')}</h2><p>{t('Record what you can support. Missing evidence stays unscored. This workspace exports drafts and never publishes.')}</p>
  <p className={styles.notice}>{t('Methodology 1.0 · Protocols are awaiting review. Numerical scoring is unavailable until the applicable protocol is approved.')}</p>
  <div className={styles.form}>
   <div className={styles.fields}>{Object.entries(meta).map(([key, value]) => field(({ id: 'Robot identifier', manufacturer: 'Manufacturer', model: 'Exact model and variant', category: 'Robot category', application: 'Applications', date: 'Evaluation date', evaluator: 'Evaluator', firmware: 'Software / firmware version', context: 'Configuration and environment', participants: 'Participants and roles', limitations: 'Evaluation limitations', payment: 'Payment disclosure', relationships: 'Manufacturer relationships', participation: 'Manufacturer participation' } as Record<string,string>)[key], value, v => setMeta({ ...meta, [key]: v }), key === 'date' ? 'date' : 'text'))}</div>
   <label>{t('Assessment classification')}<select aria-label={t('Assessment classification')} value={method} onChange={e => { const next = e.target.value as typeof method; setMethod(next); setDimensions(dimensions.map(d => ({ ...d, method: next, status: d.status === 'assessed' ? 'not-assessed' : d.status, score: null }))) }}>{(['research', 'observational', 'hands-on'] as const).map(m => <option key={m} value={m}>{t(methodLabels[m])}</option>)}</select></label>
   <h3>{t('Evidence records')}</h3>
   {evidence.map((e, i) => <fieldset key={e.id}><legend>{e.id}</legend><div className={styles.fields}>
    {field('Title', e.title, v => editEvidence(i, { title: v }))}{field('Source URL', e.url, v => editEvidence(i, { url: v }), 'url')}
    {field('Publication date', e.publicationDate || '', v => editEvidence(i, { publicationDate: v || null }), 'date')}{field('Access date', e.accessedAt, v => editEvidence(i, { accessedAt: v }), 'date')}
    <label>{t('Source type')}<select aria-label={t('Source type')} value={e.provenance} onChange={v => editEvidence(i, { provenance: v.target.value as RXDEvidence['provenance'] })}>{['manufacturer-documentation', 'manufacturer-demonstration', 'independent-video', 'third-party-research', 'operator-interview', 'firsthand-testing'].map(v => <option key={v} value={v}>{t(v)}</option>)}</select></label>
    <label>{t('Independence')}<select aria-label={t('Independence')} value={e.independence} onChange={v => editEvidence(i, { independence: v.target.value as RXDEvidence['independence'] })}>{['manufacturer-controlled', 'independent', 'undisclosed'].map(v => <option key={v} value={v}>{t(v)}</option>)}</select></label>
    {field('Context', e.context, v => editEvidence(i, { context: v }))}{field('Page or timestamp locator', e.locator, v => editEvidence(i, { locator: v }))}
    {area('Observed findings', e.observations.join('\n'), v => editEvidence(i, { observations: lines(v) }))}{area('Evidence limitations', e.limitations.join('\n'), v => editEvidence(i, { limitations: lines(v) }))}
    <label>{t('Documents an actual failure')}<select aria-label={t('Documents an actual failure')} value={String(e.demonstratesFailure)} onChange={v => editEvidence(i, { demonstratesFailure: v.target.value === 'true' })}><option value="false">{t('No')}</option><option value="true">{t('Yes')}</option></select></label>
    <label>{t('Contains participant evidence')}<select aria-label={t('Contains participant evidence')} value={String(e.participantEvidence)} onChange={v => editEvidence(i, { participantEvidence: v.target.value === 'true' })}><option value="false">{t('No')}</option><option value="true">{t('Yes')}</option></select></label>
   </div><button type="button" onClick={() => setEvidence(evidence.filter((_, n) => n !== i))}>{t('Remove evidence')}</button></fieldset>)}
   <button type="button" onClick={() => setEvidence([...evidence, { id: 'e-' + crypto.randomUUID(), title: '', url: '', publicationDate: null, accessedAt: meta.date, provenance: 'manufacturer-documentation', independence: 'manufacturer-controlled', context: '', locator: '', observations: [], limitations: [], demonstratesFailure: false, participantEvidence: false }])}>{t('Add evidence')}</button>
   <h3>{t('Dimension assessments')}</h3>
   {dimensions.map((d, i) => <details key={d.dimension}><summary>{t(dimensionNames[i])} · {t(d.status)}</summary><div>
    <p>{d.protocolId} · {d.protocolVersion} · {t('Draft — human review required')}</p>
    <div className={styles.fields}>
     <label>{t('Assessment status')}<select aria-label={t('Assessment status')} value={d.status} onChange={e => editDimension(i, { status: e.target.value as RXDDimensionAssessment['status'], score: null })}><option value="not-assessed">{t('Not assessed')}</option><option value="insufficient">{t('Insufficient evidence')}</option><option value="assessed" disabled={method === 'research' || protocols[i].review.state !== 'approved'}>{t('Assessed')}</option></select></label>
     <label>{t('Evidence quality')}<select aria-label={t('Evidence quality')} value={d.evidenceQuality || ''} onChange={e => editDimension(i, { evidenceQuality: (e.target.value || null) as RXDDimensionAssessment['evidenceQuality'] })}><option value="">{t('Not assessed')}</option>{['low', 'moderate', 'high'].map(q => <option key={q} value={q}>{t(q)}</option>)}</select></label>
     <label>{t('Score (1–5)')}<input type="number" min="1" max="5" step="1" disabled={d.status !== 'assessed'} value={d.score ?? ''} onChange={e => editDimension(i, { score: e.target.value ? Number(e.target.value) : null })} /></label>
     <label>{t('Supporting evidence')}<select aria-label={t('Supporting evidence')} multiple value={d.evidenceIds} onChange={e => editDimension(i, { evidenceIds: Array.from(e.target.selectedOptions, o => o.value) })}>{evidence.map(e => <option key={e.id} value={e.id}>{e.title || e.id}</option>)}</select></label>
     {area('Observed findings', d.observations.join('\n'), v => editDimension(i, { observations: lines(v) }))}{area('Limitations', d.limitations.join('\n'), v => editDimension(i, { limitations: lines(v) }))}{area('Scoring justification / evaluator notes', d.evaluatorNotes, v => editDimension(i, { evaluatorNotes: v }))}
    </div>
   </div></details>)}
   {method === 'hands-on' && <><h3>{t('Trial records')}</h3><p>{t('Record every attempt, including failures and interventions. One success is not proof of reliability.')}</p>
    {trials.map((trial, i) => <fieldset key={trial.id}><legend>{t('Trial')} {i + 1}</legend><div className={styles.fields}>
     <label>{t('Protocol')}<select aria-label={t('Protocol')} value={trial.protocolId} onChange={e => editTrial(i, { protocolId: e.target.value })}>{protocols.map(p => <option key={p.id}>{p.id}</option>)}</select></label>
     {(['scenario', 'operator', 'environment', 'conditions', 'task', 'successCriterion', 'failureCriterion', 'observedBehavior', 'intervention', 'participantFeedback', 'notes'] as const).map(key => field(key, trial[key], v => editTrial(i, { [key]: v })))}
     {field('Trial date', trial.date, v => editTrial(i, { date: v }), 'date')}{field('Repetition number', String(trial.repetition), v => editTrial(i, { repetition: Number(v) }), 'number')}
     <label>{t('Result')}<select aria-label={t('Result')} value={trial.result} onChange={e => editTrial(i, { result: e.target.value as RXDTrial['result'] })}>{['success', 'failure', 'aborted'].map(v => <option key={v} value={v}>{t(v)}</option>)}</select></label>
     <label>{t('Supporting evidence')}<select aria-label={t('Supporting evidence')} multiple value={trial.evidenceIds} onChange={e => editTrial(i, { evidenceIds: Array.from(e.target.selectedOptions, o => o.value) })}>{evidence.map(e => <option key={e.id} value={e.id}>{e.title || e.id}</option>)}</select></label>
    </div><button type="button" onClick={() => setTrials(trials.filter((_, n) => n !== i))}>{t('Remove trial')}</button></fieldset>)}
    <button type="button" onClick={() => setTrials([...trials, { id: 'trial-' + crypto.randomUUID(), protocolId: protocols[0].id, protocolVersion: protocols[0].version, scenario: '', operator: '', participants: lines(meta.participants), environment: meta.context, conditions: '', date: meta.date, repetition: trials.length + 1, task: '', successCriterion: '', failureCriterion: '', result: 'aborted', observedBehavior: '', intervention: '', participantFeedback: '', evidenceIds: [], notes: '' }])}>{t('Add trial')}</button>
   </>}
   <p>{t('Overall RXD score')}: {t('Not available')}. {t('Dimensions with documented findings')}: {dimensions.filter(d => d.observations.length && d.evidenceIds.length).length} / 6. {t('Scored dimensions')}: {dimensions.filter(d => d.status === 'assessed').length} / 6.</p>
   <button type="button" onClick={exportDraft}>{t('Download evaluation draft (JSON)')}</button>
   {errors.length > 0 && <div role="alert" className={styles.error}><p>{t('Complete the required fields and resolve these validation errors:')}</p><ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul></div>}
   <p role="status">{t(message)}</p>
  </div>
 </div></section>
}
