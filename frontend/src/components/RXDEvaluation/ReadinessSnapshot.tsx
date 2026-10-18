import type { RXDPackage } from '@/lib/rxd/schema'
import { availabilityLabels, deploymentLabels } from '@/lib/rxd/registry'
import type { Locale } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'
import styles from './ReadinessSnapshot.module.css'

const symbols = [
  <path key="product" d="m4 7 8-4 8 4v10l-8 4-8-4V7Zm0 0 8 4 8-4M12 11v10M8 5l8 4" />,
  <path key="purchase" d="M4 8h16l-1 13H5L4 8Zm4 0V6a4 4 0 0 1 8 0v2" />,
  <path key="setup" d="M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6" />,
  <path key="deployment" d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM9 10a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />,
]

export default function ReadinessSnapshot({ record, locale }: { record: RXDPackage; locale: Locale }) {
  const t = (value: string) => uiText(value, locale)
  const { robot, evidence } = record
  const productSource = evidence.find(e => e.id === 'product')
  const tiles = [
    { label: 'Product maturity', value: robot.commerciallyReleased ? 'Commercially released' : 'Release not verified', detail: 'Product documentation', href: productSource?.url, date: productSource?.accessedAt },
    { label: 'Purchase availability', value: availabilityLabels[robot.availability], detail: 'Direct manufacturer purchase', href: robot.acquisition.url, date: robot.acquisition.verifiedAt },
    { label: 'Setup requirements', value: deploymentLabels[robot.deployment], detail: 'See preparation notes below', href: '#readiness-preparation', date: null },
    // Deployment context describes intended use; it is not a registry of verified installations.
    { label: 'Documented deployments', value: 'Not verified in this profile', detail: 'No sourced deployment records in this profile.', href: null, date: null },
  ]
  return <>
    <dl className={styles.snapshot}>
      {tiles.map((tile, index) => <div className={styles.tile} key={tile.label}>
        <dt><span className={`${styles.icon} ${index === 3 ? styles.unverified : ''}`} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{symbols[index]}</svg></span><span>{t(tile.label)}</span></dt>
        <dd className={styles.value}>{t(tile.value)}</dd>
        <dd className={styles.source}>{tile.href ? <a href={tile.href}>{t(tile.detail)} <span aria-hidden="true">↗</span></a> : t(tile.detail)}
          {tile.date && <span className={styles.date}>{t('Checked')} <time dateTime={tile.date}>{tile.date}</time></span>}
        </dd>
      </div>)}
    </dl>
    <div className={styles.notes}>
      <div><h3>{t('Ordering notes')}</h3><p>{t(robot.acquisition.notes)}</p></div>
      <div id="readiness-preparation"><h3>{t('Before you deploy')}</h3><ul>{robot.prerequisites.map(item => <li key={item}>{t(item)}</li>)}</ul></div>
    </div>
    <p className={styles.disclaimer}>{t('An evidence snapshot, not a readiness score or certification. These indicators describe separate aspects of the product; they are not sequential stages.')}</p>
  </>
}
