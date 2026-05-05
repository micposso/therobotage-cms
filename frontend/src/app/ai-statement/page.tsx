import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import styles from './ai-statement.module.css'

export const metadata = {
  title: 'Fair Use of AI — The Robot Age',
  description: 'How The Robot Age uses artificial intelligence in editorial production and image creation.',
  openGraph: {
    title: 'Fair Use of AI — The Robot Age',
    description: 'How The Robot Age uses artificial intelligence in editorial production and image creation.',
    images: [{ url: '/images/home.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/home.png'],
  },
}

export default function AIStatementPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Transparency"
        title="Fair use of AI."
        subtitle="How we use artificial intelligence in editorial production — and what that means for what you read here."
        imageSrc="/images/placeholder.jpg"
      />
      <section className={styles.content}>
        <div className="container-fluid">
          <div className={styles.inner}>

            <p className={styles.updated}>Last updated: May 2026</p>

            <h2>1. AI-assisted editorial</h2>
            <p>Articles published on The Robot Age are drafted with the assistance of large language models. Every piece is reviewed, edited, and approved by a human editor before publication. AI is used to accelerate the writing process — not to replace editorial judgment. The perspectives, framing, and decisions about what to publish remain human ones.</p>
            <p>Where an article draws on external sources, those sources are verified by an editor before the piece goes live. Factual claims attributed to research, data, or named individuals are checked against the original material.</p>

            <h2>2. AI-generated images</h2>
            <p>Some images used across this site — including article headers and editorial illustrations — are generated using AI image tools. Where an image is AI-generated, it is created specifically for The Robot Age and does not reproduce or derive from any identifiable third-party work. We do not use AI image generation to replicate real people, real places, or existing copyrighted imagery.</p>

            <h2>3. What this means for readers</h2>
            <p>The Robot Age covers a field where AI is central to the work — it would be inconsistent to use it without disclosing how. We believe transparency about AI use in editorial production is a baseline standard, not a differentiator. This statement exists because readers have a right to know how the content they are reading was made.</p>
            <p>If you read something on this site that appears factually incorrect, misattributed, or otherwise in error, we want to know. We will correct it.</p>

            <h2>4. Contact</h2>
            <p>Questions, corrections, or concerns about AI use on this site should be directed to <a href="mailto:info@therobotage.com">info@therobotage.com</a>.</p>

          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
