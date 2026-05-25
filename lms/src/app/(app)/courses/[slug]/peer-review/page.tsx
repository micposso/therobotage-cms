import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { RESScoreCard } from '@/components/RESScoreCard/RESScoreCard'
import type { RRASubmission, PeerReview } from '@/types'
import styles from './page.module.css'

type Props = { params: Promise<{ slug: string }> }

export const metadata: Metadata = { title: 'Peer Review' }

export default async function PeerReviewPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/signin')

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_slug', slug)
    .eq('status', 'active')
    .single()

  if (!enrollment) redirect('/dashboard')

  const { data: review } = await supabase
    .from('peer_reviews')
    .select('*, rra_submissions(*)')
    .eq('reviewer_enrollment_id', enrollment.id)
    .single()

  if (!review) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Peer Review</h1>
        <p className={styles.empty}>No peer review has been assigned to you yet.</p>
      </div>
    )
  }

  const rra = review.rra_submissions as RRASubmission

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Peer Review</h1>
      <p className={styles.description}>
        Review the Robot Readiness Audit below. Provide specific, constructive feedback.
      </p>
      <RESScoreCard rra={rra} />
      <PeerReviewForm reviewId={review.id} review={review as PeerReview} />
    </div>
  )
}

function PeerReviewForm({ reviewId, review }: { reviewId: string; review: PeerReview }) {
  if (review.status === 'submitted') {
    return (
      <div className={styles.submitted}>
        <p className={styles.submittedNote}>You have submitted your peer review.</p>
        {review.strengths && <div><p className={styles.fieldLabel}>Strengths</p><p>{review.strengths}</p></div>}
        {review.improvements && <div><p className={styles.fieldLabel}>Improvements</p><p>{review.improvements}</p></div>}
      </div>
    )
  }
  return <PeerReviewFormClient reviewId={reviewId} />
}

// Minimal client form — full state management
import PeerReviewFormClient from './PeerReviewFormClient'
