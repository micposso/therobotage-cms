import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
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
import { translationAlternates } from '@/lib/i18n/content'

export const metadata = {
  alternates: { canonical: '/research', languages: translationAlternates('/research') },
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

export default async function ResearchPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  return (
    <div className={styles.page}>
      <Nav pinned />
      <PageHero
        eyebrow={t("Research")}
        title={t("What we're learning")}
        subtitle={t("Original research, frameworks, and critical perspectives on the human side of robotics — published for the people designing what comes next.")}
        imageSrc="/images/hand.png"
      />
      <ResearchHero />
      <FrameworkFeature />
      <InstrumentFeature />
      <RobotArchive />
      <LatestNewsSection locale={locale} />
      <FieldSignals />
      <ResearchFooter />
      <Footer />
    </div>
  )
}
