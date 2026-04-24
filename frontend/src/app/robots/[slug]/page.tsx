import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import NewsArticle from '@/components/NewsArticle/NewsArticle'
import { getRobotBySlug, getAllRobotSlugs, type Robot } from '@/lib/robots'

export async function generateStaticParams() {
  return getAllRobotSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const robot = getRobotBySlug(slug)
  if (!robot) return {}
  const ogImage = robot.headerImage || null
  return {
    title: `${robot.title} — Robot of the Week — The Robot Age`,
    description: robot.excerpt,
    openGraph: {
      title: robot.title,
      description: robot.excerpt,
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage, alt: robot.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: robot.title,
      description: robot.excerpt,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default async function RobotPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const robot = getRobotBySlug(slug)
  if (!robot) notFound()

  // NewsArticle expects a NewsArticle shape — robot fields map cleanly
  const article = {
    ...robot,
    category: 'ROBOT OF THE WEEK',
  }

  return (
    <>
      <Nav pinned />
      <NewsArticle article={article} />
      <Footer />
    </>
  )
}
