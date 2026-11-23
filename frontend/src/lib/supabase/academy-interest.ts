import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { isRpdpPromotionActive, rpdpAudiences, rpdpInterests, rpdpProgram, rpdpSources, utmFields } from '../rpdp-registration'

const registration = z.object({
  fullName: z.string().trim().min(1).max(254),
  audience: z.enum(rpdpAudiences),
  primaryInterest: z.enum(rpdpInterests).nullable(),
  marketingConsent: z.enum(['on']).nullable(),
  sourcePage: z.enum(rpdpSources),
})

export async function registerRpdp(form: FormData, email: string, submittedAt: Date) {
  const parsed = registration.safeParse({
    fullName: form.get('name'),
    audience: form.get('audience'),
    primaryInterest: form.get('primary_interest') || null,
    marketingConsent: form.get('marketing_consent'),
    sourcePage: form.get('source_page'),
  })
  if (!parsed.success) return { error: 'Please check your name and selections and try again.' } as const

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  const token = process.env.SUPABASE_ACADEMY_INTEREST_SERVICE_KEY
  if (!url || !key || !token) throw new Error('Academy interest storage is not configured')

  const { fullName, audience, primaryInterest, marketingConsent, sourcePage } = parsed.data
  const utm: Record<string, string> = {}
  for (const field of utmFields) {
    const value = form.get(field)
    if (typeof value === 'string' && value.trim()) utm[field] = value.trim().slice(0, 200)
  }

  const promotionalEligibility = isRpdpPromotionActive(submittedAt.getTime())
  const client = createClient(url, key, { accessToken: async () => token })
  const { data: firstRegistration, error } = await client.rpc('record_academy_interest', {
    p_program: rpdpProgram.program,
    p_version: rpdpProgram.version,
    p_cohort: rpdpProgram.cohort,
    p_email: email.toLowerCase(),
    p_full_name: fullName,
    p_audience: audience,
    p_primary_interest: primaryInterest,
    p_marketing_consent: marketingConsent === 'on',
    p_source_page: sourcePage,
    p_utm: utm,
    p_submitted_at: submittedAt.toISOString(),
    p_promo_eligible: promotionalEligibility,
  })
  if (error || typeof firstRegistration !== 'boolean') {
    throw new Error(`Academy interest write failed (${error?.code ?? 'invalid response'})`)
  }
  return { firstRegistration, promotionalEligibility }
}
