import { contentHref } from '@/lib/i18n/localize'
import { pageMetadata } from '@/lib/i18n/page-metadata'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import LiveRobotLabRequestForm from './LiveRobotLabRequestForm'
import {
  AudienceLevels,
  ExperiencePrinciples,
  FinalCTA,
  IncludedSection,
  LabTimeline,
  LearningOutcomes,
  LiveRobotLabFAQ,
  LiveRobotLabHero,
  LiveRobotLabVideo,
  PricingOptions,
  RobotShowcase,
  Section,
  SocialProof,
} from './Sections'
import styles from './live-robot-lab.module.css'

const title = 'Live Robot Lab | Hands-On Robotics Experiences | The Robot Age'
const description =
  'Bring real robots, embodied AI, and human-robot interaction to your school, university, company, or event with The Robot Age Live Robot Lab.'
const baseMetadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/live-robot-lab' },
  openGraph: {
    title,
    description,
    url: '/live-robot-lab',
    images: [
      {
        url: '/images/robots/unitree-go2-pro/shop-01.png',
        alt: 'Unitree Go2 Pro at The Robot Age Live Robot Lab',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/robots/unitree-go2-pro/shop-01.png'],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale?: Locale }> }): Promise<Metadata> {
  const { locale = 'en' } = await params
  return pageMetadata(baseMetadata, '/live-robot-lab', locale)
}

export default async function LiveRobotLabPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  return (
    <>
      <a className={styles.skipLink} href="#lab-main">{t("Skip to content")}</a>
      <div className={styles.navigation}>
        <Nav
          pinned
          cta={{
            label: t('Request a Live Robot Lab'),
            href: contentHref('/live-robot-lab#request-live-robot-lab', locale),
          }}
        />
      </div>
      <main id="lab-main" className={styles.page}>
        <LiveRobotLabHero locale={locale} />
        <LiveRobotLabVideo locale={locale} />
        <ExperiencePrinciples locale={locale} />
        <RobotShowcase locale={locale} />
        <PricingOptions locale={locale} />
        <LabTimeline locale={locale} />
        <LearningOutcomes locale={locale} />
        <AudienceLevels locale={locale} />
        <SocialProof locale={locale} />
        <IncludedSection locale={locale} />
        <LiveRobotLabFAQ locale={locale} />
        <Section
          id="request-live-robot-lab"
          title={t("Bring the robots to you.")}
          eyebrow={t("Request a Live Robot Lab")}
        >
          <p className={styles.intro}>{t("Tell us about your school, organization, or event. We'll recommend the right Live Robot Lab format and provide pricing and availability.")}</p>
          <LiveRobotLabRequestForm />
        </Section>
        <FinalCTA locale={locale} />
      </main>
      <Footer />
    </>
  )
}
