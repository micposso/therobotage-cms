import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Certification from '@/components/Certification/Certification'
import FoundingCohort from '@/components/FoundingCohort/FoundingCohort'
import AboutInstructor from '@/components/AboutInstructor/AboutInstructor'
import Footer from '@/components/Footer/Footer'

export const metadata = {
  title: 'Learn — The Robot Age',
  description: 'Credentials for the non-engineer who shapes what robots do in the world.',
  openGraph: {
    title: 'Learn — The Robot Age',
    description: 'Credentials for the non-engineer who shapes what robots do in the world.',
    images: [{ url: '/images/human.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/human.png'],
  },
}

export default function LearnPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Curriculum"
        title="Built for the people robots work beside"
        subtitle="Four credentials for designers, strategists, and leaders who need to work confidently in a world where robots are already deployed. No engineering background required."
        imageSrc="/images/human.png"
      />
      <div className="container-fluid" style={{ paddingTop: 'var(--space-16)' }}>
        <FoundingCohort />
      </div>
      <Certification />
      <AboutInstructor />

      <section style={{ padding: 'var(--space-16) 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container-fluid">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 300, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>Also in Learn</p>
          <Link href="/robotics-literacy" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', fontWeight: 400, color: 'var(--color-text)', textDecoration: 'none' }}>
            Robotics Literacy — the skill side of working with robots
            <span style={{ fontSize: '1.25em', lineHeight: 1 }}>→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
