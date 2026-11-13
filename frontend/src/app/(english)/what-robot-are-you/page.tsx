import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Quiz from './Quiz'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'

export const metadata = {
  title: 'What Robot Are You?',
  description:
    'Six quick questions. Nine real robots. Find your robot match, learn what it does, and explore the technology behind it. No login needed.',
  alternates: { canonical: `${SITE_URL}/what-robot-are-you` },
  openGraph: {
    title: 'What Robot Are You?',
    description:
      'Take the 2-minute quiz, meet your robot counterpart, and learn what it does in the real world.',
    url: `${SITE_URL}/what-robot-are-you`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'What Robot Are You?',
    description:
      'Find your robot counterpart and discover what it does in the real world.',
  },
}

export default function WhatRobotAreYouPage() {
  return (
    <>
      <Nav pinned />

      <main><Quiz /></main>

      <Footer />
    </>
  )
}
