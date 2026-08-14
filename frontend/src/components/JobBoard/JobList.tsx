import type { JobCard as JobCardData } from '@/lib/jobs'
import JobCard from './JobCard'
import styles from './JobList.module.css'

type Props = {
  jobs: JobCardData[]
  emptyMessage?: string
}

export default function JobList({ jobs, emptyMessage }: Props) {
  if (!jobs.length) {
    return (
      <p className={styles.empty}>
        {emptyMessage ?? 'No roles match those filters. Try widening the search.'}
      </p>
    )
  }

  return (
    <div className={styles.list}>
      {jobs.map((job) => (
        <JobCard key={job.slug} job={job} />
      ))}
    </div>
  )
}
