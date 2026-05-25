import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { WeekCard } from '@/components/WeekCard/WeekCard'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'
import styles from './page.module.css'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  // Get active enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select(`
      *,
      cohorts(name, start_date, week_start_dates, zoom_url, status, courses(slug, title, total_weeks)),
      week_progress(*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!enrollment) {
    return (
      <div className={styles.empty}>
        <p>You are not enrolled in any active cohort.</p>
      </div>
    )
  }

  const cohort = enrollment.cohorts as {
    name: string
    start_date: string
    week_start_dates: string[]
    zoom_url: string | null
    status: string
    courses: { slug: string; title: string; total_weeks: number }
  }
  const course = cohort.courses
  const progress = (enrollment.week_progress ?? []) as { week_number: number; state: string }[]

  // Fetch week content
  const { data: weekContents } = await supabase
    .from('week_content')
    .select('*')
    .eq('course_id', (await supabase.from('courses').select('id').eq('slug', course.slug).single()).data?.id)
    .order('week_number', { ascending: true })

  const completedCount = progress.filter((p) => p.state === 'complete').length
  const currentWeek = progress.find(
    (p) => p.state === 'available' || p.state === 'in_progress' || p.state === 'submitted' || p.state === 'revision_requested'
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.cohortLabel}>{cohort.name}</p>
        <h1 className={styles.heading}>
          {currentWeek
            ? `Week ${currentWeek.week_number} is ${currentWeek.state === 'available' ? 'open' : currentWeek.state.replace('_', ' ')}.`
            : completedCount === course.total_weeks
            ? 'Course complete.'
            : 'Welcome.'}
        </h1>
        <ProgressBar value={completedCount} max={course.total_weeks} label="Weeks complete" />
      </div>

      {cohort.zoom_url && (
        <div className={styles.zoom}>
          <a href={cohort.zoom_url} target="_blank" rel="noopener noreferrer" className={styles.zoomLink}>
            Week 1 live session →
          </a>
        </div>
      )}

      <div className={styles.weeks}>
        {(weekContents ?? []).map((wc) => {
          const prog = progress.find((p) => p.week_number === wc.week_number)
          if (!prog) return null
          return (
            <WeekCard
              key={wc.id}
              content={wc}
              progress={prog as Parameters<typeof WeekCard>[0]['progress']}
              courseSlug={course.slug}
            />
          )
        })}
      </div>
    </div>
  )
}
