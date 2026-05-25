import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_BYTES = 500 * 1024 * 1024

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
    .from('robot_footage')
    .select('*')
    .eq('enrollment_id', enrollmentId)
    .order('week_number', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

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

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const weekNumber = Number(formData.get('weekNumber'))

  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })
  if (!weekNumber) return NextResponse.json({ error: 'weekNumber required' }, { status: 400 })

  if (!file.type.startsWith('video/')) {
    return NextResponse.json({ error: 'Only video files allowed' }, { status: 415 })
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 500MB limit' }, { status: 413 })
  }

  const storagePath = `${enrollmentId}/week${weekNumber}/${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage
    .from('footage')
    .upload(storagePath, file, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })

  const { data, error } = await supabase
    .from('robot_footage')
    .insert({
      enrollment_id: enrollmentId,
      week_number: weekNumber,
      video_storage_path: storagePath,
      uploaded_by: user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
