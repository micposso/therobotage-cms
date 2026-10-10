import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Link previews and availability checks do not count as download requests.
export async function HEAD(request: Request) {
  const response = NextResponse.redirect(new URL('/pdf/rxd-therobotage-v2.pdf', request.url), 307)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function GET(request: Request) {
  // Notify on the site's direct download links as well as emailed download links.
  // A delivery outage must not prevent readers from accessing the paper.
  try {
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: process.env.EMAIL_FROM_RESEARCH ?? 'onboarding@resend.dev',
      to: 'mike@therobotage.com',
      subject: 'White paper download — Robot Experience Design v2.0',
      text: `The RXD v2.0 white paper download was requested at ${new Date().toISOString()}.\nThis is an anonymous download; no email address was collected.`,
    })
    if (error) console.error('White paper download notification failed:', error)
  } catch (error) {
    console.error('White paper download notification failed:', error)
  }
  const response = NextResponse.redirect(new URL('/pdf/rxd-therobotage-v2.pdf', request.url), 307)
  response.headers.set('Cache-Control', 'no-store')
  return response
}
