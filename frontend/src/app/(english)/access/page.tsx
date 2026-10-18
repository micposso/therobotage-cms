import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/i18n/page-metadata'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import styles from './access.module.css'
import AccessForm from './AccessForm'

const baseMetadata: Metadata = {
  title: 'Academy Updates — The Robot Age',
  description: 'Get updates about RPDP and RDP at The Robot Age Academy.',
  openGraph: {
    title: 'Academy Updates — The Robot Age',
    description: 'Get updates about RPDP and RDP at The Robot Age Academy.',
    images: [{ url: '/images/learn.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/learn.png'],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale?: Locale }> }): Promise<Metadata> {
  const { locale = 'en' } = await params
  return pageMetadata(baseMetadata, '/access', locale)
}

export default async function AccessPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow={t("Academy Updates")}
        title={t("Stay informed about the Academy.")}
        subtitle={t("Explore professional education in robot product design and deployment. Get updates about RPDP and RDP. Joining the list does not reserve a seat.")}
        imageSrc="/images/placeholder.jpg"
      />
      <section className={styles.section}>
        <div className="container-fluid">
          <div className={styles.inner}>
            <p className={styles.intro}>{t("Leave your name and email to receive Academy program updates.")}</p>
            <AccessForm locale={locale} />
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
