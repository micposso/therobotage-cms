'use client'

import { useState } from 'react'
import type { RRASubmission } from '@/types'
import styles from './RRAForm.module.css'

const DIMENSIONS = [
  { key: 'signal_clarity', label: 'Signal Clarity', description: 'How clearly does the robot communicate its state and intent?' },
  { key: 'spatial_legibility', label: 'Spatial Legibility', description: "How readable is the robot's movement and spatial behavior?" },
  { key: 'perceived_presence', label: 'Perceived Presence', description: 'How well does the robot convey awareness of its environment and users?' },
  { key: 'failure_transparency', label: 'Failure Transparency', description: 'How honestly does the robot communicate its limitations and failures?' },
  { key: 'interaction_fit', label: 'Interaction Fit', description: "How well does the robot's interaction model match user expectations?" },
  { key: 'recovery_design', label: 'Recovery Design', description: 'How effectively does the robot handle and recover from errors?' },
] as const

interface RRAFormProps {
  enrollmentId: string
  initial: Partial<RRASubmission>
  onSubmitted: (rra: RRASubmission) => void
}

type DraftState = Record<string, { score: number | ''; rationale: string }>

export function RRAForm({ enrollmentId, initial, onSubmitted }: RRAFormProps) {
  const [fields, setFields] = useState<DraftState>(() =>
    Object.fromEntries(
      DIMENSIONS.map(({ key }) => [
        key,
        {
          score: (initial[`${key}_score` as keyof RRASubmission] as number | null) ?? '',
          rationale: (initial[`${key}_rationale` as keyof RRASubmission] as string | null) ?? '',
        },
      ])
    )
  )
  const [summary, setSummary] = useState(initial.overall_summary ?? '')
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDraft = !initial.submitted_at

  function buildPayload() {
    const payload: Record<string, unknown> = { overall_summary: summary }
    for (const { key } of DIMENSIONS) {
      payload[`${key}_score`] = fields[key].score !== '' ? Number(fields[key].score) : null
      payload[`${key}_rationale`] = fields[key].rationale || null
    }
    return payload
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    const res = await fetch(`/api/rra/${enrollmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload()),
    })
    if (!res.ok) setError((await res.json()).error ?? 'Save failed')
    setSaving(false)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    await handleSave()
    const res = await fetch(`/api/rra/${enrollmentId}`, { method: 'PUT' })
    if (res.ok) {
      onSubmitted(await res.json())
    } else {
      setError((await res.json()).error ?? 'Submission failed')
    }
    setSubmitting(false)
  }

  const allScored = DIMENSIONS.every(({ key }) => fields[key].score !== '')

  return (
    <div className={styles.form}>
      {DIMENSIONS.map(({ key, label, description }) => (
        <div key={key} className={styles.dimension}>
          <label className={styles.dimLabel}>{label}</label>
          <p className={styles.dimDesc}>{description}</p>
          <div className={styles.scoreRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.scoreBtn} ${fields[key].score === n ? styles.scoreBtnActive : ''}`}
                onClick={() => setFields((f) => ({ ...f, [key]: { ...f[key], score: n } }))}
                disabled={!isDraft}
              >
                {n}
              </button>
            ))}
          </div>
          <textarea
            className={styles.rationale}
            value={fields[key].rationale}
            onChange={(e) => setFields((f) => ({ ...f, [key]: { ...f[key], rationale: e.target.value } }))}
            placeholder="Rationale (optional)"
            rows={3}
            disabled={!isDraft}
          />
        </div>
      ))}

      <div className={styles.summary}>
        <label className={styles.summaryLabel}>Overall summary</label>
        <textarea
          className={styles.rationale}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Summarize your overall assessment of the robot experience."
          rows={5}
          disabled={!isDraft}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {isDraft && (
        <div className={styles.actions}>
          <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button
            type="button"
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!allScored || submitting}
          >
            {submitting ? 'Submitting…' : 'Submit RRA'}
          </button>
        </div>
      )}
    </div>
  )
}
