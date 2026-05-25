import type { WeekState, SubmissionStatus, RRAStatus } from '@/types'
import styles from './StatusBadge.module.css'

type Status = WeekState | SubmissionStatus | RRAStatus | 'late'

const LABELS: Record<Status, string> = {
  locked: 'Locked',
  available: 'Available',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  revision_requested: 'Revision Requested',
  complete: 'Complete',
  draft: 'Draft',
  approved: 'Approved',
  passed: 'Passed',
  late: 'Late',
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`${styles.badge} ${styles[status.replace('_', '')]}`}>
      {LABELS[status] ?? status}
    </span>
  )
}
