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
  const description = `${robot.name} — ${robot.archetype}. ${robot.blurb} Take the 2-minute quiz and find your match.`
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

      <ResultView
        robot={robot}
        reason={robot.blurb}
        eyebrow="Meet your possible match"
        headline={`The ${robot.name}.`}
        cardReasonLabel="The short version"
      />

      <Footer />
    </>
  )
}
