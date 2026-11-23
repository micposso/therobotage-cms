import type { Locale } from './i18n/routing'

type RpdpEvent =
  | { event: 'rpdp_page_view' | 'rpdp_capstone_interaction' | 'rpdp_interest_form_start' | 'rpdp_interest_form_error' }
  | { event: 'rpdp_primary_cta_click'; placement: 'hero' | 'mobile' }
  | { event: 'rpdp_curriculum_toggle'; week: number; expanded: boolean }
  | { event: 'rpdp_interest_form_success' | 'rpdp_promotional_eligibility'; promotional_eligibility: boolean }

export function trackRpdp(locale: Locale, payload: RpdpEvent) {
  const layer = (window as Window & { dataLayer?: object[] }).dataLayer
  layer?.push({ page_path: locale === 'es' ? '/es/learn/rpdp' : '/learn/rpdp', language: locale, ...payload })
}
