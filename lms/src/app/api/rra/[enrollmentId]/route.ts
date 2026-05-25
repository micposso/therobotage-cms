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
    .from('rra_submissions')
    .select('*, rra_files(*)')
    .eq('enrollment_id', enrollmentId)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? null)
}

// PATCH = save draft fields
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

  const body = await req.json()

  // Upsert RRA submission
  const { data: existing } = await supabase
    .from('rra_submissions')
    .select('id, status')
    .eq('enrollment_id', enrollmentId)
    .single()

  if (existing && (existing.status === 'submitted' || existing.status === 'passed')) {
    return NextResponse.json({ error: 'Cannot edit submitted RRA' }, { status: 409 })
  }

  const upsertData = { enrollment_id: enrollmentId, ...body }
  const { data, error } = existing
    ? await supabase.from('rra_submissions').update(upsertData).eq('id', existing.id).select().single()
    : await supabase.from('rra_submissions').insert(upsertData).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT = final submit
export async function PUT(_req: Request, { params }: Params) {
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

  const { data: rra } = await supabase
    .from('rra_submissions')
    .select('id, status, signal_clarity_score, spatial_legibility_score, perceived_presence_score, failure_transparency_score, interaction_fit_score, recovery_design_score')
    .eq('enrollment_id', enrollmentId)
    .single()

  if (!rra) return NextResponse.json({ error: 'No RRA draft found' }, { status: 404 })
  if (rra.status === 'submitted' || rra.status === 'passed') {
    return NextResponse.json({ error: 'Already submitted' }, { status: 409 })
  }

  const scores = [
    rra.signal_clarity_score,
    rra.spatial_legibility_score,
    rra.perceived_presence_score,
    rra.failure_transparency_score,
    rra.interaction_fit_score,
    rra.recovery_design_score,
  ]
  if (scores.some((s) => s === null)) {
    return NextResponse.json({ error: 'All 6 RES dimension scores required' }, { status: 422 })
  }

  const total_res = scores.reduce((sum, s) => sum + (s as number), 0)
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from('rra_submissions')
    .update({ status: 'submitted', submitted_at: now, total_res })
    .eq('id', rra.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
