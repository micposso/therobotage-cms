import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import ShareButton from '@/components/NewsArticle/ShareButton'
import JobMetaStrip from '@/components/JobBoard/JobMetaStrip'
import RelatedJobs from '@/components/JobBoard/RelatedJobs'
import {
  buildJobPostingJsonLd,
  getRelatedJobs,
  type JobCard,
  type JobDetail,
} from '@/lib/jobs'
import { getExpiredJobBySlug, getJobSlugs, getLiveJobs } from '@/lib/jobsQueries'
import styles from './page.module.css'

export const revalidate = 3600

// New jobs appear without a deploy, so unknown slugs must render on demand rather than
// 404 until the next build.
export const dynamicParams = true

export async function generateStaticParams() {
  try {
    return (await getJobSlugs()).map((slug) => ({ slug }))
  } catch (error) {
    // A Supabase blip must not fail the build for the entire site. Pages then render on
    // demand instead of being prerendered.
    console.error('Failed to load job slugs for generateStaticParams', error)
    return []
  }
}

type Resolved = { job: JobDetail; expired: boolean } | null

async function resolveJob(slug: string): Promise<Resolved> {
  try {
    const live = (await getLiveJobs()).find((job) => job.slug === slug)
    if (live) return { job: live, expired: false }
  } catch (error) {
    console.error(`Failed to load live jobs for /jobs/${slug}`, error)
  }

  // A page can outlive its expires_at under ISR, and the public_jobs view excludes it.
  // Hard 404ing would discard inbound links and every LinkedIn share, so fall back to a
  // "role has closed" render instead.
  try {
    const expired = await getExpiredJobBySlug(slug)
    if (expired) return { job: expired, expired: true }
  } catch (error) {
    console.error(`Failed to load expired job /jobs/${slug}`, error)
  }

  return null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resolved = await resolveJob(slug)
  if (!resolved) return {}

  const { job, expired } = resolved
  const title = `${job.title} — ${job.companyName}`

  return {
    title: `${title} — The Robot Age`,
    description: job.summary,
    alternates: { canonical: `/jobs/${slug}` },
    // Google requires expired postings to drop their structured data or return 410.
    // Keeping the page indexable would advertise a role nobody can apply to.
    ...(expired && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description: job.summary,
      type: 'article',
      url: `/jobs/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: job.summary,
    },
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const resolved = await resolveJob(slug)
  if (!resolved) notFound()

  const { job, expired } = resolved

  let related: JobCard[] = []
  try {
    related = getRelatedJobs(job, await getLiveJobs())
  } catch {
    related = []
  }

  const applyHref = job.applyUrl ?? (job.applyEmail ? `mailto:${job.applyEmail}` : null)

  return (
    <>
      <Nav pinned />
      <PageHero eyebrow={job.roleFamilyLabel} title={job.title} subtitle={job.summary} />

      <section className={styles.section}>
        <div className="container-fluid">
          <div className={styles.layout}>
            <div className={styles.body}>
              {expired && (
                <p className={styles.closed}>
                  This role has closed. It is kept here so existing links still resolve.
                  Open roles are on the <Link href="/jobs">job board</Link>.
                </p>
              )}

              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: job.descriptionHtml }}
              />

              {job.companyBlurb && (
                <div className={styles.companyBlock}>
                  <p className={styles.eyebrow}>About {job.companyName}</p>
                  <p className={styles.companyBlurb}>{job.companyBlurb}</p>
                  {job.companyWebsite && (
                    <a
                      className={styles.companyLink}
                      href={job.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit {job.companyName}
                    </a>
                  )}
                </div>
              )}
            </div>

            <aside className={styles.sidebar}>
              <JobMetaStrip job={job} />

              {!expired && applyHref && (
                <a
                  className={styles.applyButton}
                  href={applyHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Apply for this role
                </a>
              )}

              <div className={styles.shareRow}>
                <ShareButton label="Share this role" />
              </div>

              <p className={styles.applyNote}>
                Applications are handled by {job.companyName}. The Robot Age does not
                collect applications or take a fee.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <RelatedJobs jobs={related} />

      {!expired && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJobPostingJsonLd(job)).replace(/</g, '\\u003c'),
          }}
        />
      )}

      <Footer />
    </>
  )
}
