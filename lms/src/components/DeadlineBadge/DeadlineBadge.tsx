import { hoursUntil, formatDueDate } from '@/lib/deadlines'
import styles from './DeadlineBadge.module.css'

interface DeadlineBadgeProps {
  dueDate: string
  isLate?: boolean
}

export function DeadlineBadge({ dueDate, isLate }: DeadlineBadgeProps) {
  const hours = hoursUntil(dueDate)
  const urgent = hours <= 24 && hours > 0

  return (
    <span className={`${styles.badge} ${isLate ? styles.late : urgent ? styles.urgent : styles.normal}`}>
      {isLate ? 'Late' : `Due ${formatDueDate(dueDate)}`}
    </span>
  )
}
