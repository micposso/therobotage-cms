import { imageUrl } from '@/lib/image-assets'
import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import ContactForm from '@/components/ContactForm/ContactForm'
import styles from './connect.module.css'

export const metadata = {
  title: 'Connect — The Robot Age',
  description: 'Get in touch, follow the work, or join the community.',
  openGraph: {
    title: 'Connect — The Robot Age',
    description: 'Get in touch, follow the work, or join the community.',
    images: [{ url: imageUrl('/images/human.png'), alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [imageUrl('/images/human.png')],
  },
}

const channels = [
  {
    label: 'General Enquiries',
    value: 'hello@therobotage.com',
    href: 'mailto:hello@therobotage.com',
  },
  {
    label: 'Press & Media',
    value: 'press@therobotage.com',
    href: 'mailto:press@therobotage.com',
  },
  {
    label: 'Summit Partnerships',
    value: 'summit@therobotage.com',
    href: 'mailto:summit@therobotage.com',
  },
  {
    label: 'LinkedIn',
    value: 'The Robot Age',
    href: 'https://linkedin.com/company/therobotage',
  },
]

export default function ConnectPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Connect"
        title="Let's talk"
        subtitle="Ask about Robot Literacy, Live Robot Lab, RPDP, RDP, or a partnership. Tell us what you would like to explore."
        imageSrc="/images/human.png"
      />
      <section className={styles.section}>
        <div className="container-fluid">
          <div className={styles.inner}>
            {channels.map((ch) => (
              <div key={ch.label} className={styles.channelItem}>
                <span className={styles.channelLabel}>{ch.label}</span>
                <a href={ch.href} className={styles.channelLink}>{ch.value}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.formSection}>
        <div className="container-fluid">
          <div className={styles.inner}>
            <h3 className={styles.formHeading}>Send us a message</h3>
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
