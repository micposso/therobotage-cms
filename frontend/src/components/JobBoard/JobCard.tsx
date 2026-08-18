import Link from 'next/link'
import type { JobCard as JobCardData } from '@/lib/jobs'
import { PLACEHOLDER_LOGO_URL, formatLocation, formatSalary } from '@/lib/jobs'
import { EMPLOYMENT_TYPE_LABELS, SENIORITY_LABELS } from '@/lib/jobsTaxonomy'
import styles from './JobCard.module.css'

type Props = {
  job: JobCardData
}

// A job board is a list, not a gallery: one row per role, separated by hairlines rather
// than boxed. Follows DESIGN_SYSTEM 4.3's border-separator rule.
export default function JobCard({ job }: Props) {
  const salary = formatSalary(job)

  return (
    <Link href={`/jobs/${job.slug}`} className={styles.card}>
      <div
        className={styles.logo}
        style={{ backgroundImage: `url(${job.companyLogoUrl ?? PLACEHOLDER_LOGO_URL})` }}
        role="img"
        aria-label={`${job.companyName} logo`}
      />

      <div className={styles.main}>
        <p className={styles.company}>{job.companyName}</p>
        <h3 className={styles.title}>{job.title}</h3>
        <p className={styles.summary}>{job.summary}</p>

        <ul className={styles.meta}>
          <li>{formatLocation(job)}</li>
          <li>{SENIORITY_LABELS[job.seniority] ?? job.seniority}</li>
          <li>{EMPLOYMENT_TYPE_LABELS[job.employmentType] ?? job.employmentType}</li>
          <li>{job.roleFamilyLabel}</li>
        </ul>
      </div>

      <div className={styles.aside}>
        {salary ? (
          <span className={styles.salary}>{salary}</span>
        ) : (
          <span className={styles.salaryMissing}>Salary not disclosed</span>
        )}
        <span className={styles.cta} aria-hidden="true">
          View role
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className={styles.arrow}>
            <path d="M11 1L15 5L11 9" stroke="currentColor" strokeWidth="1" />
            <path d="M15 5H0" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
