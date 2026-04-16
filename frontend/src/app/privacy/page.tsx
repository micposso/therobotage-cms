import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import styles from './privacy.module.css'

export const metadata = {
  title: 'Privacy Policy — The Robot Age',
  description: 'How The Robot Age collects, uses, and protects your information.',
}

export default function PrivacyPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your information."
      />
      <section className={styles.content}>
        <div className="container-fluid">
          <div className={styles.inner}>

            <p className={styles.updated}>Last updated: April 2026</p>

            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, enroll in a course, register for the Summit, or contact us for support. This may include your name, email address, billing information, and any other information you choose to provide.</p>
            <p>We also collect information automatically when you use our services, including log data, device information, and cookies or similar tracking technologies.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
            <p>We may also use your information to send you information about courses, certifications, events, and other offerings from The Robot Age that we think may interest you. You can opt out of these communications at any time.</p>

            <h2>3. Sharing of Information</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with vendors and service providers who assist us in delivering our services, subject to appropriate confidentiality obligations.</p>

            <h2>4. Cookies</h2>
            <p>We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, some portions of our service may not function properly.</p>

            <h2>5. Data Retention</h2>
            <p>We retain personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.</p>

            <h2>6. Security</h2>
            <p>We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>

            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete the data we hold about you. To exercise these rights, please contact us at the address below.</p>

            <h2>8. Contact</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@therobotage.com">hello@therobotage.com</a>.</p>

          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
