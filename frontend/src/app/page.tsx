import fs from 'fs'
import path from 'path'
import Nav from '@/components/Nav/Nav'
import HeroHomepage from '@/components/HeroHomepage/HeroHomepage'
import HomeNewsSection from '@/components/HomeNewsSection/HomeNewsSection'
import Certification from '@/components/Certification/Certification'
import Summit from '@/components/Summit/Summit'
import Footer from '@/components/Footer/Footer'
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

function getHeroImages(): string[] {
  const dir = path.join(process.cwd(), 'public', 'images')
  return fs.readdirSync(dir)
    .filter(f => /\.(png|jpe?g|webp)$/i.test(f))
    .map(f => `/images/${f}`)
}

export async function generateMetadata() {
  const firstImage = getHeroImages()[0] ?? '/images/robot.png'
  return {
    title: 'The Robot Age',
    description: 'Robotic literacy education and certification for designers, strategists, and leaders who work alongside robots.',
    openGraph: {
      title: 'The Robot Age',
      description: 'Robotic literacy education and certification for designers, strategists, and leaders who work alongside robots.',
      images: [{ url: firstImage, alt: 'The Robot Age' }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [firstImage],
    },
  }
}

export default function Home() {
  const heroImages = getHeroImages()
  const articles = getAllNewsArticles().map((a) => ({
    slug: a.slug,
    category: a.category,
    date: a.date,
    headline: a.title,
    image: a.thumbnailImage,
    href: `/news/${a.slug}`,
  }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <HeroHomepage images={heroImages} />
      <HomeNewsSection articles={articles} />
      <Certification />
      <Summit />
      <Footer />
    </>
  )
}
