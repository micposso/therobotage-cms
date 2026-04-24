import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import ResearchHero from '@/components/research/ResearchHero'
import FrameworkFeature from '@/components/research/FrameworkFeature'
import InstrumentFeature from '@/components/research/InstrumentFeature'
import RobotArchive from '@/components/research/RobotArchive'
import FieldSignals from '@/components/research/FieldSignals'
import LatestNewsSection from '@/components/LatestNewsSection/LatestNewsSection'
import ResearchFooter from '@/components/research/ResearchFooter'
import Footer from '@/components/Footer/Footer'
import styles from './page.module.css'

export const metadata = {
  title: 'Research — The Robot Age',
  description:
    'Original frameworks, field observations, and critical perspectives on the human side of robotics deployment.',
  openGraph: {
    title: 'Research — The Robot Age',
    description: 'Original frameworks, field observations, and critical perspectives on the human side of robotics deployment.',
    images: [{ url: '/images/hand.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hand.png'],
  },
}

export default function ResearchPage() {
  return (
    <div className={styles.page}>
      <Nav pinned />
      <PageHero
        eyebrow="Research"
        title="What we're learning."
        subtitle="Original research, field observations, and critical perspectives on the human side of robotics — published for the people designing what comes next."
        imageSrc="/images/hand.png"
      />
      <ResearchHero />
      <FrameworkFeature />
      <InstrumentFeature />
      <RobotArchive />
      <LatestNewsSection />
      <FieldSignals />
      <ResearchFooter />
      <Footer />
    </div>
  )
}
