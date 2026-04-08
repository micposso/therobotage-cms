import Nav from '@/components/Nav/Nav'
import HeroHomepage from '@/components/HeroHomepage/HeroHomepage'
import ArticleGrid from '@/components/ArticleGrid/ArticleGrid'
import Certification from '@/components/Certification/Certification'
import Summit from '@/components/Summit/Summit'
import Footer from '@/components/Footer/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <HeroHomepage />
      <ArticleGrid />
      <Certification />
      <Summit />
      <Footer />
    </>
  )
}
