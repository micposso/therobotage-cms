import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/i18n/page-metadata'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import styles from './access.module.css'

const baseMetadata: Metadata = {
  title: 'Access — The Robot Age',
  description: 'Join the waitlist for the REP certification.',
  openGraph: {
    title: 'Access — The Robot Age',
    description: 'Join the waitlist for the REP certification.',
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
        eyebrow={t("Get Access")}
        title={t("Be first in.")}
        subtitle={t("The Robotics Experience Practitioner certification is launching soon. Join the waitlist and we'll notify you when enrollment opens — along with early access offers and pre-launch resources.")}
        imageSrc="/images/placeholder.jpg"
      />
      <section className={styles.section}>
        <div className="container-fluid">
          <div className={styles.inner}>
            <p className={styles.intro}>{t("We're keeping the first cohort small. Leave your name and email and we'll be in touch before the public announcement.")}</p>
            <form className={styles.form}>
              <input
                type="text"
                placeholder={t("Your name")}
                className={styles.input}
              />
              <input
                type="email"
                placeholder={t("Your email")}
                className={styles.input}
              />
              <button type="submit" className={styles.submitButton}>{t("Join the Waitlist")}</button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
