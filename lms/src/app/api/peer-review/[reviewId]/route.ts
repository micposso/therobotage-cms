import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ reviewId: string }> }

export async function PUT(req: Request, { params }: Params) {
  const { reviewId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { strengths, improvements, holisticRating } = await req.json()
  if (!strengths || !improvements) {
    return NextResponse.json({ error: 'strengths and improvements required' }, { status: 400 })
  }

  // Verify the reviewer owns this review
  const { data: review } = await supabase
    .from('peer_reviews')
    .select('reviewer_enrollment_id, status')
    .eq('id', reviewId)
    .single()

  if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (review.status === 'submitted') return NextResponse.json({ error: 'Already submitted' }, { status: 409 })

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', review.reviewer_enrollment_id)
    .single()

  if (!enrollment || enrollment.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('peer_reviews')
    .update({
      strengths,
      improvements,
      holistic_rating: holisticRating ?? null,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
