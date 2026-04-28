import { Resend } from 'resend'
import { NextResponse } from 'next/server'
import { waitlistConfirmationHtml } from '@/lib/emailTemplate'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production.' }, { status: 403 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'micposso@gmail.com',
      subject: "[Test] You're first in line — HREF Certification",
      html: waitlistConfirmationHtml(),
    })

    if (error) return NextResponse.json({ ok: false, error }, { status: 500 })
    return NextResponse.json({ ok: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
