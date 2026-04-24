import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import NewsArticle from '@/components/NewsArticle/NewsArticle'
import { getNewsArticleBySlug, getAllNewsSlugs } from '@/lib/news'

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getNewsArticleBySlug(slug)
  if (!article) return {}

  const ogImage = article.headerImage || null

  return {
    title: `${article.title} — The Robot Age`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      ...(ogImage && { images: [{ url: ogImage, alt: article.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getNewsArticleBySlug(slug)
  if (!article) notFound()

  return (
    <>
      <Nav pinned />
      <NewsArticle article={article} />
      <Footer />
    </>
  )
}
