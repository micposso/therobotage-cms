import { localize } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import { notFound } from 'next/navigation'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import NewsArticle from '@/components/NewsArticle/NewsArticle'
import { getNewsArticleBySlug, getAllNewsSlugs } from '@/lib/news'
import { translationAlternates } from '@/lib/i18n/content'

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale?: Locale }> }) {
  const { slug, locale = 'en' } = await params
  const article = localize(getNewsArticleBySlug(slug), `/news/${slug}`, locale)
  if (!article) return {}

  const ogImage = article.headerImage || null

  return {
    title: `${article.title} — The Robot Age`,
    description: article.excerpt,
    alternates: { canonical: `/news/${slug}`, languages: translationAlternates(`/news/${slug}`) },
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

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string; locale?: Locale }> }) {
  const { slug, locale = 'en' } = await params
  const article = localize(getNewsArticleBySlug(slug), `/news/${slug}`, locale)
  if (!article) notFound()

  return (
    <>
      <Nav pinned />
      <NewsArticle article={article} locale={locale} originalHref={`/news/${slug}`} />
      <Footer />
    </>
  )
}
