'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function PeerReviewFormClient({ reviewId }: { reviewId: string }) {
  const [strengths, setStrengths] = useState('')
  const [improvements, setImprovements] = useState('')
  const [holistic, setHolistic] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!strengths.trim() || !improvements.trim()) return
    setSubmitting(true)
    const res = await fetch(`/api/peer-review/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strengths, improvements, holisticRating: holistic }),
    })
    if (res.ok) {
      setDone(true)
    } else {
      setError((await res.json()).error ?? 'Submission failed')
    }
    setSubmitting(false)
  }

  if (done) return <p className={styles.submittedNote}>Peer review submitted.</p>

  return (
    <div className={styles.reviewForm}>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Strengths</label>
        <textarea
          className={styles.textarea}
          value={strengths}
          onChange={(e) => setStrengths(e.target.value)}
          placeholder="What does this RRA do well?"
          rows={4}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Areas for improvement</label>
        <textarea
          className={styles.textarea}
          value={improvements}
          onChange={(e) => setImprovements(e.target.value)}
          placeholder="What could be stronger?"
          rows={4}
        />
      </div>
      <div className={styles.field}>
        <label className={styles.fieldLabel}>Overall impression (optional)</label>
        <textarea
          className={styles.textarea}
          value={holistic}
          onChange={(e) => setHolistic(e.target.value)}
          placeholder="Any holistic thoughts on the evaluation?"
          rows={3}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button
        type="button"
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={!strengths.trim() || !improvements.trim() || submitting}
      >
        {submitting ? 'Submitting…' : 'Submit peer review'}
      </button>
    </div>
  )
}
