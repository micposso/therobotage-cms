import Link from 'next/link'
import Nav from '@/components/Nav/Nav'
import Footer from '@/components/Footer/Footer'
import Image from '@/components/MediaImage'
import PageHero from '@/components/PageHero/PageHero'
import { michaelBioPath, michaelLinkedIn } from '@/lib/michael-posso'
import { pageMetadata } from '@/lib/i18n/page-metadata'
import { localizedHref, type Locale } from '@/lib/i18n/routing'
import { uiText } from '@/lib/i18n/messages'
import academy from '../learn/learn.module.css'
import typeStyles from '@/components/Certification/Certification.module.css'
import prose from '../press/press.module.css'

type Props = { params: Promise<{ locale?: Locale }> }
const intro = 'Michael Posso is a product engineer and educator who founded TheRobotAge to help people understand the robots they encounter at work and in everyday life.'

export async function generateMetadata({ params }: Props) {
  const { locale = 'en' } = await params
  return pageMetadata({ title: 'Michael Posso | TheRobotAge', description: intro }, michaelBioPath, locale)
}

export default async function MichaelPosso({ params }: Props) {
  const { locale = 'en' } = await params
  const t = (text: string) => uiText(text, locale)
  return <>
    <Nav pinned />
    <main>
      <PageHero title="Michael Posso" eyebrow={t('Founder, TheRobotAge')} subtitle={t(intro)}
        imageContent={<Image src="/brand/instructor.png" alt={t('Illustrated portrait of Michael Posso')} fill
          sizes="(max-width: 767px) 90vw, 456px" loading="eager" style={{ objectFit: 'contain' }} />}>
        <a href={michaelLinkedIn} className={typeStyles.headerCta}>{t('Michael on LinkedIn')}</a>
      </PageHero>
      <div className={academy.container}>
        <section className={academy.section}>
          <h2 className={prose.heading}>{t('Design and robotics')}</h2>
          <div className={prose.prose}>
            <p>{t('Michael brings more than 15 years of experience in digital products, UX engineering, and enterprise technology to robotics. His work asks how people can tell what a robot intends to do, when to trust it, and how to step in when it needs help.')}</p>
            <p>{t('At TheRobotAge, he connects those questions to practical design work. In the Robotics Product Design Practitioner program, he teaches live sessions, reviews individual project milestones, and assesses each final portfolio case study.')}</p>
          </div>
        </section>
        <section className={academy.section}>
          <h2 className={prose.heading}>{t('Teaching and education')}</h2>
          <div className={prose.prose}>
            <p>{t('Michael has taught UX, web design, and JavaScript across high school, undergraduate, and graduate classrooms for more than a decade. His teaching includes courses at the Fashion Institute of Technology and New York Institute of Technology.')}</p>
            <p>{t('He holds a master’s degree in Information Design and Technology from SUNY Polytechnic Institute.')}</p>
            <Link className={typeStyles.headerCta} style={{ justifySelf: 'start' }} href={localizedHref('/learn/rpdp', locale)}>{t('Explore the RPDP program')}</Link>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </>
}
