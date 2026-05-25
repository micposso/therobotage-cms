import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendWelcome } from '@/lib/email/send'

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature') ?? ''
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? ''

  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(rawBody)
  const digest = hmac.digest('hex')

  if (!crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const eventName: string = event.meta?.event_name ?? ''

  if (eventName === 'order_created') {
    const attrs = event.data?.attributes ?? {}
    const email: string = attrs.user_email ?? ''
    const orderId: string = String(event.data?.id ?? '')
    const courseSlug: string = attrs.first_order_item?.product_name?.toLowerCase().replace(/\s+/g, '-') ?? 'rep'

    if (!email) {
      return NextResponse.json({ error: 'No email in payload' }, { status: 422 })
    }

    // Find user by email
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    const authUser = users?.users?.find((u) => u.email === email)

    if (!authUser) {
      // User hasn't signed in yet — store pending enrollment keyed by email
      // They will be enrolled on first sign-in (handled by handle_new_user trigger or profile creation)
      await supabaseAdmin
        .from('pending_enrollments')
        .upsert({ email, course_slug: courseSlug, lemon_squeezy_order_id: orderId })
        .throwOnError()
      return NextResponse.json({ status: 'pending' })
    }

    // Find active cohort for this course
    const { data: cohort } = await supabaseAdmin
      .from('cohorts')
      .select('id')
      .eq('course_id', (await supabaseAdmin.from('courses').select('id').eq('slug', courseSlug).single()).data?.id)
      .eq('status', 'active')
      .order('start_date', { ascending: false })
      .limit(1)
      .single()

    if (!cohort) {
      return NextResponse.json({ error: 'No active cohort found' }, { status: 422 })
    }

    // Upsert enrollment
    await supabaseAdmin
      .from('enrollments')
      .upsert(
        {
          user_id: authUser.id,
          cohort_id: cohort.id,
          course_slug: courseSlug,
          lemon_squeezy_order_id: orderId,
        },
        { onConflict: 'user_id,cohort_id' }
      )
      .throwOnError()

    // Send welcome email
    try {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('full_name')
        .eq('id', authUser.id)
        .single()

      await sendWelcome({
        to: email,
        name: profile?.full_name ?? email,
        courseSlug,
      })
    } catch {
      // Non-fatal
    }
  }

  return NextResponse.json({ received: true })
}
