import type { JobDetail } from '@/lib/jobs'
import { formatLocation, formatPostedDate, formatSalary } from '@/lib/jobs'
import {
  EMPLOYMENT_TYPE_LABELS,
  REMOTE_TYPE_LABELS,
  SENIORITY_LABELS,
} from '@/lib/jobsTaxonomy'
import styles from './JobMetaStrip.module.css'

type Props = {
  job: JobDetail
}

// Key/value list following DESIGN_SYSTEM 4.7: strong top border, hairline separators.
export default function JobMetaStrip({ job }: Props) {
  const salary = formatSalary(job)

  const items: { label: string; value: string }[] = [
    { label: 'Company', value: job.companyName },
    { label: 'Location', value: formatLocation(job) },
    { label: 'Work mode', value: REMOTE_TYPE_LABELS[job.remoteType] ?? job.remoteType },
    { label: 'Level', value: SENIORITY_LABELS[job.seniority] ?? job.seniority },
    { label: 'Type', value: EMPLOYMENT_TYPE_LABELS[job.employmentType] ?? job.employmentType },
    { label: 'Discipline', value: job.roleFamilyLabel },
    { label: 'Compensation', value: salary ?? 'Not disclosed' },
    { label: 'Posted', value: formatPostedDate(job.postedAt) },
    { label: 'Closes', value: formatPostedDate(job.expiresAt) },
  ]

  return (
    <dl className={styles.list}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
