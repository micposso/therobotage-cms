import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { definition } from './framework-content'
import {
  RobotLiteracyApplications,
  RobotLiteracyFinalStatement,
  RobotLiteracyFrameworkSummary,
  RobotLiteracyHero,
  RobotLiteracyLearningFormats,
} from './Sections'
import styles from '@/app/live-robot-lab/live-robot-lab.module.css'
import local from './robot-literacy.module.css'

const title = 'Robot Literacy: READ, RELATE, COEXIST | The Robot Age'

export const metadata: Metadata = {
  title: { absolute: title },
  description: definition,
  alternates: { canonical: '/robot-literacy' },
  openGraph: {
    title,
    description: definition,
    url: '/robot-literacy',
    images: [{ url: '/images/home.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: definition,
    images: ['/images/home.png'],
  },
}

export default function RobotLiteracyPage() {
  return <>
    <a className={styles.skipLink} href="#literacy-main">Skip to content</a>
    <div className={styles.navigation}><Nav pinned /></div>
    <main id="literacy-main" tabIndex={-1} className={`${styles.page} ${local.page}`}>
      <RobotLiteracyHero />
      <RobotLiteracyFrameworkSummary />
      <RobotLiteracyApplications />
      <RobotLiteracyLearningFormats />
      <RobotLiteracyFinalStatement />
    </main>
    <Footer />
  </>
}
