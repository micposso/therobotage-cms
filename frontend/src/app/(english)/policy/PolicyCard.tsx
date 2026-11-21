import { policyJurisdictions, policyRobotTypes, policyStatuses, type RobotPolicy } from '@/lib/robotPolicy'
import RobotTypeIcon from './RobotTypeIcon'
import styles from './policy.module.css'

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

function PolicyDate({ value }: { value: string }) {
  return <time dateTime={value}>{dateFormatter.format(new Date(value))}</time>
}

export default function PolicyCard({ policy }: { policy: RobotPolicy }) {
  return (
    <li className={styles.card}>
      <div className={styles.cardBadges}>
        <span className={styles.jurisdiction} title={policyJurisdictions[policy.jurisdiction]}>
          {policy.jurisdiction}
        </span>
        <span className={styles.status} data-status={policy.status}>
          {policyStatuses[policy.status]}
        </span>
      </div>
      <h3 className={styles.cardTitle}>{policy.title}</h3>
      {(policy.identifier || policy.locality) && (
        <div className={styles.reference}>
          {policy.identifier && <span>{policy.identifier}</span>}
          {policy.locality && <span>{policy.locality}</span>}
        </div>
      )}
      <p className={styles.cardSummary}>{policy.summary}</p>
      <div className={styles.robotScope}>
        <p className={styles.scopeLabel}>Robot relevance <span className={styles.policyType}>{policy.policyType}</span></p>
        <ul className={styles.robotTypes} aria-label="Relevant robot types">
          {policy.robotTypes.map((type) => (
            <li key={type}>
              <span className={styles.robotIcon}><RobotTypeIcon type={type} /></span>
              <span>{policyRobotTypes[type]}</span>
            </li>
          ))}
        </ul>
        <p className={styles.scopeNote}>Applicability depends on use and the policy&apos;s scope.</p>
      </div>
      <dl className={styles.details}>
        <div><dt>Category</dt><dd>{policy.category}</dd></div>
        <div><dt>Last verified</dt><dd><PolicyDate value={policy.lastVerifiedAt} /></dd></div>
        {policy.effectiveAt && (
          <div><dt>Effective date</dt><dd><PolicyDate value={policy.effectiveAt} /></dd></div>
        )}
      </dl>
      <a
        className={styles.source}
        href={policy.sourceUrl}
        aria-label={`View Official Source for ${policy.title} at ${policy.sourceName}`}
      >
        View Official Source <span aria-hidden="true">→</span>
      </a>
    </li>
  )
}
