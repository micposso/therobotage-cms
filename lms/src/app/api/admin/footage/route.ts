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
  const enrollmentId = searchParams.get('enrollmentId')

  let query = supabase
    .from('robot_footage')
    .select(`
      *,
      enrollments!inner(
        profiles(full_name, email),
        cohorts(name)
      )
    `)
    .order('uploaded_at', { ascending: false })

  if (enrollmentId) query = query.eq('enrollment_id', enrollmentId)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

// Admin uploads footage on behalf of a student
export async function POST(req: Request) {
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

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const enrollmentId = formData.get('enrollmentId') as string | null
  const weekNumber = Number(formData.get('weekNumber'))

  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })
  if (!enrollmentId) return NextResponse.json({ error: 'enrollmentId required' }, { status: 400 })
  if (!weekNumber) return NextResponse.json({ error: 'weekNumber required' }, { status: 400 })

  if (!file.type.startsWith('video/')) {
    return NextResponse.json({ error: 'Only video files allowed' }, { status: 415 })
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

  // Mark footage as viewed (admin uploaded it)
  await supabase
    .from('robot_footage')
    .update({ viewed_at: new Date().toISOString() })
    .eq('id', data.id)

  return NextResponse.json(data, { status: 201 })
}
