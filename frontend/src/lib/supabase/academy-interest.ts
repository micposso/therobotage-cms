import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { rpdpProgram } from '@/lib/certifications'
import { rpdpFoundingPrices, rpdpAudiences, rpdpCampaign, rpdpInterests, rpdpPrices, rpdpSources, utmFields } from '../rpdp-registration'

const registration = z.object({
  fullName: z.string().trim().min(1).max(254),
  audience: z.enum(rpdpAudiences),
  primaryInterest: z.enum(rpdpInterests).nullable(),
  marketingConsent: z.enum(['on']).nullable(),
  sourcePage: z.enum(rpdpSources),
})

const recordedOffer = z.object({
  firstRegistration: z.boolean(),
  founding: z.boolean(),
  tuitionMinor: z.number().int().positive().nullable(),
  currency: z.string().regex(/^[A-Z]{3}$/).nullable(),
  invitationDays: z.number().int().positive().nullable(),
})

export async function registerRpdp(form: FormData, email: string) {
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

  const client = createClient(url, key, { accessToken: async () => token })
  const { data, error } = await client.rpc('record_academy_interest_offer', {
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
    p_starts_at: rpdpCampaign.startsAt,
    p_ends_before: rpdpCampaign.endsBefore,
    p_founding_offer_id: rpdpCampaign.foundingOfferId,
    p_standard_offer_id: rpdpCampaign.standardOfferId,
    p_founding_tuition_minor: rpdpFoundingPrices[audience],
    p_standard_tuition_minor: rpdpPrices[audience],
    p_currency: rpdpCampaign.currency,
    p_invitation_days: rpdpCampaign.invitationDays,
  })
  const saved = recordedOffer.safeParse(data)
  if (error || !saved.success) {
    throw new Error(`Academy interest write failed (${error?.code ?? 'invalid response'})`)
  }
  const { firstRegistration, ...quote } = saved.data
  return { firstRegistration, quote }
}
