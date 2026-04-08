'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import styles from './Nav.module.css'

const NAV_LINKS = [
  { label: 'RESEARCH', href: '/research' },
  { label: 'LEARN',    href: '/learn' },
  { label: 'ACCESS',   href: '/access' },
  { label: 'CONNECT',  href: '/connect' },
  { label: 'SUMMIT',   href: '/summit' },
]

export default function Nav({ pinned = false }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${pinned ? styles.pinned : ''}`}>
        <div className="container-fluid">
          <div className={styles.inner}>

            {/* Logo — visible on scroll */}
            <AnimatePresence>
              {(scrolled || pinned) && (
                <motion.a
                  href="/"
                  className={styles.logo}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  The <span className={styles.logoRobot}>Robot</span> Age
                </motion.a>
              )}
            </AnimatePresence>

            {/* Desktop links */}
            <ul className={`${styles.links} ${scrolled ? styles.linksScrolled : ''}`}>
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>

            {/* Hamburger */}
            <button
              className={styles.hamburger}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
                  <line x1="0" y1="1"  x2="24" y2="1"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="8"  x2="24" y2="8"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="0" y1="15" x2="24" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className={styles.mobileLinks}>
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
                >
                  <Link
                    href={href}
                    className={styles.mobileLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
