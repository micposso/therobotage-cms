import { Resend } from 'resend'

export const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? 'The Robot Age <onboarding@resend.dev>'

export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://learn.therobotage.com'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getResend() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
