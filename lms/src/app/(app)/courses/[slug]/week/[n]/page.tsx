import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { CourseSidebar } from '@/components/CourseSidebar/CourseSidebar'
import { DeliverablePanel } from '@/components/DeliverablePanel/DeliverablePanel'
import { CoachPanel } from '@/components/CoachPanel/CoachPanel'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string; n: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params
  return { title: `Week ${n}` }
}

export default async function WeekPage({ params }: Props) {
  const { slug, n } = await params
  const weekNumber = parseInt(n, 10)
  if (isNaN(weekNumber)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, total_weeks')
    .eq('slug', slug)
    .single()

  if (!course) notFound()

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, cohort_id')
    .eq('user_id', user.id)
    .eq('course_slug', slug)
    .eq('status', 'active')
    .single()

  if (!enrollment) redirect('/dashboard')

  const [
    { data: weekContents },
    { data: allProgress },
    { data: weekContent },
  ] = await Promise.all([
    supabase.from('week_content').select('*').eq('course_id', course.id).order('week_number'),
    supabase.from('week_progress').select('*').eq('enrollment_id', enrollment.id).order('week_number'),
    supabase.from('week_content').select('*').eq('course_id', course.id).eq('week_number', weekNumber).single(),
  ])

  if (!weekContent) notFound()

  const progress = allProgress ?? []
  const thisProgress = progress.find((p) => p.week_number === weekNumber)

  if (!thisProgress || thisProgress.state === 'locked') redirect('/dashboard')

  // Mark as in_progress if available
  if (thisProgress.state === 'available') {
    await supabase
      .from('week_progress')
      .update({ state: 'in_progress', content_viewed_at: new Date().toISOString() })
      .eq('enrollment_id', enrollment.id)
      .eq('week_number', weekNumber)
    thisProgress.state = 'in_progress'
  }

  // Fetch existing submission
  const { data: submission } = await supabase
    .from('submissions')
    .select('*')
    .eq('enrollment_id', enrollment.id)
    .eq('week_number', weekNumber)
    .single()

  return (
    <div className={styles.layout}>
      <CourseSidebar
        courseSlug={slug}
        weeks={weekContents ?? []}
        progress={progress as Parameters<typeof CourseSidebar>[0]['progress']}
        currentWeek={weekNumber}
      />
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.weekMeta}>
            <span className={styles.weekLabel}>Week {weekNumber}</span>
            {weekContent.format === 'live_zoom' && <span className={styles.format}>Live session</span>}
          </div>
          <h1 className={styles.title}>{weekContent.title}</h1>
          {weekContent.subtitle && <p className={styles.subtitle}>{weekContent.subtitle}</p>}

          {weekContent.learning_outcomes?.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Learning outcomes</h2>
              <ul className={styles.outcomes}>
                {weekContent.learning_outcomes.map((o: string, i: number) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>
          )}

          {weekContent.body_markdown && (
            <div className={styles.body}>
              <p>{weekContent.body_markdown}</p>
            </div>
          )}

          {weekContent.resources?.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Resources</h2>
              <ul className={styles.resources}>
                {weekContent.resources.map((r: { title: string; url: string; type: string }, i: number) => (
                  <li key={i}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
                    <span className={styles.resourceType}>{r.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <DeliverablePanel
            weekContent={weekContent}
            progress={thisProgress as Parameters<typeof DeliverablePanel>[0]['progress']}
            submission={submission ?? null}
            courseSlug={slug}
          />
        </div>

        <aside className={styles.coach}>
          <CoachPanel
            enrollmentId={enrollment.id}
            courseSlug={slug}
            weekNumber={weekNumber}
          />
        </aside>
      </main>
    </div>
  )
}
