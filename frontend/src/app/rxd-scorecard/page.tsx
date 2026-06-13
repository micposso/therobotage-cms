import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import Scorecard from './Scorecard'

export const metadata = {
  title: 'RXD Scorecard — The Robot Age',
  description:
    'Score any robot interaction across the six dimensions of Robot Experience Design, then generate a shareable audit card. Free, no login, built for practitioners.',
  openGraph: {
    title: 'RXD Scorecard — The Robot Age',
    description:
      'Score any robot interaction across the six dimensions of Robot Experience Design, then generate a shareable audit card.',
    images: [{ url: '/images/hand.png', alt: 'RXD Scorecard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RXD Scorecard — The Robot Age',
    description:
      'Score any robot interaction across the six dimensions of Robot Experience Design, then generate a shareable audit card.',
    images: ['/images/hand.png'],
  },
}

export default function RxdScorecardPage() {
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Robot Experience Design"
        title="Score a robot interaction."
        subtitle="Rate any robot across the six RXD dimensions, then generate a shareable audit card. No login, nothing to install — built for designers, product managers, and researchers, not engineers."
        imageSrc="/images/human.png"
      />

      <Scorecard />

      <Footer />
    </>
  )
}
