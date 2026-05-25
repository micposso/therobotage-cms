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

  const { data: course } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseSlug)
    .single()

  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  const { data, error } = await supabase
    .from('week_content')
    .select('*')
    .eq('course_id', course.id)
    .eq('week_number', weekNumber)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}
