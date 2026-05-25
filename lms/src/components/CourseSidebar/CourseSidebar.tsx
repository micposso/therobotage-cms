import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge/StatusBadge'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'
import type { WeekContent, WeekProgress } from '@/types'
import styles from './CourseSidebar.module.css'

interface CourseSidebarProps {
  courseSlug: string
  weeks: WeekContent[]
  progress: WeekProgress[]
  currentWeek: number
}

export function CourseSidebar({ courseSlug, weeks, progress, currentWeek }: CourseSidebarProps) {
  const completedCount = progress.filter((p) => p.state === 'complete').length

  return (
    <aside className={styles.sidebar}>
      <div className={styles.progressSection}>
        <ProgressBar value={completedCount} max={weeks.length} label="Weeks complete" />
      </div>
      <nav className={styles.nav}>
        {weeks.map((week) => {
          const prog = progress.find((p) => p.week_number === week.week_number)
          const locked = !prog || prog.state === 'locked'
          const active = week.week_number === currentWeek
          return (
            <div key={week.week_number} className={`${styles.item} ${active ? styles.active : ''} ${locked ? styles.locked : ''}`}>
              {locked ? (
                <span className={styles.link}>
                  <span className={styles.weekNum}>W{week.week_number}</span>
                  {week.title}
                </span>
              ) : (
                <Link href={`/courses/${courseSlug}/week/${week.week_number}`} className={styles.link}>
                  <span className={styles.weekNum}>W{week.week_number}</span>
                  {week.title}
                </Link>
              )}
              {prog && prog.state !== 'locked' && (
                <StatusBadge status={prog.state} />
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
