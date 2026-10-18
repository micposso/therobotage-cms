import { imageUrl } from '@/lib/image-assets'
import { uiText } from '@/lib/i18n/messages'
import { localize } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import RobotGrid from '@/components/RobotGrid/RobotGrid'
import Footer from '@/components/Footer/Footer'
import { getAllRobotProfiles } from '@/lib/robot-profiles'
import { getScoreBySlug } from '@/lib/scores'
import { getRXDRecord, protocols } from '@/lib/rxd/registry'
import { eligibleRobot, evaluationSummary } from '@/lib/rxd/schema'
import styles from './page.module.css'
import { translationAlternates } from '@/lib/i18n/content'

export const metadata = {
  alternates: { canonical: '/robots', languages: translationAlternates('/robots') },
  title: 'Robot Index — The Robot Age',
  description: 'Explore commercially available robots through independent research, evidence-based observations, and hands-on evaluations using The Robot Age’s Robot Experience Design (RXD) framework.',
  openGraph: {
    title: 'Robot Index — The Robot Age',
    description: 'Understanding robots through human experience. Commercial availability, deployment readiness and transparent RXD research.',
    images: [{ url: imageUrl('/images/robot.png'), alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [imageUrl('/images/robot.png')],
  },
}

export default async function RobotsPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const robots = getAllRobotProfiles().filter(robot => {
    const record = getRXDRecord(robot.slug)
    return record && eligibleRobot(record.robot, record.evidence)
  }).map(robot => localize(robot, `/robots/${robot.slug}`, locale)).map((robot) => ({
    slug: robot.slug,
    title: robot.title,
    manufacturer: robot.manufacturer,
    thumbnailImage: robot.image,
    excerpt: robot.description,
    score: getScoreBySlug(robot.slug),
    commercial: getRXDRecord(robot.slug)!.robot,
    method: 'historical' as const,
    evaluationDate: null,
    completeScore: evaluationSummary(getRXDRecord(robot.slug)!, protocols).overall,
  }))

  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow={t("RXD Robot Index")}
        title={t("Understanding robots through human experience.")}
        subtitle={t("Explore commercially available robots through independent research, evidence-based observations, and hands-on evaluations using The Robot Age's Robot Experience Design (RXD) framework.")}
      />
      <section className={styles.section}>
        <div className="container-fluid">
          <RobotGrid robots={robots} />
        </div>
      </section>
      <Footer />
    </>
  )
}
