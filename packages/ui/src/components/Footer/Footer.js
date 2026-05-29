'use client'

import Link from 'next/link'
import { certifications } from '../../lib/certifications'
import styles from './Footer.module.css'

const NAV_LINKS = [
  { label: 'Research', href: '/research' },
  { label: 'Learn',    href: '/learn' },
  { label: 'Access',   href: '/access' },
  { label: 'Connect',  href: '/connect' },
  { label: 'Summit',   href: '/summit' },
]

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/therobotage/',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1" y="4.5" width="2.5" height="8.5" fill="currentColor"/>
        <circle cx="2.25" cy="2.25" r="1.25" fill="currentColor"/>
        <path d="M5.5 4.5h2.5v1.2A3 3 0 0 1 13 8.5V13h-2.5V8.8a1 1 0 0 0-2 0V13H6V4.5z" fill="currentColor"/>
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
    href: 'https://www.instagram.com/roboticsliteracy/',
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="10.5" cy="3.5" r="0.7" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Footer({ baseUrl = '' }) {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className="container-fluid">

        {/* Top row */}
        <div className={`row align-items-start ${styles.topRow}`}>

          {/* Logo + tagline */}
          <div className={`col-lg-4 ${styles.logoCol}`}>
            <a href={`${baseUrl}/`} className={styles.logo}>The Robot Age</a>
            <p className={styles.tagline}>
              Robotic literacy for the people who design the future.
            </p>
          </div>

          {/* Nav links */}
          <div className={`col-lg-2 ${styles.navCol}`}>
            <span className={styles.colLabel}>Pages</span>
            <nav className={styles.navLinks}>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={label} href={`${baseUrl}${href}`} className={styles.navLink}>{label}</a>
              ))}
              <a href="https://learn.therobotage.com" className={styles.navLink}>Sign in</a>
            </nav>
          </div>

          {/* Certifications */}
          <div className={`col-lg-3 ${styles.navCol}`}>
            <span className={styles.colLabel}>Certifications</span>
            <nav className={styles.navLinks}>
              {certifications.map(({ abbr, slug, name }) => (
                <a key={abbr} href={`${baseUrl}/learn/${slug}`} className={styles.navLink}>
                  <span className={styles.certAbbr}>{abbr}</span> — {name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className={`col-lg-3 ${styles.socialCol}`}>
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
            <a href={`${baseUrl}/privacy`} className={styles.legalLink}>Privacy Policy</a>
            <a href={`${baseUrl}/terms`} className={styles.legalLink}>Terms of Use</a>
            <a href={`${baseUrl}/ai-statement`} className={styles.legalLink}>Fair use of AI</a>
          </div>
        </div>

      </div>
    </footer>
  )
}
