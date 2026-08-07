import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import Quiz from './Quiz'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'

export const metadata = {
  title: 'What Robot Are You?',
  description:
    'Answer 6 quick questions and get matched to one of 9 real humanoid and mobile robots — each with verified specs. Get a shareable robot card in 2 minutes.',
  alternates: { canonical: `${SITE_URL}/what-robot-are-you` },
  openGraph: {
    title: 'What Robot Are You?',
    description:
      'Take the 2-minute quiz and find out which real robot matches your personality. Share your robot card.',
    url: `${SITE_URL}/what-robot-are-you`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Robot Are You?',
    description:
      'Take the 2-minute quiz and find out which real robot matches your personality.',
  },
}

export default function WhatRobotAreYouPage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="The 2-minute quiz"
        title="What robot are you?"
        subtitle="Six quick questions. One of nine real robots — from a $299 desktop communicator to a factory-floor humanoid. Get a shareable card at the end. No engineering required, no login."
        imageSrc="/images/human.png"
      />

      <Quiz />

      <Footer />
    </>
  )
}
