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
  multilingual: '/images/enterprise/enterprise-multilingual-training.webp',
  adoption: '/images/enterprise/enterprise-adoption-workplace.webp',
  serviceReadiness: '/images/enterprise/enterprise-service-readiness.webp',
  serviceAcademy: '/images/enterprise/enterprise-service-academy.webp',
  serviceAdoption: '/images/enterprise/enterprise-service-adoption.webp',
  serviceCommunity: '/images/enterprise/enterprise-service-community.webp',
}
const serviceImages = ['serviceReadiness', 'serviceAcademy', 'serviceAdoption', 'serviceCommunity'] as const
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale = 'en' } = await params
  const title = 'Robot Deployment & Community Readiness | The Robot Age'
  const description = 'Vendor-neutral deployment readiness, workforce training, adoption research, and community engagement for robot manufacturers, integrators, RaaS providers, and operators.'
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
    <div className={styles.introGrid}><div><p className={styles.eyebrow}>{t(data.label)}</p><h2 id={id} className={styles.gapHeading}>{id === 'gap-title' ? <><span>{t('Your engineers deploy robots.')}</span><span>{t('Who prepares the workforce?')}</span></> : id === 'solution-title' ? <><span>{t('Your customer training operation.')}</span><span>{t('Without building one from scratch.')}</span></> : t(data.title)}</h2></div><div className={styles.prose}><p>{t(data.body)}</p>{data.note && <p>{t(data.note)}</p>}</div></div>
  return <>
    <Nav pinned />
    <main className={styles.page} lang={locale}>
      <a className={styles.skip} href="#enterprise-main">{t('Skip to content')}</a>
      <div id="enterprise-main" className={styles.brandHero}>
        <PageHero eyebrow={t(c.eyebrow)} title={`${t(c.title[0])} ${t(c.title[1])}`} subtitle={t(c.support)}>
          <div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#enterprise-services">{t(c.cta)} <span aria-hidden="true">↗</span></a><a className={styles.textLink} href="#academy-pilot">{t(c.heroSecondary)}</a></div>
        </PageHero>
      </div>
      <section className={styles.section} id="enterprise-services" aria-labelledby="services-title"><div className={styles.wrap}>
        {intro(c.services, 'services-title')}
        <div className={styles.services}>{c.services.items.map((service, i) => <article className={`${literacy.progressionCard} ${styles.serviceCard}`} key={service.number}>
          {photo(serviceImages[i], styles.serviceImage, false, '(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 650px')}
          <div className={styles.serviceCardBody}>
            <span className={styles.number}>{service.number}</span><h3>{t(service.title)}</h3><p className={styles.serviceValue}><strong>{t(service.value)}</strong></p><p className={styles.serviceDescription}>{t(service.description)}</p><a className={styles.textLink} href={service.href}>{t(service.cta)} <span aria-hidden="true">↓</span></a>
          </div>
        </article>)}</div>
      </div></section>
      <section className={`${styles.section} ${styles.problem}`} aria-labelledby="gap-title"><div className={styles.wrap}>
        {intro(c.problem, 'gap-title')}
        <ol className={`${styles.challengeList} ${literacy.progression}`}>{c.problem.items.map(([title, body], i) => <li key={title}><article className={literacy.progressionCard} aria-labelledby={`challenge-${i}`}><span className={styles.number}>{number(i)}</span><h3 id={`challenge-${i}`}>{t(title)}</h3><p className={literacy.progressionDescription}>{t(body)}</p></article></li>)}</ol>
        
      </div></section>
      <section className={`${styles.section} ${styles.environments}`} aria-labelledby="environments-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.environments.label)}</p><h2 className={styles.environmentsHeading} id="environments-title">{c.environments.titleLines.map(line=><span key={line}>{t(line)}</span>)}</h2>
        <p className={styles.pricingIntro}>{t(c.environments.body)}</p>
        <div className={styles.environmentGrid}>{c.environments.items.map(([title, body], i) => <article className={literacy.progressionCard} key={title}><span className={styles.number}>{number(i)}</span><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
        <div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#deployment-readiness">{t(c.focus.areaCta)} <span aria-hidden="true">↗</span></a></div>
        <p className={styles.disclosure}>{t(c.environments.note)}</p>
      </div></section>
      <section className={styles.section} id="deployment-readiness" aria-labelledby="readiness-title"><div className={styles.wrap}>
        {intro(c.readiness, 'readiness-title')}
        <ol className={styles.capabilities}>{c.readiness.items.map(([title, body], i) => <li key={title}><span className={styles.number}>{number(i)}</span><div><h3>{t(title)}</h3><p>{t(body)}</p></div></li>)}</ol>
        <div className={styles.actions}><a className={styles.textLink} href="#enterprise-briefing">{t(c.readiness.cta)} <span aria-hidden="true">↗</span></a></div>
      </div></section>
      <section className={styles.section} id="academy-service" aria-labelledby="solution-title"><div className={styles.wrap}>
        {intro(c.solution, 'solution-title')}
        <div className={styles.solutionGrid}>{photo('multilingual', styles.factoryPhoto)}<ol className={styles.capabilities}>{c.solution.items.map(([title, body], i) => <li key={title}><span className={styles.number}>{number(i)}</span><div><h3>{t(title)}</h3><p>{t(body)}</p></div></li>)}</ol></div>
        <div className={styles.actions}><a className={styles.textLink} href="#academy-pilot">{t(c.focus.pilotCta)} <span aria-hidden="true">↓</span></a></div>
      </div></section>
      <section className={styles.section} id="academy-pricing" aria-labelledby="pricing-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.pricing.label)}</p><h2 id="pricing-title">{t(c.pricing.title)}</h2><p className={styles.pricingIntro}>{t(c.pricing.intro)}</p>
        <div className={styles.pricingGrid}>{c.pricing.plans.map((plan,i)=><article className={`${literacy.progressionCard} ${styles.pricePlan}`} key={plan.name} aria-labelledby={`plan-${i}`}>
          <h3 id={`plan-${i}`}>{t(plan.name)}</h3><p>{t(plan.tag)}</p><div className={styles.planPrice}>{t(plan.price)}</div><p className={styles.planSetup}>{t(plan.setup)}</p><p className={styles.planTotal}>{t(plan.total)}</p>
          <p className={styles.planValue}>{t(plan.value)}</p><ul>{plan.items.map(item=><li key={item}>{t(item)}</li>)}</ul>
          <a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(plan.cta)} <span aria-hidden="true">↗</span></a>
        </article>)}</div>
        <p className={styles.pricingTerms}>{t(c.pricing.terms)}</p><p>{t(c.pricing.scope)}</p>
        <details className={styles.details}><summary>{t(c.pricing.detailsLabel)}</summary><ul className={styles.pricingDetails}>{c.pricing.details.map(item=><li key={item}>{t(item)}</li>)}</ul></details>
        <details className={styles.details}><summary>{t(c.pricing.industryLabel)}</summary><div className={styles.industryScope}>{c.pricing.industries.map(([title,body])=><article key={title}><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div><p className={styles.scope}>{t(c.pricing.boundary)}</p></details>
      </div></section>
      <section className={`${styles.section} ${styles.pilot}`} id="academy-pilot" aria-labelledby="pilot-title"><div className={styles.wrap}>
        <p className={styles.eyebrow}>{t(c.pilot.label)}</p><h2 id="pilot-title">{t(c.pilot.title)}</h2><p className={styles.pilotIntro}>{t(c.pilot.body)}</p>
        <div className={styles.metrics}>{c.focus.metrics.map(([title,body])=><article key={title}><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div>
        <p className={styles.measurement}>{t(c.focus.measurement)}</p>
        <details className={styles.details}><summary>{t(c.focus.deliverables)}</summary><ul>{c.pilot.items.map(item=><li key={item}>{t(item)}</li>)}</ul></details>
        <div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(c.pilot.cta)} <span aria-hidden="true">↗</span></a></div>
      </div></section>
      <section className={styles.section} id="adoption-performance" aria-labelledby="adoption-title"><div className={styles.wrap}>
        {intro(c.adoption, 'adoption-title')}
        <div className={styles.solutionGrid}>{photo('adoption', styles.factoryPhoto)}<ol className={styles.capabilities}>{c.adoption.items.map(([title, body], i) => <li key={title}><span className={styles.number}>{number(i)}</span><div><h3>{t(title)}</h3><p>{t(body)}</p></div></li>)}</ol></div>
        <div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(c.adoption.cta)} <span aria-hidden="true">↗</span></a></div>
      </div></section>
      <section className={`${styles.section} ${styles.problem}`} id="community-readiness" aria-labelledby="community-title"><div className={styles.wrap}>
        {intro(c.community, 'community-title')}
        <ol className={`${styles.challengeList} ${literacy.progression}`}>{c.community.items.map(([title, body], i) => <li key={title}><article className={literacy.progressionCard} aria-labelledby={`community-area-${i}`}><span className={styles.number}>{number(i)}</span><h3 id={`community-area-${i}`}>{t(title)}</h3><p className={literacy.progressionDescription}>{t(body)}</p></article></li>)}</ol>
        <p className={styles.scope}>{t(c.community.scope)}</p><div className={styles.actions}><a className={`${cta.cta} ${styles.button}`} href="#enterprise-briefing">{t(c.community.cta)} <span aria-hidden="true">↗</span></a></div>
      </div></section>
      <section className={`${styles.section} ${styles.briefing}`} id="enterprise-briefing" aria-labelledby="briefing-title"><div className={`${styles.wrap} ${styles.formGrid}`}>
        <div><p className={styles.eyebrow}>{t(c.form.label)}</p><h2 id="briefing-title">{t(c.form.title)}</h2><p>{t(c.form.body)}</p><p className={styles.scope}>{t(c.scope)}</p></div><div><EnterpriseForm locale={locale} /><details className={styles.details}><summary>{t(c.programs.title)}</summary><ul>{c.programs.items.map(([title,,href])=><li key={href}><Link href={contentHref(href,locale)}>{t(title)}</Link></li>)}</ul></details></div>
      </div></section>
    </main><Footer />
  </>
}
