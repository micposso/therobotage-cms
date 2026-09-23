import { uiText } from '@/lib/i18n/messages'
import { localize, contentHref } from '@/lib/i18n/localize'
import type { Locale } from '@/lib/i18n/routing'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { getArticleBySlug, getAllSlugs } from '@/lib/articles'
import styles from './ArticlePage.module.css'
import { translationAlternates } from '@/lib/i18n/content'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale?: Locale }> }) {
  const { slug, locale = 'en' } = await params
  const article = localize(getArticleBySlug(slug), `/research/${slug}`, locale)
  if (!article) return {}
  return {
    title: `${article.headline} — The Robot Age`,
    description: article.body[0],
    alternates: { canonical: `/research/${slug}`, languages: translationAlternates(`/research/${slug}`) },
    openGraph: {
      title: article.headline,
      description: article.body[0],
      type: 'article',
      ...(article.image && { images: [{ url: article.image, alt: article.headline }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.headline,
      description: article.body[0],
      ...(article.image && { images: [article.image] }),
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string; locale?: Locale }> }) {
  const { slug, locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const article = localize(getArticleBySlug(slug), `/research/${slug}`, locale)
  if (!article) notFound()

  return (
    <>
      <Nav pinned />

      <article className={styles.article}>
        <div className="container-fluid">

          {/* Header */}
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={styles.category}>{article.category}</span>
              <span className={styles.date}>{article.date}</span>
            </div>
            <h1 className={styles.headline}>{article.headline}</h1>
          </header>

          {/* Content + image */}
          <div className={styles.contentRow}>
            <div className={styles.body}>
              {article.body.map((paragraph, i) => (
                <p key={i} className={styles.paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className={styles.imageWrap}>
              <Image
                src={article.image}
                alt={article.headline}
                fill
                priority
                sizes="(max-width: 767px) 100vw, 40vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Back link */}
          <div className={styles.back}>
            <Link href={contentHref("/research", locale)} className={styles.backLink}>{t("← Back to Research")}</Link>
          </div>

        </div>
      </article>

      <Footer />
    </>
  )
}
