'use client'

import { useState } from 'react'
import styles from './InstructorFeedbackForm.module.css'

interface InstructorFeedbackFormProps {
  submissionId: string
  onCompleted: () => void
}

export function InstructorFeedbackForm({ submissionId, onCompleted }: InstructorFeedbackFormProps) {
  const [decision, setDecision] = useState<'approved' | 'revision_requested' | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!decision || !comment.trim()) return
    setSubmitting(true)
    setError(null)
    const res = await fetch(`/api/admin/submissions/${submissionId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision, comment }),
    })
    if (res.ok) {
      onCompleted()
    } else {
      setError((await res.json()).error ?? 'Failed to submit feedback')
    }
    setSubmitting(false)
  }

  return (
    <div className={styles.form}>
      <p className={styles.label}>Feedback</p>
      <div className={styles.decisionRow}>
        <button
          type="button"
          className={`${styles.decisionBtn} ${decision === 'approved' ? styles.approveActive : ''}`}
          onClick={() => setDecision('approved')}
        >
          Approve
        </button>
        <button
          type="button"
          className={`${styles.decisionBtn} ${decision === 'revision_requested' ? styles.revisionActive : ''}`}
          onClick={() => setDecision('revision_requested')}
        >
          Request revision
        </button>
      </div>
      <textarea
        className={styles.comment}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your feedback to the student."
        rows={6}
      />
      {error && <p className={styles.error}>{error}</p>}
      <button
        type="button"
        className={styles.submitBtn}
        onClick={handleSubmit}
        disabled={!decision || !comment.trim() || submitting}
      >
        {submitting ? 'Sending…' : 'Send feedback'}
      </button>
    </div>
  )
}
