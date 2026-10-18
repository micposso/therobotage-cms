import { localize, contentHref } from '@/lib/i18n/localize'
import { imageUrl } from '@/lib/image-assets'
import type { Locale } from '@/lib/i18n/routing'
import fs from 'fs'
import path from 'path'
import Nav from '@/components/Nav/Nav'
import HeroHomepage from '@/components/HeroHomepage/HeroHomepage'
import HomeNewsSection from '@/components/HomeNewsSection/HomeNewsSection'
import Certification from '@/components/Certification/Certification'
import Footer from '@/components/Footer/Footer'
import { getAllNewsArticles } from '@/lib/news'
import { academyPrograms } from '@/lib/certifications'
import { siteOverview } from '@/lib/site'
import { translationAlternates } from '@/lib/i18n/content'

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'The Robot Age',
    url: 'https://therobotage.com',
    description: siteOverview.summary,
    sameAs: ['https://linkedin.com/company/therobotage'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'The Robot Age Academy',
      itemListElement: academyPrograms.map((program) => ({
        '@type': 'Course', name: program.title, description: program.description,
        url: `https://therobotage.com/learn/${program.slug}`,
        provider: { '@type': 'Organization', name: 'The Robot Age Academy' },
      })),
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Robot Age',
    url: 'https://therobotage.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://therobotage.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },
]

function getHeroImages(): string[] {
  const dir = path.join(process.cwd(), 'public', 'images')
  return fs.readdirSync(dir)
    .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
    .map(f => imageUrl(`/images/${f}`))
}

export async function generateMetadata() {
  const firstImage = getHeroImages()[0] ?? imageUrl('/images/robot.png')
  return {
    title: 'The Robot Age',
    description: siteOverview.summary,
    openGraph: {
      locale: 'en_US',
      title: 'The Robot Age',
      description: siteOverview.summary,
      images: [{ url: firstImage, alt: 'The Robot Age' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [firstImage],
    },
    alternates: { canonical: '/', languages: translationAlternates('/') },
  }
}

export default async function Home({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const heroImages = getHeroImages()
  const articles = getAllNewsArticles().map(a => localize(a, `/news/${a.slug}`, locale)).map((a) => ({
    slug: a.slug,
    category: a.category,
    date: a.date,
    headline: a.title,
    image: a.thumbnailImage,
    href: contentHref(`/news/${a.slug}`, locale),
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <HeroHomepage images={heroImages} />
      <Certification />
      <HomeNewsSection articles={articles} />
      <Footer />
    </>
  )
}
