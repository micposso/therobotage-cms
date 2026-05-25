import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Params = { params: Promise<{ enrollmentId: string }> }

export async function POST(req: Request, { params }: Params) {
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

  const { footageId } = await req.json()
  if (!footageId) return NextResponse.json({ error: 'footageId required' }, { status: 400 })

  const { data, error } = await supabase
    .from('robot_footage')
    .update({ viewed_at: new Date().toISOString() })
    .eq('id', footageId)
    .eq('enrollment_id', enrollmentId)
    .is('viewed_at', null)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
