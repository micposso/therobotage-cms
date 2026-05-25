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

  let query = supabase
    .from('enrollments')
    .select(`
      *,
      profiles(id, full_name, email, avatar_url, role),
      cohorts(name, start_date),
      week_progress(week_number, state)
    `)
    .order('created_at', { ascending: false })

  if (cohortId) query = query.eq('cohort_id', cohortId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
