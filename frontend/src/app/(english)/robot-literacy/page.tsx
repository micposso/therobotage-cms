import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/routing'
import { localizedHref } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'
import { translationAlternates } from '@/lib/i18n/content'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import { definition } from './framework-content'
import {
  RobotLiteracyApplications,
  RobotLiteracyFinalStatement,
  RobotLiteracyFrameworkSummary,
  RobotLiteracyHero,
  RobotLiteracyLearningFormats,
} from './Sections'
import styles from '@/app/(english)/live-robot-lab/live-robot-lab.module.css'
import local from './robot-literacy.module.css'

const title = 'Robot Literacy: READ, RELATE, COEXIST | The Robot Age'

export async function generateMetadata({ params }: { params: Promise<{ locale?: Locale }> }): Promise<Metadata> {
  const { locale = 'en' } = await params
  const translatedTitle = uiText(title, locale)
  const description = uiText(definition, locale)
  const url = localizedHref('/robot-literacy', locale)
  return {
  title: { absolute: translatedTitle },
  description,
  alternates: { canonical: url, languages: translationAlternates('/robot-literacy') },
  openGraph: {
    title: translatedTitle,
    description,
    url,
    locale: locale === 'es' ? 'es_ES' : 'en_US',
    images: [{ url: '/images/home.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: translatedTitle,
    description,
    images: ['/images/home.png'],
  },
}
}

export default async function RobotLiteracyPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  return <>
    <a className={styles.skipLink} href="#literacy-main">{uiText('Skip to content', locale)}</a>
    <div className={styles.navigation}><Nav pinned /></div>
    <main id="literacy-main" tabIndex={-1} className={`${styles.page} ${local.page}`}>
      <RobotLiteracyHero locale={locale} />
      <RobotLiteracyFrameworkSummary locale={locale} />
      <RobotLiteracyApplications locale={locale} />
      <RobotLiteracyLearningFormats locale={locale} />
      <RobotLiteracyFinalStatement locale={locale} />
    </main>
    <Footer />
  </>
}
