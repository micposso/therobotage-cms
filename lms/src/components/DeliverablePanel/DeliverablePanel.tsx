import { StatusBadge } from '@/components/StatusBadge/StatusBadge'
import { DeadlineBadge } from '@/components/DeadlineBadge/DeadlineBadge'
import { FeedbackBlock } from '@/components/FeedbackBlock/FeedbackBlock'
import type { Submission, WeekContent, WeekProgress } from '@/types'
import styles from './DeliverablePanel.module.css'

interface DeliverablePanelProps {
  weekContent: WeekContent
  progress: WeekProgress
  submission: Submission | null
  courseSlug: string
}

export function DeliverablePanel({ weekContent, progress, submission, courseSlug }: DeliverablePanelProps) {
  if (!weekContent.deliverable_prompt) return null

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.label}>Deliverable</span>
        <div className={styles.badges}>
          {submission && <StatusBadge status={submission.status} />}
          {submission?.is_late && <StatusBadge status="late" />}
          {submission?.due_date && !submission.submitted_at && (
            <DeadlineBadge dueDate={submission.due_date} isLate={submission.is_late} />
          )}
        </div>
      </div>

      {submission?.instructor_comment && (
        <FeedbackBlock submission={submission} />
      )}

      <div className={styles.body}>
        {submission?.content ? (
          <div className={styles.submittedContent}>
            <p className={styles.submittedLabel}>Your submission</p>
            <p className={styles.content}>{submission.content}</p>
          </div>
        ) : (
          <>
            <p className={styles.prompt}>{weekContent.deliverable_prompt}</p>
            <a
              href={`/courses/${courseSlug}/week/${weekContent.week_number}/submit`}
              className={styles.submitLink}
            >
              {progress.state === 'revision_requested' ? 'Revise submission' : 'Submit deliverable'}
            </a>
          </>
        )}
      </div>
    </div>
  )
}
