import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  const { badgeUrl, publicUrl, recipientEmail, courseSlug } = await req.json()

  if (!recipientEmail || !courseSlug) {
    return NextResponse.json({ error: 'recipientEmail and courseSlug required' }, { status: 400 })
  }

  // Find user by email
  const { data: users } = await supabaseAdmin.auth.admin.listUsers()
  const authUser = users?.users?.find((u) => u.email === recipientEmail)

  if (!authUser) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Update credential with badge URLs
  const { error } = await supabaseAdmin
    .from('credentials')
    .update({
      credential_net_badge_url: badgeUrl ?? null,
      credential_net_public_url: publicUrl ?? null,
    })
    .eq('user_id', authUser.id)
    .eq('course_slug', courseSlug)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ received: true })
}
