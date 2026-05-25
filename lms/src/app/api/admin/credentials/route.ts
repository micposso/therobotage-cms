import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendCredentialIssued } from '@/lib/email/send'

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

  const { data, error } = await supabase
    .from('credentials')
    .select('*, profiles(full_name, email)')
    .order('issued_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!adminProfile || adminProfile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { userId, courseSlug, credentialNetBadgeUrl, credentialNetPublicUrl, isFounding } = await req.json()
  if (!userId || !courseSlug) {
    return NextResponse.json({ error: 'userId and courseSlug required' }, { status: 400 })
  }

  const { data: credential, error } = await supabase
    .from('credentials')
    .insert({
      user_id: userId,
      course_slug: courseSlug,
      credential_net_badge_url: credentialNetBadgeUrl ?? null,
      credential_net_public_url: credentialNetPublicUrl ?? null,
      is_founding: isFounding ?? false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  try {
    const { data: recipientProfile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (recipientProfile) {
      await sendCredentialIssued({
        to: recipientProfile.email,
        name: recipientProfile.full_name,
        courseSlug,
        badgeUrl: credentialNetBadgeUrl ?? null,
        publicUrl: credentialNetPublicUrl ?? null,
        isFounding: isFounding ?? false,
      })
    }
  } catch {
    // Email failure is non-fatal
  }

  return NextResponse.json(credential, { status: 201 })
}
