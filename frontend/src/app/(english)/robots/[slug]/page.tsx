import { uiText } from '@/lib/i18n/messages'
import { localize } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import FoundingCohort from '@/components/FoundingCohort/FoundingCohort'
import Footer from '@/components/Footer/Footer'
import RobotImageGallery from '@/components/RobotImageGallery/RobotImageGallery'
import RxdScoreModule from './RxdScoreModule'
import { getRobotProfile, getAllRobotProfileSlugs } from '@/lib/robot-profiles'
import { getScoreBySlug } from '@/lib/scores'
import RobotSpecStrip from '@/components/RobotSpecStrip/RobotSpecStrip'
import styles from './page.module.css'
import { translationAlternates } from '@/lib/i18n/content'
import ProfileResearch from '@/components/RXDEvaluation/ProfileResearch'

export async function generateStaticParams() {
  return getAllRobotProfileSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale?: Locale }> }) {
  const { slug, locale = 'en' } = await params
  const robot = localize(getRobotProfile(slug), `/robots/${slug}`, locale)
  if (!robot) return {}
  const score = getScoreBySlug(slug)
  const scoreLabel = score ? ` RXD ${score.compositeScore.toFixed(2)} / 5.0 — ${score.tier}.` : ''
  const description = `${robot.description}${scoreLabel}`
  const title = score
    ? `${robot.title} — RXD ${score.compositeScore.toFixed(2)} / 5.0`
    : `${robot.title} — Robot Profile`
  return {
    title,
    description,
    alternates: {
      canonical: `https://therobotage.com/robots/${slug}`,
      languages: translationAlternates(`/robots/${slug}`),
    },
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: 'The Robot Age',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function RobotProfilePage({ params }: { params: Promise<{ slug: string; locale?: Locale }> }) {
  const { slug, locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const robot = localize(getRobotProfile(slug), `/robots/${slug}`, locale)
  if (!robot) notFound()

  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow={robot.category}
        title={robot.title}
        subtitle={robot.description}
        imageSrc={robot.image}
        images={[robot.image, ...robot.gallery.map((g) => g.src)].filter(Boolean)}
        roundImage
      />

      <RobotSpecStrip locale={locale} robot={robot} />

      {/* Overview */}
      <section className={styles.overviewSection}>
        <div className="container-fluid">
          <div className={styles.overviewLayout}>
            <div>
              <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{t("Overview")}</p>
              <p className={styles.overviewBody}>{robot.overview}</p>
            </div>
            <nav className={styles.profileNav} aria-label={t('On this page')}>
              <a href="#rxd-evaluation">{t('RXD evaluation')} <span aria-hidden="true">01</span></a>
              <a href="#deployment-context">{t('Deployment Context')} <span aria-hidden="true">02</span></a>
              <a href="#commercial-readiness-section">{t('Commercial readiness')} <span aria-hidden="true">03</span></a>
              <a href="#profile-sources">{t('Sources and methodology')} <span aria-hidden="true">04</span></a>
            </nav>
          </div>
        </div>
      </section>

      {/* RXD Scoring */}
      <RxdScoreModule locale={locale} slug={slug} robotName={robot.title} />

      {/* Deployment context */}
      <section id="deployment-context" className={styles.deploymentSection}>
        <div className="container-fluid">
          <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{t("Deployment Context")}</p>
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

      <ProfileResearch slug={slug} locale={locale} section="commercial" />

      {/* Image gallery */}
      {robot.gallery.length > 0 && (
        <section className={styles.gallerySection}>
          <div className="container-fluid">
            <p className={`${styles.eyebrow} ${styles.sectionEyebrow}`}>{t("Field Images")}</p>
            <RobotImageGallery items={robot.gallery} />
          </div>
        </section>
      )}

      <ProfileResearch slug={slug} locale={locale} section="sources" />

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
