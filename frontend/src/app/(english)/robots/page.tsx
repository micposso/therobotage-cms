import { uiText } from '@/lib/i18n/messages'
import { localize } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import RobotGrid from '@/components/RobotGrid/RobotGrid'
import Footer from '@/components/Footer/Footer'
import { getAllRobotProfiles } from '@/lib/robot-profiles'
import { getScoreBySlug } from '@/lib/scores'
import styles from './page.module.css'
import { translationAlternates } from '@/lib/i18n/content'

export const metadata = {
  alternates: { canonical: '/robots', languages: translationAlternates('/robots') },
  title: 'Robot Index — The Robot Age',
  description: 'Every robot evaluated through the RXD framework. Scored across six dimensions of human-robot experience.',
  openGraph: {
    title: 'Robot Index — The Robot Age',
    description: 'Every robot evaluated through the RXD framework. Scored across six dimensions of human-robot experience.',
    images: [{ url: '/images/robot.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/robot.png'],
  },
}

export default async function RobotsPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const robots = getAllRobotProfiles().map(robot => localize(robot, `/robots/${robot.slug}`, locale)).map((robot) => ({
    slug: robot.slug,
    title: robot.title,
    manufacturer: robot.manufacturer,
    thumbnailImage: robot.image,
    excerpt: robot.description,
    score: getScoreBySlug(robot.slug),
  }))

  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow={t("RXD Robot Index")}
        title={t("Every robot we've evaluated.")}
        subtitle={t("Scored across six dimensions of human-robot experience — Signal Clarity, Spatial Legibility, Perceived Presence, Failure Transparency, Interaction Fit, and Recovery Design.")}
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
