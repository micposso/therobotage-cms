export const rpdpCampaign = {
  startsAt: '2026-11-23T00:00:00-05:00',
  endsBefore: '2026-12-01T05:00:00Z',
  timeZone: 'America/New_York',
  discount: 20,
  invitationDays: 7,
  foundingOfferId: 'rpdp-2027-02-founding-v2',
  standardOfferId: 'rpdp-2027-02-standard-v2',
  currency: 'USD',
} as const

export const rpdpPrices = { professional: 49_900, student: 25_000 } as const
export const rpdpAudiences = ['professional', 'student'] as const
export const rpdpInterests = ['design', 'product', 'research', 'other'] as const
export const rpdpSources = ['/learn/rpdp', '/es/learn/rpdp'] as const
export const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content'] as const
export type RpdpQuery = Partial<Record<typeof utmFields[number], string | string[]>>
export type RpdpQuote = {
  founding: boolean
  tuitionMinor: number | null
  currency: string | null
  invitationDays: number | null
}
export const rpdpNoSeat = 'No payment required. Joining the list does not reserve a seat.'
export const rpdpInvitation = 'The complete enrollment invitation will include the confirmed schedule, required tools and costs, assessment requirements, and enrollment terms. You’ll receive these details before payment is requested.'
export const rpdpInvitationWindow = 'Eligible registrants will have {days} days after receiving the complete enrollment invitation to enroll at their preserved rate, subject to available places.'

export function formatRpdpTuition(amountMinor: number, locale: 'en' | 'es', currency: string = rpdpCampaign.currency) {
  const amount = new Intl.NumberFormat(locale === 'es' ? 'es-US' : 'en-US', {
    style: 'currency', currency, currencyDisplay: 'narrowSymbol', minimumFractionDigits: amountMinor % 100 === 0 ? 0 : 2,
  }).format(amountMinor / 100)
  return `${amount} ${currency}`
}

export function rpdpConfirmation(quote: RpdpQuote, locale: 'en' | 'es', t: (text: string) => string) {
  const status = quote.tuitionMinor !== null && quote.currency
    ? t(quote.founding ? 'Your preserved founding tuition is {tuition}.' : 'Your recorded planned standard tuition is {tuition}.')
      .replace('{tuition}', formatRpdpTuition(quote.tuitionMinor, locale, quote.currency))
    : t('Your earlier interest registration remains on file. We’ll follow up with your enrollment details.')
  return [
    t('You’re on the RPDP interest list.'),
    status,
    ...(quote.founding && quote.invitationDays !== null
      ? [t(rpdpInvitationWindow).replace('{days}', String(quote.invitationDays))] : []),
    t(rpdpNoSeat),
    t(rpdpInvitation),
  ]
}

export function isRpdpPromotionActive(timestamp = Date.now()) {
  return timestamp >= Date.parse(rpdpCampaign.startsAt) && timestamp < Date.parse(rpdpCampaign.endsBefore)
}

export const rpdpFoundingPrices = { professional: 39_900, student: 19_900 } as const
