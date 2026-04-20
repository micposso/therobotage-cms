import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Summit from '@/components/Summit/Summit'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'Summit — The Robot Age',
  description: 'A gathering for the people shaping human-robot experience.',
}

export default function SummitPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="The Robot Age Summit"
        title="Where the conversation happens."
        subtitle="A gathering for designers, strategists, and leaders who are shaping what human-robot experience actually looks like. Coming to New York City this fall."
        imageSrc="/images/people.png"
      />
      <Summit />
      <Footer />
    </>
  )
}
