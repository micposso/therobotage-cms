import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import ArticleGrid from '@/components/ArticleGrid/ArticleGrid'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'Research — The Robot Age',
  description: 'What we\'re learning about humans, robots, and the spaces in between.',
}

export default function ResearchPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Research & Insights"
        title="What we're learning"
        subtitle="Original research, field observations, and critical perspectives on the human side of robotics — published for the people designing what comes next."
        imageSrc="/images/hand.png"
      />
      <ArticleGrid />
      <Footer />
    </>
  )
}
