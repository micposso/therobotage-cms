import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { RRAForm } from '@/components/RRAForm/RRAForm'
import { RESScoreCard } from '@/components/RESScoreCard/RESScoreCard'
import type { RRASubmission } from '@/types'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }

export const metadata: Metadata = { title: 'Robot Readiness Audit' }

export default async function CapstonePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id, cohort_id')
    .eq('user_id', user.id)
    .eq('course_slug', slug)
    .eq('status', 'active')
    .single()

  if (!enrollment) redirect('/dashboard')

  // Gate: week 5 footage must be viewed and week 5 deliverable approved
  const { data: footageCheck } = await supabase
    .from('robot_footage')
    .select('viewed_at')
    .eq('enrollment_id', enrollment.id)
    .eq('week_number', 5)
    .not('viewed_at', 'is', null)
    .limit(1)

  const { data: week5progress } = await supabase
    .from('week_progress')
    .select('state')
    .eq('enrollment_id', enrollment.id)
    .eq('week_number', 5)
    .single()

  const gated = !footageCheck?.length || week5progress?.state !== 'complete'

  const { data: rra } = await supabase
    .from('rra_submissions')
    .select('*, rra_files(*)')
    .eq('enrollment_id', enrollment.id)
    .single()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <p className={styles.label}>Week 6 · Capstone</p>
        <h1 className={styles.title}>Robot Readiness Audit</h1>
        <p className={styles.description}>
          Complete a structured evaluation of a robot interaction using the 6-dimension RES framework.
          Score each dimension 1–5 and provide a rationale for each score.
        </p>
      </div>

      {gated && !rra && (
        <div className={styles.gate}>
          <p>The Robot Readiness Audit unlocks after you view your Week 5 footage and your Week 5 deliverable is approved.</p>
        </div>
      )}

      {!gated && !rra?.submitted_at && (
        <RRAForm
          enrollmentId={enrollment.id}
          initial={rra ?? {}}
          onSubmitted={() => {}}
        />
      )}

      {rra?.submitted_at && (
        <div className={styles.submitted}>
          <p className={styles.submittedNote}>
            {rra.status === 'passed'
              ? 'Your RRA has passed. Credential issued.'
              : rra.status === 'revision_requested'
              ? 'Revision requested — see feedback below.'
              : 'Submitted. Awaiting instructor review.'}
          </p>
          {rra.instructor_comment && (
            <div className={styles.feedback}>
              <p className={styles.feedbackLabel}>Instructor feedback</p>
              <p className={styles.feedbackContent}>{rra.instructor_comment}</p>
            </div>
          )}
          <RESScoreCard rra={rra as RRASubmission} />
        </div>
      )}
    </div>
  )
}
