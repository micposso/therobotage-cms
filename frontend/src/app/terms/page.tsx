import Nav from '@/components/Nav/Nav'
import PageHero from '@/components/PageHero/PageHero'
import Footer from '@/components/Footer/Footer'
import styles from './terms.module.css'

export const metadata = {
  title: 'Terms of Use — The Robot Age',
  description: 'The terms and conditions governing use of The Robot Age platform.',
  openGraph: {
    title: 'Terms of Use — The Robot Age',
    description: 'The terms and conditions governing use of The Robot Age platform.',
    images: [{ url: '/images/home.png', alt: 'The Robot Age' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/home.png'],
  },
}

export default function TermsPage() {
  return (
    <>
      <Nav pinned />
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        subtitle="The terms and conditions governing your use of The Robot Age platform."
        imageSrc="/images/placeholder.jpg"
      />
      <section className={styles.content}>
        <div className="container-fluid">
          <div className={styles.inner}>

            <p className={styles.updated}>Last updated: April 2026</p>

            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using The Robot Age platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily access the materials on The Robot Age platform for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, or transfer the materials to another person.</p>

            <h2>3. Course Enrollment and Access</h2>
            <p>Upon enrollment in a course or certification program, you are granted a limited, non-exclusive, non-transferable license to access and view the course content for your personal educational use. You may not share your account credentials or allow others to access course content through your account.</p>

            <h2>4. Intellectual Property</h2>
            <p>All content on this platform — including text, graphics, course materials, and certifications — is the property of The Robot Age and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>

            <h2>5. User Conduct</h2>
            <p>You agree not to use the platform in any way that is unlawful, harmful, or offensive, or that interferes with other users' access to the platform. We reserve the right to terminate access for any user who violates these terms.</p>

            <h2>6. Certifications</h2>
            <p>Credentials issued by The Robot Age are awarded upon successful completion of program requirements. Credentials remain the property of The Robot Age and may be revoked if obtained through misrepresentation or fraudulent means.</p>

            <h2>7. Disclaimer</h2>
            <p>The materials on The Robot Age platform are provided on an "as is" basis. The Robot Age makes no warranties, expressed or implied, and hereby disclaims all other warranties including implied warranties of merchantability or fitness for a particular purpose.</p>

            <h2>8. Limitation of Liability</h2>
            <p>In no event shall The Robot Age or its principals be liable for any damages arising out of the use or inability to use the materials on this platform, even if The Robot Age has been notified of the possibility of such damage.</p>

            <h2>9. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of this page. Your continued use of the platform after any changes constitutes your acceptance of the new terms.</p>

            <h2>10. Contact</h2>
            <p>If you have any questions about these Terms of Use, please contact us at <a href="mailto:hello@therobotage.com">hello@therobotage.com</a>.</p>

          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
