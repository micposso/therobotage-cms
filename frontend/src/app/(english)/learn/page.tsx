import type { Metadata } from 'next'
import { existsSync } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import Link from 'next/link'
import { pageMetadata } from '@/lib/i18n/page-metadata'
import { contentHref } from '@/lib/i18n/localize'
import { uiText } from '@/lib/i18n/messages'
import type { Locale } from '@/lib/i18n/routing'
import { academyPrograms } from '@/lib/certifications'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Certification from '@/components/Certification/Certification'
import AboutInstructor from '@/components/AboutInstructor/AboutInstructor'
import Footer from '@/components/Footer/Footer'
import AccessForm from '../access/AccessForm'
import styles from '@/components/Certification/Certification.module.css'
import hero from '@/components/PageHero/PageHero.module.css'
import cohort from '@/components/FoundingCohort/FoundingCohort.module.css'
import credential from './[credential]/CredentialPage.module.css'

const description = 'Professional education in product design for robots and commercial robot deployment. Explore RPDP and RDP at The Robot Age Academy. No robotics engineering background required.'
const baseMetadata: Metadata = {
  title: 'The Robot Age Academy — Product Design & Robot Deployment', description,
  openGraph: { title: 'The Robot Age Academy — Product Design & Robot Deployment', description, images: [{ url: '/images/human.png', alt: 'The Robot Age Academy' }] },
  twitter: { card: 'summary_large_image', description, images: ['/images/human.png'] },
}

export async function generateMetadata({ params }: { params: Promise<{ locale?: Locale }> }): Promise<Metadata> {
  const { locale = 'en' } = await params
  return pageMetadata(baseMetadata, '/learn', locale)
}

export default async function LearnPage({ params }: { params: Promise<{ locale?: Locale }> }) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  const href = (url: string) => contentHref(url, locale)
  // Missing assets stay out of Image; placeholders retain the existing square container.
  const images = Object.fromEntries([
    ['hero', 'Professionals learning to work with robots'],
    ['rpdp-feature', 'Product Design for Robots learning experience'],
    ['rpdp-program', 'Designing human-robot interactions'],
    ['rdp-program', 'Preparing teams for commercial robot deployment'],
    ['design-gap', 'Designing understandable and accessible robot behavior'],
    ['deployment-gap', 'Preparing people and organizations for robotics'],
    ['curriculum', 'Applied robotics learning and assessment'],
    ['corporate-training', 'Workforce training for robotics deployment'],
    ['closing', 'The next generation of robotics professionals'],
  ].map(([key, alt]) => {
    const src = `/images/academy/${key}.webp`
    const content = existsSync(path.join(process.cwd(), 'public', src))
      ? <Image src={src} alt={t(alt)} fill sizes="(max-width: 767px) 90vw, 456px" className={hero.image} />
      : <div className={`${hero.imageSlide} ${styles.trackCard} d-flex align-items-center justify-content-center`}><p className={styles.trackDescription}>{t('Image placeholder')}<br /><span>/images/academy/<wbr />{key}.webp</span></p></div>
    return [key, content]
  }))

  return <>
    <Nav pinned />
    <main>
      <PageHero eyebrow={t('THE ROBOT AGE ACADEMY')} title={t('Prepare for a world that works with robots.')}
        subtitle={t('Robots are entering workplaces, public spaces, and everyday life. Designing, deploying, and managing these systems requires new skills beyond traditional engineering.')}
        imageContent={images.hero}>
        <div className={cohort.ctaRow}>
          <p className={hero.subtitle}>{t('The Robot Age Academy develops practical education for professionals responsible for how robots interact with people and operate in the real world.')}</p>
          <p className={styles.trackDescription}>{t('Two professional learning pathways. No robotics engineering background required.')}</p>
          <div className={styles.courseCardBottom}>
            <a href="#programs" className={cohort.cta}>{t('Explore Programs')}</a>
            <Link href={href('/rxd')} className={styles.headerCta}>{t('Explore the RXD Framework')}</Link>
          </div>
        </div>
      </PageHero>

      <Certification eyebrow={t('ROBOT WEEK NYC · NOVEMBER 17–22, 2026')} title={t('Introducing Product Design for Robots')}>
        <div className={cohort.grid}>
          <div className={cohort.ctaRow}>
            <p className={cohort.body}>{t('Our first Product Design for Robots cohort is planned for February 2027.')}</p>
            <p className={cohort.body}>{t(academyPrograms[0].overview)}</p>
            <div className={hero.imageWrap}>{images['rpdp-feature']}</div>
          </div>
          <div className={cohort.right}>
            <dl className={cohort.pricing}>
              {[
                ['Duration', '5 weeks'], ['Learning', '25 hours'], ['Format', 'Live and self-paced'],
                ['Student price', '$149'], ['Professional price', '$299'], ['First cohort', 'February 2027'],
              ].map(([label, value]) => <div key={label}><dt className={cohort.priceMeta}>{t(label)}</dt><dd className={cohort.priceMain}>{t(value)}</dd></div>)}
            </dl>
            <div id="founding-cohort-list" className={cohort.ctaRow}>
              <AccessForm locale={locale} interest="rpdp" buttonLabel="Join the Founding Cohort List" />
              <p className={cohort.availability}>{t('Be notified when enrollment opens. Joining the list does not reserve a seat.')}</p>
            </div>
          </div>
        </div>
      </Certification>

      <Certification id="programs" eyebrow={t('PROFESSIONAL EDUCATION')} title={t('Two pathways into the robotics workforce.')}
        description={t('Whether you design experiences or manage deployments, our programs address the human, operational, and organizational challenges of introducing robots into everyday environments.')}>
        <div className="row g-4">
          {academyPrograms.map((program) => <div className="col-lg-6" key={program.slug}>
            <article className={styles.trackCard}>
              <div className={hero.imageWrap}>{images[`${program.slug}-program`]}</div>
              <h3 className={styles.courseTitle}>{t(program.title)}</h3>
              <p className={styles.trackName}>{t('Credential')}: {t(program.name)} ({program.abbr})</p>
              <p className={styles.trackDescription}><strong>{t('Audience')}: </strong>{t(program.audience)}</p>
              <p className={styles.trackDescription}>{t(program.description)}</p>
              <p className={styles.trackDescription}><strong>{t('Topics')}: </strong>{t(program.topics)}</p>
              <p className={styles.courseMeta}>{t(program.duration)}</p>
              <p className={styles.trackDescription}><strong>{t('Final project')}: </strong>{t(program.capstone)}</p>
              <div><Link href={href(`/learn/${program.slug}`)} className={styles.headerCta}>{t(`Explore ${program.abbr} Curriculum`)}</Link></div>
            </article>
          </div>)}
        </div>
      </Certification>

      <Certification title={t('Robots need more than engineers.')}>
        <div className="row g-4">
          {[
            { title: 'The Design Gap', image: 'design-gap', paragraphs: [
              'As robots enter human environments, teams need professionals who understand behavior, interaction, accessibility, communication, and recovery from failure.',
              'Robots must do more than perform tasks. People need to understand what robots are doing, what they will do next, and how to respond when something goes wrong.',
            ] },
            { title: 'The Deployment Gap', image: 'deployment-gap', paragraphs: [
              'A technically capable robot is not automatically ready for real-world operations.',
              'Organizations need workforce training, safety planning, regulatory awareness, cultural adaptation, operational governance, and measurable adoption to make robotics deployments sustainable.',
            ] },
          ].map((gap) => <div className="col-lg-6" key={gap.image}><article className={styles.trackCard}>
            <div className={hero.imageWrap}>{images[gap.image]}</div>
            <h3 className={styles.courseTitle}>{t(gap.title)}</h3>
            {gap.paragraphs.map((paragraph) => <p key={paragraph} className={styles.trackDescription}>{t(paragraph)}</p>)}
          </article></div>)}
        </div>
      </Certification>

      <Certification title={t("What you'll learn")}>
        <div className="row g-4">
          {academyPrograms.map((program) => <div className="col-lg-6" key={program.slug}><article className={styles.trackCard}>
            <h3 className={styles.courseTitle}>{t(program.title)} ({program.abbr})</h3>
            <ol className={credential.outcomeList}>
              {program.modules.map((module, i) => <li key={module.number} className={credential.outcomeItem}><span aria-hidden="true" className={credential.outcomeTick}>{i + 1}.</span>{t(module.title)}</li>)}
            </ol>
            <p className={styles.trackDescription}><strong>{t('Capstone')}: </strong>{t(program.capstone)}</p>
          </article></div>)}
        </div>
        <div className={`${styles.tracksSection} ${cohort.grid}`}>
          <p className={styles.trackDescription}>{t('Both programs use applied projects and assessments. Credentials issued by The Robot Age Academy recognize completion of educational requirements and are not government licenses, regulated safety certifications, or authorization to operate robots.')}</p>
          <div className={hero.imageWrap}>{images.curriculum}</div>
        </div>
      </Certification>

      <Certification eyebrow={t('FOR ROBOTICS COMPANIES')} title={t('You build the robot. We help prepare the people.')}>
        <div className={cohort.grid}>
          <div className={cohort.ctaRow}>
            {[
              'Commercial robotics deployment requires more than installing hardware and software.',
              'Employees, operators, managers, and customers need the knowledge and confidence to work alongside robots.',
              'The Robot Age develops vendor-neutral training covering deployment readiness, workforce onboarding, human-robot interaction, operational safety, cultural adaptation, and adoption measurement.',
              'Programs can be adapted for robotics manufacturers, integrators, deployment partners, and organizations introducing robots into their operations.',
            ].map((paragraph) => <p key={paragraph} className={styles.trackDescription}>{t(paragraph)}</p>)}
            <Link href={href('/enterprise')} className={cohort.cta}>{t('Discuss Corporate Training')}</Link>
          </div>
          <div className={hero.imageWrap}>{images['corporate-training']}</div>
        </div>
      </Certification>

      <AboutInstructor />

      <Certification title={t("The next generation of robotics professionals won't all be engineers.")}>
        <div className={cohort.grid}>
          <div className={cohort.ctaRow}>
            <p className={styles.trackDescription}>{t('Designers, researchers, educators, operations professionals, and business leaders will help determine how robots become part of everyday life.')}</p>
            <p className={styles.trackDescription}>{t('Build the skills to participate in that future.')}</p>
            <div className={styles.courseCardBottom}>
              <a href="#programs" className={cohort.cta}>{t('Explore Programs')}</a>
              <a href="#academy-updates" className={styles.headerCta}>{t('Get Academy Updates')}</a>
            </div>
            <div id="academy-updates" className={styles.tracksSection}>
              <h3 className={styles.courseTitle}>{t('Get Academy Updates')}</h3>
              <AccessForm locale={locale} interest="academy" buttonLabel="Get Academy Updates" />
            </div>
          </div>
          <div className={hero.imageWrap}>{images.closing}</div>
        </div>
        <div className={styles.startHereRow}>
          <p className={styles.startHereEyebrow}>{t('Also in Learn')}</p>
          <Link href={href('/robot-literacy')} className={styles.headerCta}>{t('Robot Literacy — the experience side of working with robots')}</Link>
        </div>
      </Certification>
    </main>
    <Footer programs={academyPrograms} />
  </>
}
