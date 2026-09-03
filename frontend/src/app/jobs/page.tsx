import { Suspense } from 'react'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import JobBoardExplorer from '@/components/JobBoard/JobBoardExplorer'
import JobAlertSignup from '@/components/JobAlerts/JobAlertSignup'
import { buildJobListJsonLd, getJobFacets, type JobCard } from '@/lib/jobs'
import { getJobCards } from '@/lib/jobsQueries'
import styles from './jobs.module.css'

// Statically prerendered, revalidated every 15 minutes, and refreshed on demand by
// scripts/publish-jobs.mjs via /api/revalidate-jobs.
//
// This page deliberately does NOT read searchParams. Doing so would opt the route into
// full dynamic rendering on every request (this project does not set cacheComponents in
// next.config.ts), making /jobs the first non-static page on an otherwise fully static
// site. Filtering happens client-side in JobBoardExplorer, which reads the URL through
// useSearchParams so filtered views stay shareable.
export const revalidate = 900

const TITLE = 'Robotics Product, Design and UX Jobs — The Robot Age'
const DESCRIPTION =
  'Open product, design, UX research, and marketing roles at US robotics companies. Not an engineering board. Filter by discipline, seniority, state, and work mode.'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/jobs' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: '/jobs',
    images: [{ url: '/images/robot.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/robot.png'],
  },
}

// A Supabase outage must degrade this one page, never fail the build for the whole site.
async function loadJobs(): Promise<{ jobs: JobCard[]; failed: boolean }> {
  try {
    return { jobs: await getJobCards(), failed: false }
  } catch (error) {
    console.error('Failed to load jobs for /jobs', error)
    return { jobs: [], failed: true }
  }
}

export default async function JobsPage() {
  const { jobs, failed } = await loadJobs()
  const facets = getJobFacets(jobs)
  const jsonLd = buildJobListJsonLd(jobs, 'https://therobotage.com/jobs')

  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Jobs"
        title="Product and design roles worth reading about."
        subtitle="Product, design, UX research, and marketing roles at US robotics companies — not an engineering board. Every listing is read and categorized before it goes up."
        imageSrc="/images/human.png"
      />

      <section className={styles.section}>
        <div className="container-fluid">
          <JobAlertSignup source="jobs-index" />

          {failed ? (
            <p className={styles.notice}>
              The job board is temporarily unavailable. Please try again shortly.
            </p>
          ) : (
            // useSearchParams inside a prerendered route requires this boundary.
            // Without it, next build fails on this route.
            <Suspense fallback={<p className={styles.notice}>Loading roles...</p>}>
              <JobBoardExplorer jobs={jobs} facets={facets} />
            </Suspense>
          )}
        </div>
      </section>

      {jobs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}

      <Footer />
    </>
  )
}
