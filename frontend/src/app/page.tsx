import Nav from '@/components/Nav/Nav'
import HeroHomepage from '@/components/HeroHomepage/HeroHomepage'
import ArticleGrid from '@/components/ArticleGrid/ArticleGrid'
import Certification from '@/components/Certification/Certification'
import Summit from '@/components/Summit/Summit'
import Footer from '@/components/Footer/Footer'

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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <HeroHomepage />
      <ArticleGrid />
      <Certification />
      <Summit />
      <Footer />
    </>
  )
}
