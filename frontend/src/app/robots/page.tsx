import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import RobotGrid from '@/components/RobotGrid/RobotGrid'
import Footer from '@/components/Footer/Footer'
import { getAllRobotProfiles } from '@/lib/robot-profiles'
import { getScoreBySlug } from '@/lib/scores'
import styles from './page.module.css'

export const metadata = {
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

export default function RobotsPage() {
  const robots = getAllRobotProfiles().map((robot) => ({
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
        eyebrow="RXD Robot Index"
        title="Every robot we've evaluated."
        subtitle="Scored across six dimensions of human-robot experience — Signal Clarity, Spatial Legibility, Perceived Presence, Failure Transparency, Interaction Fit, and Recovery Design."
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
