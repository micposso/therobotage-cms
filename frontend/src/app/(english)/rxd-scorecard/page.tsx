import { imageUrl } from '@/lib/image-assets'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import Scorecard from './Scorecard'
import EvidenceWorkspace from '@/components/RXDEvaluation/EvidenceWorkspace'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import { translationAlternates } from '@/lib/i18n/content'

export const metadata = {
  alternates: { canonical: '/rxd-scorecard', languages: translationAlternates('/rxd-scorecard') },
  title: 'RXD Scorecard — The Robot Age',
  description:
    'Score any robot interaction across the six dimensions of Robot Experience Design, then generate a shareable audit card. Free, no login, built for practitioners.',
  openGraph: {
    title: 'RXD Scorecard — The Robot Age',
    description:
      'Score any robot interaction across the six dimensions of Robot Experience Design, then generate a shareable audit card.',
    images: [{ url: imageUrl('/images/hand.png'), alt: 'RXD Scorecard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RXD Scorecard — The Robot Age',
    description:
      'Score any robot interaction across the six dimensions of Robot Experience Design, then generate a shareable audit card.',
    images: [imageUrl('/images/hand.png')],
  },
}

export default async function RxdScorecardPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (s: string) => uiText(s, locale)
  return (
    <>
      <Nav pinned />

      <PageHero
        eyebrow="Robot Experience Design"
        title={t('Document a robot interaction.')}
        subtitle={t('Collect evidence, record observations and prepare an RXD assessment for human review. Partial evidence stays visible without a misleading overall score.')}
        imageSrc="/images/human.png"
      />

      <EvidenceWorkspace />
      <details style={{ margin: '24px', borderTop: '1px solid #aaa', paddingTop: 24 }}>
        <summary>{t('Practice scorecard — unreviewed, not an index evaluation')}</summary>
        <p>{t('The original practice tool is preserved. Its ratings do not establish eligibility for publication or approval under methodology 1.0.')}</p>
        <div lang="en"><Scorecard /></div>
      </details>

      <Footer />
    </>
  )
}
