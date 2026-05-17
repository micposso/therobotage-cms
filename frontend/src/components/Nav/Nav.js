'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './Nav.module.css'

const NAV_LINKS = [
  { label: 'RESEARCH',   href: '/research' },
  { label: 'LEARN',      href: '/learn' },
  { label: 'LITERACY',   href: '/robotics-literacy' },
  { label: 'CONNECT',    href: '/connect' },
  { label: 'SUMMIT',     href: '/summit' },
  { label: 'ENTERPRISE', href: '/enterprise' },
]

export default function Nav({ pinned = false }) {
  const [scrolled, setScrolled]       = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const searchInputRef                = useRef(null)
  const mobileSearchInputRef          = useRef(null)
  const router                        = useRouter()

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

  // Focus search input when it opens
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  // Close search on Escape
  useEffect(() => {
    if (!searchOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen])

  function handleDesktopSearch(e) {
    e.preventDefault()
    const q = searchInputRef.current?.value?.trim()
    if (q) {
      setSearchOpen(false)
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  function handleMobileSearch(e) {
    e.preventDefault()
    const q = mobileSearchInputRef.current?.value?.trim()
    if (q) {
      setMenuOpen(false)
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''} ${pinned ? styles.pinned : ''}`}>
        <div className="container-fluid">
          <div className={styles.inner}>

            {/* Logo — always visible on mobile */}
            <a href="/" className={styles.logoMobile}>
              The <span className={styles.logoRobot}>Robot</span> Age
            </a>

            {/* Logo — visible on scroll (desktop) */}
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
            <ul className={`${styles.links} ${scrolled ? styles.linksScrolled : ''} ${searchOpen ? styles.linksHidden : ''}`}>
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>

            {/* Desktop search */}
            <div className={styles.searchWrap}>
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    onSubmit={handleDesktopSearch}
                    className={styles.searchForm}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '220px' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      name="q"
                      placeholder="Search…"
                      className={styles.searchInput}
                      aria-label="Search"
                    />
                  </motion.form>
                )}
              </AnimatePresence>

              <button
                className={`${styles.searchBtn} ${searchOpen ? styles.searchBtnActive : ''}`}
                onClick={() => setSearchOpen((o) => !o)}
                aria-label={searchOpen ? 'Close search' : 'Open search'}
              >
                {searchOpen ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>

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
            {/* Mobile search */}
            <form onSubmit={handleMobileSearch} className={styles.mobileSearchForm}>
              <input
                ref={mobileSearchInputRef}
                type="text"
                name="q"
                placeholder="Search…"
                className={styles.mobileSearchInput}
                aria-label="Search"
              />
              <button type="submit" className={styles.mobileSearchBtn} aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </form>

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
