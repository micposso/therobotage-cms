import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ enrollmentId: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { enrollmentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', enrollmentId)
    .single()

  if (!enrollment || enrollment.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('week_progress')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('week_number', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function PATCH(req: Request, { params }: Params) {
  const { enrollmentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', enrollmentId)
    .single()

  if (!enrollment || enrollment.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { weekNumber, state } = await req.json()
  if (!weekNumber || !state) {
    return NextResponse.json({ error: 'weekNumber and state required' }, { status: 400 })
  }

  const ALLOWED_STUDENT_STATES = ['in_progress']
  if (!ALLOWED_STUDENT_STATES.includes(state)) {
    return NextResponse.json({ error: 'State transition not allowed' }, { status: 422 })
  }

  const { data: existing } = await supabase
    .from('week_progress')
    .select('state')
    .eq('enrollment_id', enrollmentId)
    .eq('week_number', weekNumber)
    .single()

  if (!existing || existing.state === 'locked') {
    return NextResponse.json({ error: 'Week not available' }, { status: 422 })
  }

  const update: Record<string, unknown> = { state }
  if (state === 'in_progress') update.content_viewed_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('week_progress')
    .update(update)
    .eq('enrollment_id', enrollmentId)
    .eq('week_number', weekNumber)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
