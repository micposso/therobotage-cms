import Link from 'next/link'
import { getRXDRecord } from '@/lib/rxd/registry'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import styles from './RXDEvaluation.module.css'
import layout from './ProfileResearch.module.css'
import ReadinessSnapshot from './ReadinessSnapshot'

export default function ProfileResearch({ slug, locale, section = 'commercial' }: { slug: string; locale: Locale; section?: 'commercial' | 'sources' }) {
  const record = getRXDRecord(slug)
  if (!record) return null
  const t = (s: string) => uiText(s, locale)
  const { evidence, revisions } = record
  const preparationRequired = ['developer', 'integration'].includes(record.robot.deployment)
  const readinessStep = record.robot.deployment === 'developer' ? 0 : record.robot.deployment === 'integration' ? 1 : 3
  const readinessSteps = ['Development needed', 'Integration needed', 'Setup & validation', 'Ready for intended use']
  return <>
    {section === 'commercial' && <section id="commercial-readiness-section" className={styles.section} aria-labelledby="commercial-readiness"><div className={styles.inner}>
      <div className={layout.commercialLayout}><header className={layout.commercialHeader}>
        <div className={layout.readinessIntro}>
          <h2 id="commercial-readiness">{t('Commercial readiness')}</h2>
          <div className={layout.deploymentIndicator}>
            <span className={layout.indicatorLabel}>{t('Ready to deploy?')}</span>
            <strong>{t(preparationRequired ? 'Not ready for immediate deployment' : 'Ready for intended use')}</strong>
            <ol className={layout.indicatorTrack} aria-label={t('Deployment preparation guide')}>
              {readinessSteps.map((step, index) => <li key={step} data-active={index === readinessStep} aria-current={index === readinessStep ? 'step' : undefined}>
                <span className={layout.heatBlock} aria-hidden="true">{index === readinessStep ? '▼' : ''}</span>
                <span className={layout.heatLabel}>{t(step)}</span>
              </li>)}
            </ol>
            <span className={layout.indicatorNote}>{t(preparationRequired ? 'Setup, programming or integration is needed before use.' : 'Confirm the intended environment and operating requirements before use.')}</span>
          </div>
        </div>
        <div className={layout.logoFrame}>
          {/* Replace the placeholder with MediaImage using the verified R2 logo asset. */}
          <div className={layout.logoPlaceholder}>{t('RXD logo placeholder')}</div>
        </div>
      </header><ReadinessSnapshot record={record} locale={locale} /></div>
    </div></section>}
    {section === 'sources' && <section id="profile-sources" className={`${styles.section} ${layout.evaluation}`} aria-labelledby="sources-heading"><div className={styles.inner}>
      <h2 id="sources-heading">{t('Sources and methodology')}</h2>
      <div className={layout.support}><div className={layout.sources}><div className={layout.subheading}><h3>{t('Evidence and observations')}</h3><p>{evidence.length} {t('Sources')}</p></div>
      {evidence.map(e => <details key={e.id}><summary><span>{t(e.title)}<small className={layout.sourceMeta}>{t(e.provenance)} · {t('Accessed')}: {e.accessedAt}</small></span><span className={layout.toggle} aria-hidden="true">+</span></summary><div>
        <p><a href={e.url}>{t('Source')}</a> · {t('Accessed')}: {e.accessedAt} · {t(e.provenance)} · {t(e.independence)}</p>
        <p>{t('Publication date')}: {e.publicationDate ?? t('Not recorded')}</p><p>{t(e.context)}</p><p>{t(e.locator)}</p>
        <ul>{e.observations.map(o => <li key={o}>{t(o)}</li>)}</ul><ul>{e.limitations.map(l => <li key={l}>{t(l)}</li>)}</ul>
      </div></details>)}
      <p className={layout.disclosure}>{t('Historical payment, manufacturer relationships and participation were not recorded. No new claim of independence is inferred.')}</p>
      </div><aside className={layout.methodology}><h3>{t('About this evaluation')}</h3>
      <p>{t('The published RXD scores and original observations are preserved. Reassessment under methodology 1.0 is pending.')}</p>
      <Link href={`${locale === 'es' ? '/es' : ''}/rxd#how-we-evaluate`}>{t('Read the RXD evaluation methodology')}</Link>
      <details className={layout.revisions}><summary>{t('Methodology review details')}<span className={layout.toggle} aria-hidden="true">+</span></summary><div>
        <p>{t(slug === 'unitree-go2-pro' ? 'The original profile reports about one hour of hands-on use. Missing controlled procedures and trial records prevent a Level 3 classification.' : 'The original profile contains editorial observations, but the observation method is not documented well enough to assign an assessment level.')}</p>
        <p>{t('Original date not recorded')}. {t('Historical: not recorded. New record: 1.0, pending review.')}</p>
        <p>{t('Existing product specifications and editorial observations below are historical; current configurations may differ.')}</p>
        <a href="https://www.nist.gov/el/intelligent-systems-division-73500/standard-test-methods-response-robots">{t('Reference: NIST Standard Test Methods for Response Robots')}</a>
        <p>{t('A methodological reference only. Commercial availability and RXD assessments do not imply NIST certification or endorsement. Historical scores were not produced using NIST-informed procedures.')}</p>
      </div></details>
      </aside></div><details className={layout.revisions}><summary><span>{t('Revision history')}</span><span className={layout.toggle} aria-hidden="true">+</span></summary><div>
      {revisions.map(r => <p key={r.version}>{r.date} · {t('Migration record')} {r.version} · {t('Human review pending')}. {t(r.description)} {t(r.reason)}</p>)}
      </div></details>
    </div></section>}
  </>
}
