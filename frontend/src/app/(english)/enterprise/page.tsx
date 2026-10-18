import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n/routing'
import Link from 'next/link'
import Image from '@/components/MediaImage'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import PageHero from '@/components/PageHero/PageHero'
import cta from '@/components/FoundingCohort/FoundingCohort.module.css'
import literacy from '@/app/(english)/robot-literacy/robot-literacy.module.css'
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
  entertainment: '/images/enterprise/enterprise-entertainment.webp',
  security: '/images/enterprise/enterprise-security.webp',
  government: '/images/enterprise/enterprise-local-government.webp',
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
  const photo = (key: keyof typeof assets, className = '', hero = false, sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 65vw, 850px') =>
    <div className={`${styles.photo} ${className}`}><Image src={assets[key]} alt={t(c.alt[key])} fill sizes={hero ? '(max-width: 900px) 100vw, 52vw' : sizes} priority={hero} /></div>
  const intro = (data: { label: string; title: string; body: string; note?: string }, id: string) =>
    <div className={styles.introGrid}><div><p className={styles.eyebrow}>{t(data.label)}</p><h2 id={id}>{t(data.title)}</h2></div><div className={styles.prose}><p>{t(data.body)}</p>{data.note && <p>{t(data.note)}</p>}</div></div>
  return <>
    <Nav pinned />
    <main className={styles.page} lang={locale}>
      <a className={styles.skip} href="#enterprise-main">{t('Skip to content')}</a>
      <div id="enterprise-main" className={styles.brandHero}>
        <PageHero eyebrow={t(c.eyebrow)} title={`${t(c.title[0])} ${t(c.title[1])}`} subtitle={t(c.support)}>
          <div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(c.cta)} <span aria-hidden="true">↗</span></a><a className={styles.textLink} href="#academy-process">{t(c.explore)} <span aria-hidden="true">↓</span></a></div>
        </PageHero>
      </div>
      <section className={`${styles.section} ${styles.problem}`} aria-labelledby="gap-title"><div className={styles.wrap}>
        {intro(c.problem, 'gap-title')}
        <ol className={`${styles.challengeList} ${literacy.progression}`}>{c.problem.items.map(([title, body], i) => <li key={title}><article className={literacy.progressionCard} aria-labelledby={`challenge-${i}`}><span className={styles.number}>{number(i)}</span><h3 id={`challenge-${i}`}>{t(title)}</h3><p className={literacy.progressionDescription}>{t(body)}</p></article></li>)}</ol>
        
      </div></section>
      <section className={`${styles.section} ${styles.environments}`} aria-labelledby="environments-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.environments.label)}</p><h2 className={styles.environmentsHeading} id="environments-title">{c.environments.titleLines.map(line=><span key={line}>{t(line)}</span>)}</h2>
        <div className={styles.environmentGrid}>{c.environments.items.map(([title, body], i) => <article className={literacy.progressionCard} key={title}>{photo((['factory', 'humanoid', 'senior', 'entertainment', 'security', 'government'] as const)[i], '', false, '(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw')}<span className={styles.number}>{number(i)}</span><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
        <div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(c.focus.areaCta)} <span aria-hidden="true">↗</span></a></div>
        <p className={styles.disclosure}>{t(c.environments.note)}</p>
      </div></section>
      <section className={styles.section} id="academy-process" aria-labelledby="solution-title"><div className={styles.wrap}>
        {intro(c.solution, 'solution-title')}
        <div className={styles.solutionGrid}>{photo('multilingual', styles.factoryPhoto)}<ol className={styles.capabilities}>{c.solution.items.map(([title, body], i) => <li key={title}><span className={styles.number}>{number(i)}</span><div><h3>{t(title)}</h3><p>{t(body)}</p></div></li>)}</ol></div>
        <div className={styles.actions}><a className={styles.textLink} href="#academy-pilot">{t(c.focus.pilotCta)} <span aria-hidden="true">↓</span></a></div>
      </div></section>
      <section className={`${styles.section} ${styles.pilot}`} id="academy-pilot" aria-labelledby="pilot-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.pilot.label)}</p><h2 id="pilot-title">{t(c.pilot.title)}</h2><p className={styles.pilotIntro}>{t(c.pilot.body)}</p>
        <div className={styles.metrics}>{c.focus.metrics.map(([title,body])=><article key={title}><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
        <p className={styles.measurement}>{t(c.focus.measurement)}</p>
        <details className={styles.details}><summary>{t(c.focus.deliverables)}</summary><ul>{c.pilot.items.map(item=><li key={item}>{t(item)}</li>)}</ul></details>
        <div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(c.pilot.cta)} <span aria-hidden="true">↗</span></a></div>
      </div></section>
      <section className={`${styles.section} ${styles.briefing}`} id="enterprise-briefing" aria-labelledby="briefing-title"><div className={`${styles.wrap} ${styles.formGrid}`}>
        <div><p className={styles.eyebrow}>{t(c.form.label)}</p><h2 id="briefing-title">{t(c.form.title)}</h2><p>{t(c.form.body)}</p><p className={styles.scope}>{t(c.scope)}</p></div><div><EnterpriseForm locale={locale} /><details className={styles.details}><summary>{t(c.programs.title)}</summary><ul>{c.programs.items.map(([title,,href])=><li key={href}><Link href={contentHref(href,locale)}>{t(title)}</Link></li>)}</ul></details></div>
      </div></section>
    </main><Footer />
  </>
}
