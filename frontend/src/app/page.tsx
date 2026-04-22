import Nav from '@/components/Nav/Nav'
import HeroHomepage from '@/components/HeroHomepage/HeroHomepage'
import ArticleGrid from '@/components/ArticleGrid/ArticleGrid'
import Certification from '@/components/Certification/Certification'
import Summit from '@/components/Summit/Summit'
import Footer from '@/components/Footer/Footer'
import { articles as legacyArticles } from '@/lib/articles'
import { getAllNewsArticles } from '@/lib/news'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'The Robot Age',
  url: 'https://therobotage.com',
  description: 'Robotic literacy education and certification for designers, strategists, and leaders who work alongside robots.',
  sameAs: ['https://linkedin.com/company/therobotage'],
  offers: {
    '@type': 'Course',
    name: 'Robotics Experience Practitioner (REP)',
    description: 'The foundational credential for non-engineers shaping the human side of robotics.',
    url: 'https://therobotage.com/learn',
    provider: { '@type': 'Organization', name: 'The Robot Age' },
  },
}

function parseDate(str: string): number {
  const d = new Date(str)
  return isNaN(d.getTime()) ? 0 : d.getTime()
}

export default function Home() {
  const newsItems = getAllNewsArticles().map((a) => ({
    slug: a.slug,
    category: a.category,
    date: a.date,
    headline: a.title,
    image: a.thumbnailImage,
    href: `/news/${a.slug}`,
  }))

  const legacyItems = legacyArticles.map((a) => ({
    slug: a.slug,
    category: a.category,
    date: a.date,
    headline: a.headline,
    image: a.image,
    href: `/research/${a.slug}`,
  }))

  const combined = [...newsItems, ...legacyItems].sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <HeroHomepage />
      <ArticleGrid articles={combined} />
      <Certification />
      <Summit />
      <Footer />
    </>
  )
}
