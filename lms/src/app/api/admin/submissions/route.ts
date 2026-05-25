import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'instructor'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const cohortId = searchParams.get('cohortId')
  const status = searchParams.get('status')
  const weekNumber = searchParams.get('weekNumber')

  let query = supabase
    .from('submissions')
    .select(`
      *,
      submission_files(*),
      enrollments!inner(
        id,
        cohort_id,
        profiles(full_name, email, avatar_url)
      )
    `)
    .order('submitted_at', { ascending: false })

  if (cohortId) query = query.eq('enrollments.cohort_id', cohortId)
  if (status) query = query.eq('status', status)
  if (weekNumber) query = query.eq('week_number', Number(weekNumber))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
