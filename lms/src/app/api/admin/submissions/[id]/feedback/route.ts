import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendFeedbackReceived } from '@/lib/email/send'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'instructor'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { comment, decision } = await req.json()
  if (!comment || !decision || !['approved', 'revision_requested'].includes(decision)) {
    return NextResponse.json({ error: 'comment and decision (approved|revision_requested) required' }, { status: 400 })
  }

  const { data: submission } = await supabase
    .from('submissions')
    .select('enrollment_id, week_number, status')
    .eq('id', id)
    .single()

  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (submission.status === 'approved') {
    return NextResponse.json({ error: 'Submission already approved' }, { status: 409 })
  }

  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('submissions')
    .update({
      status: decision,
      instructor_comment: comment,
      reviewed_at: now,
      reviewed_by: user.id,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update week_progress
  await supabase
    .from('week_progress')
    .update({
      state: decision === 'approved' ? 'complete' : 'revision_requested',
      approved_at: decision === 'approved' ? now : null,
    })
    .eq('enrollment_id', submission.enrollment_id)
    .eq('week_number', submission.week_number)

  // Notify student
  try {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('profiles(email, full_name)')
      .eq('id', submission.enrollment_id)
      .single()

    if (enrollment?.profiles) {
      const studentProfile = enrollment.profiles as unknown as { email: string; full_name: string }
      await sendFeedbackReceived({
        to: studentProfile.email,
        name: studentProfile.full_name,
        weekNumber: submission.week_number,
        decision,
        comment,
        instructorName: profile.full_name,
      })
    }
  } catch {
    // Email failure is non-fatal
  }

  return NextResponse.json(data)
}
