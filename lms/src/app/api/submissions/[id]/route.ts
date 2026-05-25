import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isLate } from '@/lib/deadlines'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('submissions')
    .select('*, submission_files(*)')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Verify the requesting user owns this submission via enrollment
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', data.enrollment_id)
    .single()

  if (!enrollment || enrollment.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(data)
}

// PATCH = auto-save draft
export async function PATCH(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { draft } = await req.json()
  if (typeof draft !== 'string') {
    return NextResponse.json({ error: 'draft required' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('submissions')
    .select('enrollment_id, status')
    .eq('id', id)
    .single()

  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', existing.enrollment_id)
    .single()

  if (!enrollment || enrollment.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (existing.status === 'submitted' || existing.status === 'approved') {
    return NextResponse.json({ error: 'Cannot edit submitted submission' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('submissions')
    .update({ draft, draft_saved_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT = final submit
export async function PUT(req: Request, { params }: Params) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content required' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('submissions')
    .select('enrollment_id, status, due_date')
    .eq('id', id)
    .single()

  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', existing.enrollment_id)
    .single()

  if (!enrollment || enrollment.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (existing.status === 'submitted' || existing.status === 'approved') {
    return NextResponse.json({ error: 'Already submitted' }, { status: 409 })
  }

  const now = new Date().toISOString()
  const late = isLate(existing.due_date, now)

  const { data, error } = await supabase
    .from('submissions')
    .update({
      content,
      draft: content,
      status: 'submitted',
      submitted_at: now,
      is_late: late,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Update week_progress state
  await supabase
    .from('week_progress')
    .update({ state: 'submitted', submitted_at: now })
    .eq('enrollment_id', existing.enrollment_id)
    .eq('week_number', data.week_number)

  return NextResponse.json(data)
}
