import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge'
import type { Submission } from '@/types'
import styles from './AdminSubmissionRow.module.css'

interface AdminProfile {
  full_name: string
  email: string
}

interface SubmissionWithProfile extends Submission {
  enrollments: {
    profiles: AdminProfile
  }
}

interface AdminSubmissionRowProps {
  submission: SubmissionWithProfile
}

export function AdminSubmissionRow({ submission }: AdminSubmissionRowProps) {
  const student = submission.enrollments.profiles
  const submittedDate = submission.submitted_at
    ? new Date(submission.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—'

  return (
    <div className={styles.row}>
      <div className={styles.student}>
        <span className={styles.name}>{student.full_name}</span>
        <span className={styles.email}>{student.email}</span>
      </div>
      <div className={styles.meta}>
        <span className={styles.week}>Week {submission.week_number}</span>
        <StatusBadge status={submission.status} />
        {submission.is_late && <StatusBadge status="late" />}
      </div>
      <span className={styles.date}>{submittedDate}</span>
      <Link href={`/admin/submissions/${submission.id}`} className={styles.review}>
        Review
      </Link>
    </div>
  )
}
