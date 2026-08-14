import type { JobCard as JobCardData } from '@/lib/jobs'
import JobCard from './JobCard'
import styles from './RelatedJobs.module.css'

type Props = {
  jobs: JobCardData[]
}

// Renders nothing when nothing scores highly enough. Three padded, unrelated roles are
// worse than two good ones, and worse still than none.
export default function RelatedJobs({ jobs }: Props) {
  if (!jobs.length) return null

  return (
    <section className={styles.section}>
      <div className="container-fluid">
        <p className={styles.eyebrow}>Related roles</p>
        <div className={styles.list}>
          {jobs.map((job) => (
            <JobCard key={job.slug} job={job} />
          ))}
        </div>
      </div>
    </section>
  )
}
