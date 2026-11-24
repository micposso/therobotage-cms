'use client'

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import { rpdpProgram } from '@/lib/certifications'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import {
  formatRpdpTuition, foundingPrice, isRpdpPromotionActive, rpdpAudiences, rpdpCampaign,
  rpdpInvitation, rpdpInvitationWindow, rpdpNoSeat, rpdpPrices, type RpdpQuery,
} from '@/lib/rpdp-registration'
import AccessForm from '../../access/AccessForm'
import cohort from '@/components/FoundingCohort/FoundingCohort.module.css'
import certification from '@/components/Certification/Certification.module.css'
import styles from './RpdpPage.module.css'

const OfferActive = createContext(false)
const foundingLabel = 'Join the Founding Cohort List'
const generalLabel = 'Join the February Cohort List'
export const rpdpSignup = 'founding-cohort-list'

function subscribeToOfferClock(update: () => void) {
  let timer: number
  const sync = () => {
    window.clearTimeout(timer)
    const now = Date.now()
    const next = [rpdpCampaign.startsAt, rpdpCampaign.endsBefore].map(Date.parse).find(time => time > now)
    if (next !== undefined) timer = window.setTimeout(sync, Math.min(next - now, 2_147_483_647))
    update()
  }
  sync()
  window.addEventListener('pageshow', sync)
  window.addEventListener('focus', sync)
  document.addEventListener('visibilitychange', sync)
  return () => {
    window.clearTimeout(timer)
    window.removeEventListener('pageshow', sync)
    window.removeEventListener('focus', sync)
    document.removeEventListener('visibilitychange', sync)
  }
}

export function RpdpOfferState({ active, children }: { active: boolean; children: ReactNode }) {
  // The clock updates display only. The database decides eligibility when accepting a submission.
  const current = useSyncExternalStore(subscribeToOfferClock, isRpdpPromotionActive, () => active)
  return <OfferActive.Provider value={active && current}>{children}</OfferActive.Provider>
}

export function RpdpSignupLink({ locale, placement }: { locale: Locale; placement: 'hero' | 'mobile' }) {
  const active = useContext(OfferActive)
  return <a className={cohort.cta} href={`#${rpdpSignup}`} data-rpdp-cta={placement}>
    {uiText(active ? 'Get the Founding Rate' : generalLabel, locale)}
  </a>
}

export function RpdpOfferPanel({ locale, source, query }: { locale: Locale; source: string; query: RpdpQuery }) {
  const active = useContext(OfferActive)
  const t = (text: string) => uiText(text, locale)
  const intlLocale = locale === 'es' ? 'es-US' : 'en-US'
  const discount = new Intl.NumberFormat(intlLocale, { style: 'percent' }).format(rpdpCampaign.discount / 100)
  const finalMinute = Date.parse(rpdpCampaign.endsBefore) - 60_000
  const date = new Intl.DateTimeFormat(intlLocale, { dateStyle: 'long', timeZone: rpdpCampaign.timeZone }).format(finalMinute)
  const time = new Intl.DateTimeFormat(intlLocale, { timeStyle: 'short', timeZone: rpdpCampaign.timeZone })
    .format(finalMinute).replace('PM', 'p.m.')
  const label = active ? foundingLabel : generalLabel
  const terms = t(rpdpInvitationWindow).replace('{days}', String(rpdpCampaign.invitationDays))
  const facts = t('Paid cohort: maximum {capacity} participants, with up to {places} student-rate places. Includes {reviews} individual milestone reviews and final project assessment.')
    .replace('{capacity}', String(rpdpProgram.capacity))
    .replace('{reviews}', String(rpdpProgram.milestoneWeeks.length))
    .replace('{places}', String(rpdpProgram.studentPlaces))

  return <aside id={rpdpSignup} tabIndex={-1} aria-labelledby="rpdp-signup-title" className={styles.signup}>
    <h2 id="rpdp-signup-title" className={certification.courseTitle}>{t(label)}</h2>
    <p className={styles.formNote}>{t('Target start')} · {t(rpdpProgram.targetStart)}</p>
    {active && <p className={styles.promotion}>{t('Save {discount} on founding tuition').replace('{discount}', discount)}</p>}
    <dl className={`${cohort.pricing} ${styles.prices}`}>
      {rpdpAudiences.map(audience => <div key={audience}>
        <dt>{t(audience === 'professional' ? 'Professional' : 'Student')}</dt>
        {active && <dd className={cohort.priceMeta}>{t('Founding tuition')} <strong>{formatRpdpTuition(foundingPrice(rpdpPrices[audience]), locale)}</strong></dd>}
        <dd className={cohort.priceMeta}>{t('Planned standard tuition')} {formatRpdpTuition(rpdpPrices[audience], locale)}</dd>
      </div>)}
    </dl>
    <p className={styles.formNote}>{facts}</p>
    {active && <p id="rpdp-founding-terms" className={styles.formNote}>
      {t('Join by {date}, at {time} New York time to preserve the founding tuition for the {cohort} cohort.')
        .replace('{date}', date).replace('{time}', time).replace('{cohort}', t(rpdpProgram.targetStart))} {terms}
    </p>}
    <p id="rpdp-form-note" className={styles.formNote}>{t(rpdpNoSeat)}</p>
    <AccessForm locale={locale} interest="rpdp" buttonLabel={label} rpdp={{ source, query }}
      describedBy={active ? 'rpdp-form-note rpdp-founding-terms' : 'rpdp-form-note'} />
    <p className={styles.formNote}>{t(rpdpInvitation)}</p>
  </aside>
}

export function RpdpOfferFaqCopy({ locale, part }: { locale: Locale; part: 'question' | 'answer' }) {
  const active = useContext(OfferActive)
  const t = (text: string) => uiText(text, locale)
  if (part === 'question') return t(active ? 'What does joining the founding list secure?' : 'What does joining the list secure?')
  return active
    ? t(rpdpInvitationWindow).replace('{days}', String(rpdpCampaign.invitationDays))
    : t('We’ll use your registration to share enrollment details for the February cohort.')
}
