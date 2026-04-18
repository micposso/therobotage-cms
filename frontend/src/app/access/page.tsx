import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import styles from './access.module.css'

export const metadata = {
  title: 'Access — The Robot Age',
  description: 'Join the waitlist for the REP certification.',
}

export default function AccessPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Get Access"
        title="Be first in."
        subtitle="The Robotics Experience Practitioner certification is launching soon. Join the waitlist and we'll notify you when enrollment opens — along with early access offers and pre-launch resources."
        imageSrc="/images/placeholder.jpg"
      />
      <section className={styles.section}>
        <div className="container-fluid">
          <div className={styles.inner}>
            <p className={styles.intro}>
              We&apos;re keeping the first cohort small. Leave your name and email and we&apos;ll be in touch before the public announcement.
            </p>
            <form className={styles.form}>
              <input
                type="text"
                placeholder="Your name"
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Your email"
                className={styles.input}
              />
              <button type="submit" className={styles.submitButton}>
                Join the Waitlist
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
