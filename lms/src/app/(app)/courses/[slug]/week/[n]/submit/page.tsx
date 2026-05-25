'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubmissionEditor } from '@/components/SubmissionEditor/SubmissionEditor'
import { FeedbackBlock } from '@/components/FeedbackBlock/FeedbackBlock'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge'
import type { Submission, WeekContent, SubmissionFile } from '@/types'
import styles from './page.module.css'

interface PageProps {
  params: Promise<{ slug: string; n: string }>
}

export default function SubmitPage({ params }: PageProps) {
  const router = useRouter()
  const [slug, setSlug] = useState('')
  const [weekNumber, setWeekNumber] = useState(0)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [files, setFiles] = useState<SubmissionFile[]>([])
  const [weekContent, setWeekContent] = useState<WeekContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(({ slug: s, n }) => {
      setSlug(s)
      setWeekNumber(parseInt(n, 10))
    })
  }, [params])

  useEffect(() => {
    if (!slug || !weekNumber) return
    async function load() {
      const [subRes, wcRes] = await Promise.all([
        fetch(`/api/submissions/by-week?courseSlug=${slug}&weekNumber=${weekNumber}`),
        fetch(`/api/week-content?courseSlug=${slug}&weekNumber=${weekNumber}`),
      ])
      if (subRes.ok) {
        const sub = await subRes.json()
        setSubmission(sub.submission)
        setFiles(sub.files ?? [])
      }
      if (wcRes.ok) setWeekContent(await wcRes.json())
      setLoading(false)
    }
    void load()
  }, [slug, weekNumber])

  if (loading) return <div className={styles.loading}>Loading…</div>
  if (!weekContent) return <div className={styles.loading}>Week not found.</div>

  const submitted = submission?.status === 'submitted' || submission?.status === 'approved'

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button type="button" onClick={() => router.back()} className={styles.back}>← Back</button>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Week {weekNumber} deliverable</h1>
          {submission && <StatusBadge status={submission.status} />}
        </div>
      </div>

      {submission?.instructor_comment && <FeedbackBlock submission={submission} />}

      {submitted ? (
        <div className={styles.submitted}>
          <p className={styles.submittedNote}>Your deliverable has been submitted.</p>
          {submission?.content && (
            <div className={styles.content}>
              <p className={styles.contentLabel}>Your submission</p>
              <p className={styles.contentBody}>{submission.content}</p>
            </div>
          )}
        </div>
      ) : (
        submission && (
          <SubmissionEditor
            submission={submission}
            weekContent={weekContent}
            files={files}
            onSubmitted={(updated) => {
              setSubmission(updated)
              router.push(`/courses/${slug}/week/${weekNumber}`)
            }}
          />
        )
      )}
    </div>
  )
}
