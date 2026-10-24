import WhitepaperButton from '@/components/WhitepaperModal/WhitepaperButton'
import { imageUrl } from '@/lib/image-assets'
import Image from '@/components/MediaImage'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import RxdDimensionsGrid from './RxdDimensionsGrid'
import { getAllRobotProfiles } from '@/lib/robot-profiles'
import { getScoreBySlug } from '@/lib/scores'
import styles from './page.module.css'
import Methodology from '@/components/RXDEvaluation/Methodology'
import type { Locale } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'
import { translationAlternates } from '@/lib/i18n/content'

export const metadata = {
  alternates: { canonical: '/rxd', languages: translationAlternates('/rxd') },
  title: 'RXD — Robot Experience Design | The Robot Age',
  description:
    'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
  openGraph: {
    title: 'RXD — Robot Experience Design | The Robot Age',
    description:
      'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
    images: [{ url: imageUrl('/images/hand.png'), alt: 'Robot Experience Design' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RXD — Robot Experience Design | The Robot Age',
    description:
      'A six-dimension evaluation model for assessing the human experience of interacting with robots. Free to download. Built for UX designers, product managers, and human factors researchers.',
    images: [imageUrl('/images/hand.png')],
  },
}

export default async function RxdPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (s: string) => uiText(s, locale)
  const robots = getAllRobotProfiles().map((r) => ({ ...r, score: getScoreBySlug(r.slug) }))

  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow={t("Robot Experience Design (RXD)")}
        title={t("Robots are entering homes, classrooms, and workplaces.")}
        subtitle={t("A six-dimension model for evaluating robot interactions the way users actually experience them — built for practitioners, not engineers.")}
        imageSrc="/images/hand.png"
      />

      {/* Early download CTA */}
      <section className={styles.earlyCtaSection}>
        <div className="container-fluid">
          <div className={styles.earlyCtaInner}>
            <WhitepaperButton
              className={styles.earlyCtaButton}
            >{t("Download the White Paper (v2.0) →")}</WhitepaperButton>
            <span className={styles.earlyCtaMeta}>{t("PDF · Free · CC BY-NC 4.0")}</span>
          </div>
        </div>
      </section>

      {/* Six dimensions */}
      <section className={styles.dimensionsSection}>
        <div className="container-fluid">
          <h2 className={styles.sectionHeadline}>{t("The six dimensions of")}<br />{t("Robot Experience Design")}</h2>
          <RxdDimensionsGrid />
        </div>
      </section>

      <Methodology locale={locale} />
      {/* Robot grid */}
      <section className={styles.robotGridSection}>
        <div className="container-fluid">
          <div className={styles.robotGrid}>
            {robots.map((robot) => (
              <Link key={robot.slug} href={`/robots/${robot.slug}`} className={styles.robotCardLink}>
                <div className={styles.robotCard}>
                  <div className={styles.robotCardThumb}>
                    <Image
                      src={robot.image}
                      alt={robot.title}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className={styles.robotCardTitle}>{robot.title}</h3>
                  {robot.manufacturer && (
                    <p className={styles.robotCardManufacturer}>{robot.manufacturer}</p>
                  )}
                  {robot.score ? (
                    <div className={styles.robotCardScore}>
                      <span>{t('Historical RXD score')}</span>
                      <span className={`type-heading ${styles.robotCardScoreValue}`}>
                        {robot.score.compositeScore.toFixed(1)}<span className={styles.robotCardScoreMax}>{t("&thinsp;/&thinsp;5")}</span>
                      </span>
                      <span className={styles.robotCardScoreTier}>{robot.score.tier}</span>
                    </div>
                  ) : (
                    <p className={styles.robotCardManufacturer}>{t("Score pending")}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Who this is for + About (merged) */}
      <section className={styles.practitionersSection}>
        <div className="container-fluid">
          <p className={styles.eyebrow}>{t("Who this is for")}</p>
          <div className={styles.textBlock}>
            <h2 className={styles.sectionHeadline}>{t("Built for practitioners, not engineers.")}</h2>
            <ul className={styles.audienceList}>
              <li>{t("UX designers")}</li>
              <li>{t("Product managers")}</li>
              <li>{t("Human factors researchers")}</li>
              <li>{t("Educators")}</li>
            </ul>
            <p className={styles.sectionBody}>{t("Developed by Mike Posso through The Robot Age, a research and education platform preparing non-engineering professionals for consumer robotics. The framework draws on active graduate research at SUNY Polytechnic Institute and professional experience in product engineering leadership.")}</p>
          </div>
        </div>
      </section>

      {/* Download CTA — dark section */}
      <section className={styles.downloadSection}>
        <div className="container-fluid">
          <div className={styles.downloadInner}>
            <p className={styles.eyebrowDark}>{t("Download")}</p>
            <h2 className={styles.downloadHeadline}>{t("Take the framework with you.")}</h2>
            <p className={styles.downloadSubheadline}>{t("The white paper includes:")}</p>
            <ul className={styles.downloadList}>
              <li>{t("Evaluation criteria and scoring rubrics for all six dimensions")}</li>
              <li>{t("A structured worksheet for assessing any robot product or deployment")}</li>
              <li>{t("Methodology, research background, and application guidance")}</li>
            </ul>
            <div className={styles.downloadCta}>
              <WhitepaperButton
                className={styles.downloadButton}
              >{t("Download the RXD White Paper (v2.0) →")}</WhitepaperButton>
              <p className={styles.downloadSubtext}>{t("PDF, free to download. Licensed CC BY-NC 4.0.")}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
