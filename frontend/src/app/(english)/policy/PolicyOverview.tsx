import { policyCategories, policyJurisdictions, type RobotPolicy } from '@/lib/robotPolicy'
import styles from './policy.module.css'

export default function PolicyOverview({ policies }: { policies: readonly RobotPolicy[] }) {
  const totals = [
    { label: 'Policies tracked', count: policies.length },
    { label: 'Categories tracked', count: policyCategories.length },
  ]
  const jurisdictions = Object.entries(policyJurisdictions).map(([jurisdiction, label]) => ({
    label,
    count: policies.filter((policy) => policy.jurisdiction === jurisdiction).length,
  }))

  return (
    <div className={styles.overview} role="group" aria-label="Policy coverage at a glance">
      {totals.map(({ label, count }, index) => (
        <dl key={label} className={`${styles.overviewMetric} ${styles.overviewHighlight}`} style={{ animationDelay: `${index * 120}ms` }}>
          <dt>{label}</dt>
          <dd>{count}</dd>
        </dl>
      ))}
      <dl className={styles.jurisdictionGroup} aria-label="Policies by jurisdiction">
        {jurisdictions.map(({ label, count }, index) => (
          <div key={label} className={styles.overviewMetric} style={{ animationDelay: `${(index + 2) * 120}ms` }}>
            <dt>{label}</dt>
            <dd>{count}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
