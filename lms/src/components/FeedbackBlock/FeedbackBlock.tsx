import type { Submission } from '@/types'
import styles from './FeedbackBlock.module.css'

interface FeedbackBlockProps {
  submission: Submission
}

export function FeedbackBlock({ submission }: FeedbackBlockProps) {
  if (!submission.instructor_comment) return null

  return (
    <div className={`${styles.block} ${submission.status === 'approved' ? styles.approved : styles.revision}`}>
      <p className={styles.label}>
        {submission.status === 'approved' ? 'Approved' : 'Revision requested'}
        {submission.reviewed_at && (
          <span className={styles.date}>
            {' '}— {new Date(submission.reviewed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </span>
        )}
      </p>
      <p className={styles.comment}>{submission.instructor_comment}</p>
    </div>
  )
}
