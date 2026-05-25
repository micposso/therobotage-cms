import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge'
import { DeadlineBadge } from '@/components/DeadlineBadge/DeadlineBadge'
import type { WeekContent, WeekProgress } from '@/types'
import styles from './WeekCard.module.css'

interface WeekCardProps {
  content: WeekContent
  progress: WeekProgress
  courseSlug: string
}

export function WeekCard({ content, progress, courseSlug }: WeekCardProps) {
  const locked = progress.state === 'locked'
  const href = `/courses/${courseSlug}/week/${content.week_number}`

  return (
    <article className={`${styles.card} ${locked ? styles.locked : ''}`}>
      <div className={styles.header}>
        <span className={styles.weekLabel}>Week {content.week_number}</span>
        <StatusBadge status={progress.state} />
      </div>
      <h2 className={styles.title}>
        {locked ? content.title : <Link href={href}>{content.title}</Link>}
      </h2>
      {content.subtitle && <p className={styles.subtitle}>{content.subtitle}</p>}
      <div className={styles.meta}>
        {content.estimated_hours && (
          <span className={styles.hours}>{content.estimated_hours}h</span>
        )}
        {content.format === 'live_zoom' && <span className={styles.format}>Live session</span>}
        {content.format === 'capstone' && <span className={styles.format}>Capstone</span>}
      </div>
      {!locked && content.deliverable_prompt && (
        <div className={styles.deliverable}>
          <Link href={`${href}/submit`} className={styles.submitLink}>
            {progress.state === 'submitted' || progress.state === 'complete'
              ? 'View submission'
              : 'Submit deliverable'}
          </Link>
        </div>
      )}
    </article>
  )
}
