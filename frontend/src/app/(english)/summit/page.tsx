import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Summit from '@/components/Summit/Summit'
import Footer from '@/components/Footer/Footer'
import { summitEvent } from '@/lib/events'

export const metadata = {
  title: 'Summit — The Robot Age',
  description: 'A gathering for the people shaping human-robot experience.',
  openGraph: {
    title: 'Summit — The Robot Age',
    description: 'A gathering for the people shaping human-robot experience.',
    images: [{ url: '/images/hand.png', alt: 'The Robot Age Summit' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/hand.png'],
  },
}

export default function SummitPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="The Robot Age Summit"
        title="Where the conversation happens"
        subtitle={summitEvent.description}
        imageSrc="/images/hand.png"
      />
      <Summit />
      <Footer />
    </>
  )
}
