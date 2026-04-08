'use client'

import styles from './Footer.module.css'

const NAV_LINKS = ['Research', 'Learn', 'Access', 'Connect', 'Summit']

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="3.5" height="12" rx="0.5" fill="currentColor"/>
        <rect x="1" y="1" width="12" height="3" rx="0.5" fill="currentColor"/>
        <path d="M4.5 5.5h3.5v7M8 8.5A3 3 0 0 1 13 11v1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5.5 5l4 2-4 2V5z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="10.5" cy="3.5" r="0.7" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container-fluid">

        {/* Top row */}
        <div className={`row align-items-start ${styles.topRow}`}>

          {/* Logo + tagline */}
          <div className={`col-lg-4 ${styles.logoCol}`}>
            <a href="/" className={styles.logo}>The Robot Age</a>
            <p className={styles.tagline}>
              Robotic literacy for the people who design the future.
            </p>
          </div>

          {/* Nav links */}
          <div className={`col-lg-4 ${styles.navCol}`}>
            <span className={styles.colLabel}>Pages</span>
            <nav className={styles.navLinks}>
              {NAV_LINKS.map((link) => (
                <a key={link} href="#" className={styles.navLink}>{link}</a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className={`col-lg-4 ${styles.socialCol}`}>
            <span className={styles.colLabel}>Follow</span>
            <div className={styles.socialLinks}>
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  {icon}
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom row */}
        <div className={`row align-items-center ${styles.bottomRow}`}>
          <div className="col-md-6">
            <p className={styles.legal}>
              &copy; {year} The Robot Age. All rights reserved.
            </p>
          </div>
          <div className={`col-md-6 ${styles.legalRight}`}>
            <a href="#" className={styles.legalLink}>Privacy Policy</a>
            <a href="#" className={styles.legalLink}>Terms of Use</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
