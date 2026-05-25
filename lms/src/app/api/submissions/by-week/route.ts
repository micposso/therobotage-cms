import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const courseSlug = searchParams.get('courseSlug')
  const weekNumber = Number(searchParams.get('weekNumber'))

  if (!courseSlug || !weekNumber) {
    return NextResponse.json({ error: 'courseSlug and weekNumber required' }, { status: 400 })
  }

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_slug', courseSlug)
    .eq('status', 'active')
    .single()

  if (!enrollment) return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })

  const { data: submission } = await supabase
    .from('submissions')
    .select('*, submission_files(*)')
    .eq('enrollment_id', enrollment.id)
    .eq('week_number', weekNumber)
    .single()

  if (!submission) {
    // Create a draft submission
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', courseSlug)
      .single()

    const { data: cohort } = await supabase
      .from('cohorts')
      .select('week_start_dates')
      .eq('id', (await supabase.from('enrollments').select('cohort_id').eq('id', enrollment.id).single()).data?.cohort_id)
      .single()

    const { computeDueDate } = await import('@/lib/deadlines')
    const dueDate = cohort?.week_start_dates
      ? computeDueDate(cohort.week_start_dates, weekNumber)
      : null

    const { data: newSub } = await supabase
      .from('submissions')
      .insert({
        enrollment_id: enrollment.id,
        week_number: weekNumber,
        draft: '',
        due_date: dueDate?.toISOString() ?? null,
      })
      .select('*, submission_files(*)')
      .single()

    return NextResponse.json({ submission: newSub, files: [] })
  }

  return NextResponse.json({
    submission,
    files: submission.submission_files ?? [],
  })
}
