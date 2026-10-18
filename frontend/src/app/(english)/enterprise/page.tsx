import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/routing'
import Link from 'next/link'
import Image from '@/components/MediaImage'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import PageHero from '@/components/PageHero/PageHero'
import cta from '@/components/FoundingCohort/FoundingCohort.module.css'
import { imageUrl } from '@/lib/image-assets'
import { pageMetadata } from '@/lib/i18n/page-metadata'
import { uiText } from '@/lib/i18n/messages'
import { contentHref } from '@/lib/i18n/localize'
import { enterpriseContent as c } from './content'
import EnterpriseForm from './EnterpriseForm'
import styles from './enterprise.module.css'

type Props = { params: Promise<{ locale?: Locale }> }
const assets = {
  hero: '/images/enterprise/enterprise-academy-hero.webp',
  factory: '/images/enterprise/enterprise-factory-training.webp',
  senior: '/images/enterprise/enterprise-senior-living.webp',
  multilingual: '/images/enterprise/enterprise-multilingual-training.webp',
  adoption: '/images/enterprise/enterprise-adoption-workplace.webp',
  humanoid: '/images/enterprise/enterprise-humanoid-onboarding.webp',
  quadruped: '/images/enterprise/enterprise-quadruped-inspection.webp',
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale = 'en' } = await params
  const title = 'Robot Deployment Academy-as-a-Service | The Robot Age'
  const description = 'Multilingual workforce training, customer onboarding, and robot adoption programs for robotics manufacturers, integrators, and deployment providers.'
  return pageMetadata({
    title: { absolute: title }, description,
    openGraph: { title, description, type: 'website', images: [{ url: imageUrl(assets.hero), alt: c.alt.hero }] },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl(assets.hero)] },
  }, '/enterprise', locale)
}
export default async function EnterprisePage({ params }: Props) {
  const { locale = 'en' } = await params
  const t = (value: string) => uiText(value, locale)
  const number = (i: number) => String(i + 1).padStart(2, '0')
  const lines = (value: string) => t(value).split('. ').map((line, i, all) => <span className={styles.headingLine} key={line}>{line}{i < all.length - 1 ? '.' : ''}</span>)
  const photo = (key: keyof typeof assets, className = '', hero = false, sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 65vw, 850px') =>
    <div className={`${styles.photo} ${className}`}><Image src={assets[key]} alt={t(c.alt[key])} fill sizes={hero ? '(max-width: 900px) 100vw, 52vw' : sizes} priority={hero} /></div>
  const intro = (data: { label: string; title: string; body: string; note: string }, id: string) =>
    <div className={styles.introGrid}><div><p className={styles.eyebrow}>{t(data.label)}</p><h2 id={id}>{id === 'solution-title' ? lines(data.title) : t(data.title)}</h2></div><div className={styles.prose}><p>{t(data.body)}</p><p>{t(data.note)}</p></div></div>
  return <>
    <Nav pinned />
    <main className={styles.page} lang={locale}>
      <a className={styles.skip} href="#enterprise-main">{t('Skip to content')}</a>
      <div id="enterprise-main" className={styles.brandHero}>
        <PageHero eyebrow={t(c.eyebrow)} title={`${t(c.title[0])} ${t(c.title[1])}`} subtitle={t(c.support)}
          imageContent={<figure className={styles.brandFigure}>{photo('hero', styles.brandHeroPhoto, true)}<figcaption>{t(c.imageNote)}</figcaption></figure>}>
          <p className={styles.offer}>{t(c.offer)}</p><p className={styles.heroIntro}>{t(c.intro)}</p>
          <div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(c.cta)} <span aria-hidden="true">↗</span></a><a className={styles.textLink} href="#academy-process">{t(c.explore)} <span aria-hidden="true">↓</span></a></div>
        </PageHero>
      </div>
      <section className={`${styles.section} ${styles.problem}`} aria-labelledby="gap-title"><div className={styles.wrap}>
        {intro(c.problem, 'gap-title')}
        <ol className={styles.challengeList}>{c.problem.items.map(([title, body], i) => <li key={title}><span className={styles.number}>{number(i)}</span><h3>{t(title)}</h3><p>{t(body)}</p></li>)}</ol>
        <p className={styles.statement}>{t(c.problem.closing)}</p><p className={styles.scope}>{t(c.scope)}</p>
      </div></section>
      <section className={styles.section} aria-labelledby="solution-title"><div className={styles.wrap}>
        {intro(c.solution, 'solution-title')}
        <div className={styles.solutionGrid}>{photo('factory', styles.factoryPhoto)}<ol className={styles.capabilities}>{c.solution.items.map(([title, body], i) => <li key={title}><span className={styles.number}>{number(i)}</span><div><h3>{t(title)}</h3><p>{t(body)}</p></div></li>)}</ol></div>
      </div></section>
      <section className={`${styles.section} ${styles.specialization}`} aria-labelledby="specialization-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.specialization.label)}</p><div className={styles.specialHeading}><h2 id="specialization-title">{t(c.specialization.title)}</h2><p>{t(c.specialization.body)}</p></div>
        <div className={styles.specialGrid}>{photo('multilingual')}<div className={styles.specialText}><p className={styles.emphasis}>{t(c.specialization.strong)}</p><p>{t(c.specialization.note)}</p><p className={styles.languageNote}>{t(c.specialization.languages)}</p></div></div>
        <div className={styles.services}>{c.specialization.items.map(([title, body]) => <article key={title}><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
        <p className={styles.statement}>{t(c.specialization.closing)}</p>
      </div></section>
      <section className={styles.section} id="academy-process" aria-labelledby="process-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.process.label)}</p><h2 className={styles.mediumHeading} id="process-title">{t(c.process.title)}</h2>
        <ol className={styles.process}>{c.process.items.map(([title, body], i) => <li key={title}><div className={styles.processTrack}><span>{number(i)}</span><span aria-hidden="true">→</span></div><h3>{t(title)}</h3><p>{t(body)}</p></li>)}</ol>
        <figure className={styles.adoptionFigure}>{photo('adoption', styles.adoptionPhoto, false, '(max-width: 1440px) 100vw, 1328px')}<figcaption>{t(c.outcome)}</figcaption></figure>
      </div></section>
      <section className={`${styles.section} ${styles.environments}`} aria-labelledby="environments-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.environments.label)}</p><h2 className={styles.mediumHeading} id="environments-title">{t(c.environments.title)}</h2>
        <div className={styles.environmentGrid}>{c.environments.items.map(([title, body], i) => <article key={title}>{photo((['hero', 'factory', 'senior'] as const)[i], '', false, '(max-width: 600px) 100vw, 33vw')}<span className={styles.number}>{number(i)}</span><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
        <div className={styles.scenarioPair}>{c.additionalScenarios.map(([title, body], i) => <article key={title}>{photo((['humanoid', 'quadruped'] as const)[i], '', false, '(max-width: 767px) 100vw, 50vw')}<span className={styles.number}>{number(i + 3)}</span><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
        <p className={styles.disclosure}>{t(c.environments.note)}</p>
      </div></section>
      <section className={styles.section} aria-labelledby="partners-title"><div className={`${styles.wrap} ${styles.partnersGrid}`}>
        <div><p className={styles.eyebrow}>{t(c.partners.label)}</p><h2 id="partners-title">{t(c.partners.title)}</h2></div><div className={styles.partnerList}>{c.partners.items.map(([title, body]) => <article key={title}><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
      </div></section>
      <section className={`${styles.section} ${styles.pilot}`} aria-labelledby="pilot-title"><div className={`${styles.wrap} ${styles.pilotGrid}`}>
        <div><p className={styles.eyebrow}>{t(c.pilot.label)}</p><h2 id="pilot-title">{lines(c.pilot.title)}</h2><p className={styles.pilotIntro}>{t(c.pilot.body)}</p><a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(c.pilot.cta)} <span aria-hidden="true">↗</span></a></div>
        <ul className={styles.deliverables}>{c.pilot.items.map((item, i) => <li key={item}><span aria-hidden="true">{number(i)}</span>{t(item)}</li>)}</ul>
      </div></section>
      <section className={`${styles.section} ${styles.programs}`} aria-labelledby="programs-title"><div className={styles.wrap}>
        <h2 id="programs-title">{t(c.programs.title)}</h2><div className={styles.programList}>{c.programs.items.map(([title, body, href]) => <Link href={contentHref(href, locale)} key={href}><span><strong>{t(title)}</strong><span>{t(body)}</span></span><span aria-hidden="true">↗</span></Link>)}</div>
      </div></section>
      <section className={`${styles.section} ${styles.briefing}`} id="enterprise-briefing" aria-labelledby="briefing-title"><div className={`${styles.wrap} ${styles.formGrid}`}>
        <div><p className={styles.eyebrow}>{t(c.form.label)}</p><h2 id="briefing-title">{t(c.form.title)}</h2><p>{t(c.form.body)}</p><p className={styles.scope}>{t(c.scope)}</p></div><EnterpriseForm locale={locale} />
      </div></section>
    </main><Footer />
  </>
}
