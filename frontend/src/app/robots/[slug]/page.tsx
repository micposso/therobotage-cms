import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import FoundingCohort from '@/components/FoundingCohort/FoundingCohort'
import Footer from '@/components/Footer/Footer'
import RobotImageGallery from '@/components/RobotImageGallery/RobotImageGallery'
import RxdScoreModule from './RxdScoreModule'
import { getRobotProfile, getAllRobotProfileSlugs } from '@/lib/robot-profiles'
import styles from './page.module.css'

export async function generateStaticParams() {
  return getAllRobotProfileSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const robot = getRobotProfile(slug)
  if (!robot) return {}
  return {
    title: `${robot.title} — Robot Profile — The Robot Age`,
    description: robot.description,
    openGraph: {
      title: robot.title,
      description: robot.description,
      images: [{ url: robot.image, alt: robot.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: robot.title,
      description: robot.description,
      images: [robot.image],
    },
  }
}

export default async function RobotProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const robot = getRobotProfile(slug)
  if (!robot) notFound()

  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow={robot.category}
        title={robot.title}
        subtitle={robot.description}
        imageSrc={robot.image}
      />

      {/* Overview */}
      <section className={styles.overviewSection}>
        <div className="container-fluid">
          <div className={styles.overviewInner}>
            <p className={styles.eyebrow}>Overview</p>
            <p className={styles.overviewBody}>{robot.overview}</p>
          </div>
        </div>
      </section>

      {/* RXD Scoring */}
      <RxdScoreModule slug={slug} robotName={robot.title} />

      {/* Image gallery */}
      {robot.gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <div className="container-fluid">
            <p className={styles.eyebrow}>Field Images</p>
            <RobotImageGallery items={robot.gallery} />
          </div>
        </section>
      )}

      {/* Deployment context */}
      <section className={styles.deploymentSection}>
        <div className="container-fluid">
          <p className={styles.eyebrow}>Deployment Context</p>
          <div className={styles.deploymentGrid}>
            {robot.deploymentBoxes.map((box) => (
              <div key={box.label} className={styles.deploymentBox}>
                <p className={styles.deploymentBoxLabel}>{box.label}</p>
                <h3 className={styles.deploymentBoxTitle}>{box.title}</h3>
                <p className={styles.deploymentBoxBody}>{box.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cohort promo */}
      <section className={styles.cohortSection}>
        <div className="container-fluid">
          <FoundingCohort />
        </div>
      </section>

      <Footer />
    </>
  )
}
