'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge'
import { InstructorFeedbackForm } from '@/components/InstructorFeedbackForm/InstructorFeedbackForm'
import type { Submission } from '@/types'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AdminSubmissionDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [submissionId, setSubmissionId] = useState('')
  const [submission, setSubmission] = useState<Submission & { enrollments: { profiles: { full_name: string; email: string } } } | null>(null)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)

  useEffect(() => {
    params.then(({ id }) => setSubmissionId(id))
  }, [params])

  useEffect(() => {
    if (!submissionId) return
    fetch(`/api/admin/submissions/${submissionId}`)
      .then((r) => r.json())
      .then((data) => { setSubmission(data); setLoading(false) })
  }, [submissionId])

  if (loading) return <div className={styles.loading}>Loading…</div>
  if (!submission) return <div className={styles.loading}>Submission not found.</div>

  const student = submission.enrollments?.profiles

  return (
    <div className={styles.page}>
      <button type="button" onClick={() => router.back()} className={styles.back}>← Back</button>

      <div className={styles.header}>
        <div>
          <p className={styles.student}>{student?.full_name} · {student?.email}</p>
          <h1 className={styles.title}>Week {submission.week_number} deliverable</h1>
        </div>
        <div className={styles.badges}>
          <StatusBadge status={submission.status} />
          {submission.is_late && <StatusBadge status="late" />}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.contentLabel}>Submission</p>
        <p className={styles.contentBody}>{submission.content ?? submission.draft}</p>
      </div>

      {!done && submission.status === 'submitted' && (
        <InstructorFeedbackForm
          submissionId={submission.id}
          onCompleted={() => setDone(true)}
        />
      )}

      {(done || submission.status !== 'submitted') && submission.instructor_comment && (
        <div className={styles.existingFeedback}>
          <p className={styles.feedbackLabel}>Feedback sent</p>
          <p>{submission.instructor_comment}</p>
        </div>
      )}
    </div>
  )
}
