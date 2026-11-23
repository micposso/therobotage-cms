import type { ReactNode } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import PageHero from '@/components/PageHero/PageHero'
import Image from '@/components/MediaImage'
import { academyPrograms, rpdpModules } from '@/lib/certifications'
import { imageAsset, imageUrl } from '@/lib/image-assets'
import { contentHref } from '@/lib/i18n/localize'
import { uiText } from '@/lib/i18n/messages'
import { pageMetadata } from '@/lib/i18n/page-metadata'
import type { Locale } from '@/lib/i18n/routing'
import { foundingPrice, rpdpCampaign, rpdpPrices, rpdpProgram, type RpdpQuery } from '@/lib/rpdp-registration'
import { siteOverview } from '@/lib/site'
import AccessForm from '../../access/AccessForm'
import cohort from '@/components/FoundingCohort/FoundingCohort.module.css'
import certification from '@/components/Certification/Certification.module.css'
import hero from '@/components/PageHero/PageHero.module.css'
import academy from '../learn.module.css'
import credential from './CredentialPage.module.css'
import styles from './RpdpPage.module.css'
import { rpdpCopy as copy } from './rpdp-content'
import RpdpInteractions from './RpdpInteractions'
import featureImage from '../../../../../public/images/academy/rpdp-feature.webp'

const program = academyPrograms[0]
const bannerPath = '/images/academy/rpdp-feature.webp'
const route = '/learn/rpdp'
const signup = 'founding-cohort-list'
const signupLabel = 'Join the Founding Cohort List'
const weeklyTime = '2.5 hours live + 2 hours independent = 4.5 hours'
const assessmentWeights = [20, 25, 25, 15, 15]
const audienceLabels = { professional: 'Professional', student: 'Student' } as const
const tools = [
  ['Figma and FigJam'],
  ['TheRobotAge RXD Framework', '/rxd'],
  ['TheRobotAge RXD Scorecard', '/rxd-scorecard'],
  ['TheRobotAge Robot Policy Watch', '/policy'],
  ['Browser-based robotics simulation'],
  ['Optional ElevenLabs voice prototyping'],
  ['NIST AI RMF and accessibility resources', 'https://www.nist.gov/itl/ai-risk-management-framework'],
] as const

export function rpdpMetadata(locale: Locale) {
  const title = 'Robotics Product Design Practitioner (RPDP) | TheRobotAge Academy'
  const description = program.description
  const image = imageUrl(bannerPath)
  return pageMetadata({
    title: { absolute: title }, description,
    openGraph: { title, description, images: [{ url: image, alt: 'Product Design for Robots learning experience' }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }, route, locale)
}

function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return <section id={id} className={academy.section}>
    <header className={academy.sectionHeader}><h2 className={certification.headline}>{title}</h2></header>
    {children}
  </section>
}

function FeatureGrid({ items, locale }: { items: readonly (readonly [string, string])[]; locale: Locale }) {
  return <div className={styles.features}>
    {items.map(([title, body]) => <article key={title} className={`${academy.stack} ${styles.feature}`}>
      <h3 className={certification.courseTitle}>{uiText(title, locale)}</h3>
      <p className={certification.trackDescription}>{uiText(body, locale)}</p>
    </article>)}
  </div>
}

function TextList({ items, locale }: { items: readonly string[]; locale: Locale }) {
  return <ul className={styles.list}>{items.map(item => <li key={item}>{uiText(item, locale)}</li>)}</ul>
}

export default function RpdpPage({ locale, query, active }: { locale: Locale; query: RpdpQuery; active: boolean }) {
  const t = (text: string) => uiText(text, locale)
  const href = (path: string) => contentHref(path, locale)
  const intlLocale = locale === 'es' ? 'es-US' : 'en-US'
  const money = new Intl.NumberFormat(intlLocale, { style: 'currency', currency: 'USD' })
  const wholeDollars = new Intl.NumberFormat(intlLocale, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const percent = new Intl.NumberFormat(intlLocale, { style: 'percent' })
  const deadline = new Intl.DateTimeFormat(intlLocale, {
    dateStyle: 'long', timeStyle: 'short', timeZone: rpdpCampaign.timeZone,
  }).format(new Date(Date.parse(rpdpCampaign.endsBefore) - 60_000))
  const prices = Object.entries(rpdpPrices).map(([audience, planned]) => ({
    audience: t(audienceLabels[audience as keyof typeof audienceLabels]),
    planned: wholeDollars.format(planned),
    founding: money.format(foundingPrice(planned)),
  }))
  const course = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${t(program.name)} (RPDP)`,
    courseCode: `${rpdpProgram.program} v${rpdpProgram.version}`,
    url: new URL(href(route), siteOverview.url).href,
    description: [
      t(program.description),
      ...prices.map(price => `${price.audience} — ${t('Planned price')} ${price.planned}.${active ? ` ${t('Founding offer')} ${price.founding}.` : ''}`),
    ].join(' '),
    provider: { '@type': 'Organization', name: 'TheRobotAge', url: siteOverview.url },
    educationalCredentialAwarded: t('RPDP educational completion credential'),
    timeRequired: 'PT36H',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      name: t('February 2027 Founding Cohort'),
      courseMode: t('Live online'),
      duration: 'P8W',
      courseWorkload: t(weeklyTime),
    },
  }

  return <>
    <Nav pinned />
    <main id="rpdp-program" className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(course).replace(/</g, '\\u003c') }} />
      <PageHero eyebrow={t('THEROBOTAGE ACADEMY / RPDP v1.0')} title={t(copy.title)} subtitle={t(copy.intro)}
        imageWrapClassName={styles.heroImage}
        imageContent={<Image src={imageAsset(bannerPath, featureImage)} alt="" fill sizes="(max-width: 767px) 90vw, 456px"
          className={hero.image} placeholder="blur" loading="eager" />}>
        <div className={styles.heroDetails}>
          <p className={credential.overviewText}>{t(copy.outcome)}</p>
          <ul className={`${credential.pills} ${styles.badges}`}>
            {['8 weeks', '36 hours', program.format, 'February 2027', 'No robotics programming required', 'Portfolio capstone'].map(item =>
              <li key={item} className={credential.pill}>{t(item)}</li>)}
          </ul>
          <div className={certification.courseCardBottom}>
            <a className={cohort.cta} href={`#${signup}`} data-rpdp-cta="hero">{t(signupLabel)}</a>
            <a className={certification.headerCta} href="#curriculum">{t('Explore Curriculum')}</a>
          </div>
        </div>
      </PageHero>

      <div className={`${academy.container} ${styles.columns}`}>
        <aside id={signup} tabIndex={-1} aria-labelledby="rpdp-signup-title" className={styles.signup}>
          <h2 id="rpdp-signup-title" className={certification.courseTitle}>{t('Join the RPDP Founding Cohort.')}</h2>
          {active && <p className={styles.promotion}>{t('Black Friday founding offer')} · {percent.format(rpdpCampaign.discount / 100)} {t('off')}</p>}
          <dl className={`${cohort.pricing} ${styles.prices}`}>
            {prices.map(price => <div key={price.audience}>
              <dt>{price.audience}</dt>
              <dd className={cohort.priceMeta}>{t('Planned price')} {price.planned}</dd>
              {active && <dd className={cohort.priceMeta}>{t('Founding offer')} <strong>{price.founding}</strong></dd>}
            </div>)}
          </dl>
          {active && <p className={styles.formNote}>{t('Offer deadline')} <time dateTime={new Date(Date.parse(rpdpCampaign.endsBefore) - 60_000).toISOString()}>{deadline}</time> ({t('New York time')}).</p>}
          <AccessForm locale={locale} interest="rpdp" buttonLabel={signupLabel} rpdp={{ source: href(route), query }} />
          <p id="rpdp-form-note" className={styles.formNote}>{t('No payment required. Joining does not reserve a seat.')}</p>
        </aside>

        <div className={styles.content}>
          <Section title={t(copy.whyTitle)}>
            <p className={credential.overviewText}>{t(copy.why)}</p>
            <TextList items={copy.whyItems} locale={locale} />
          </Section>
          <Section title={t(copy.audienceTitle)}>
            <p className={credential.overviewText}>{t(copy.audienceIntro)}</p>
            <ul className={`${credential.pills} ${styles.badges}`}>
              {copy.audiences.map(item => <li key={item} className={credential.pill}>{t(item)}</li>)}
            </ul>
          </Section>
          <Section title={t(copy.skillsTitle)}><FeatureGrid items={copy.skills} locale={locale} /></Section>
          <Section title={t('Eight-week curriculum')} id="curriculum">
            <p className={credential.overviewText}>{t('36 learning hours · 20 hours of live instruction · 16 hours of independent study')}</p>
            <div className={credential.moduleList}>
              {rpdpModules.map(module => <details key={module.number} data-rpdp-week={module.number} className={styles.module}>
                <summary>
                  <span className={credential.moduleNumber}>{t('Week')} {module.number}</span>
                  <span className={credential.moduleTitle}>{t(module.title)}</span>
                </summary>
                <div className={styles.moduleBody}>
                  <p>{t(module.description)}</p>
                  <dl>
                    {[
                      ['Topics', module.topics], ['Tools', module.tools],
                      ['Weekly deliverable', module.deliverable], ['Time allocation', weeklyTime],
                    ].map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}
                  </dl>
                </div>
              </details>)}
            </div>
            <a className={certification.headerCta} href="#capstone" data-rpdp-capstone>{t('Explore the capstone')}</a>
          </Section>
          <Section title={t(copy.capstoneTitle)} id="capstone">
            <p className={credential.overviewText}>{t(copy.capstone)}</p>
            <FeatureGrid items={copy.tracks} locale={locale} />
            <h3 className={`${certification.courseTitle} ${styles.subheading}`}>{t('Final deliverables')}</h3>
            <TextList items={copy.finalDeliverables} locale={locale} />
            <p className={credential.overviewText}>{t(copy.capstoneRequirements)}</p>
            <p className={credential.overviewText}>{t(copy.hardware)}</p>
          </Section>
          <Section title={t('Tools and technology')}>
            <ul className={styles.list}>
              {tools.map(([name, url]) => <li key={name}>
                {url ? <Link className={certification.headerCta} href={href(url)}>{t(name)}</Link> : t(name)}
              </li>)}
            </ul>
            <p className={credential.overviewText}>{t('The simulator provider and specific account requirements will be announced before enrollment.')}</p>
          </Section>
          <Section title={t(copy.careerTitle)}><FeatureGrid items={copy.careers} locale={locale} /></Section>
          <Section title={t(copy.credentialTitle)}>
            <p className={credential.overviewText}>{t(copy.credential)}</p>
            <h3 className={certification.courseTitle}>{t('Assessment model')}</h3>
            <dl className={credential.specCard}>
              {copy.assessment.map((criterion, index) => <div className={styles.assessmentRow} key={criterion}>
                <dt>{t(criterion)}</dt><dd>{percent.format(assessmentWeights[index] / 100)}</dd>
              </div>)}
            </dl>
            <p className={credential.overviewText}>{t(copy.disclaimer)}</p>
          </Section>
          <Link className={credential.backLink} href={href('/learn')}>{t('← Back to Academy')}</Link>
        </div>
      </div>
      <RpdpInteractions locale={locale} signupLabel={t('Join the cohort list')} />
    </main>
    <Footer />
  </>
}
