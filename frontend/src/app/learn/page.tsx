import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Certification from '@/components/Certification/Certification'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'Learn — The Robot Age',
  description: 'Credentials for the non-engineer who shapes what robots do in the world.',
}

export default function LearnPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Curriculum"
        title="Built for the people robots work beside."
        subtitle="Four credentials for designers, strategists, and leaders who need to work confidently in a world where robots are already deployed. No engineering background required."
      />
      <Certification />
      <Footer />
    </>
  )
}
