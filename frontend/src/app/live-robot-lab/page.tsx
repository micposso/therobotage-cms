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
export const metadata: Metadata = {
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

export default function LiveRobotLabPage() {
  return (
    <>
      <a className={styles.skipLink} href="#lab-main">
        Skip to content
      </a>
      <div className={styles.navigation}>
        <Nav
          pinned
          cta={{
            label: 'Request a Live Robot Lab',
            href: '/live-robot-lab#request-live-robot-lab',
          }}
        />
      </div>
      <main id="lab-main" className={styles.page}>
        <LiveRobotLabHero />
        <LiveRobotLabVideo />
        <ExperiencePrinciples />
        <RobotShowcase />
        <PricingOptions />
        <LabTimeline />
        <LearningOutcomes />
        <AudienceLevels />
        <SocialProof />
        <IncludedSection />
        <LiveRobotLabFAQ />
        <Section
          id="request-live-robot-lab"
          title="Bring the robots to you."
          eyebrow="Request a Live Robot Lab"
        >
          <p className={styles.intro}>
            Tell us about your school, organization, or event. We&apos;ll
            recommend the right Live Robot Lab format and provide pricing and
            availability.
          </p>
          <LiveRobotLabRequestForm />
        </Section>
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
