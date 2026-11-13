import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getQuizRobot, allQuizRobotSlugs } from '@/lib/quizRobots'
import ResultView from '../ResultView'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://therobotage.com'

export function generateStaticParams() {
  return allQuizRobotSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const robot = getQuizRobot(slug)
  if (!robot) return { title: 'Robot not found — The Robot Age' }

  const title = `You could be the ${robot.name} — What Robot Are You?`
  const description = `${robot.name} — ${robot.archetype}. ${robot.learning.use} Take the 2-minute quiz and find your match.`
  const url = `${SITE_URL}/what-robot-are-you/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${robot.name} — ${robot.archetype}`,
      description,
      url,
      type: 'website',
      // opengraph-image.tsx in this folder supplies the 1200x630 card automatically.
    },
    twitter: {
      card: 'summary_large_image',
      title: `${robot.name} — ${robot.archetype}`,
      description,
    },
  }
}

export default async function RobotResultPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const robot = getQuizRobot(slug)
  if (!robot) notFound()

  return (
    <>
      <Nav pinned />

      <main><ResultView
        key={robot.slug}
        robot={robot}
        reason={`${robot.archetype}. Discover the robot behind the personality, then take the quiz to find your own match.`}
        eyebrow="Meet your possible match"
        headline={robot.name}
        cardReasonLabel="The short version"
      /></main>

      <Footer />
    </>
  )
}
