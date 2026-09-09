'use client'

import { useEffect, useRef } from 'react'
import styles from './LearnMenu.module.css'

const LEARN_LINKS = [
  { label: 'Robot Literacy', href: '/robot-literacy' },
  { label: 'Live Robot Lab', href: '/live-robot-lab' },
  { label: 'Courses & Certifications', href: '/learn' },
]

/** A native disclosure shared by the top, mobile and homepage navigation. */
export default function LearnMenu({ baseUrl = '', inline = false, triggerClassName = '', onNavigate }) {
  const disclosure = useRef(null)

  useEffect(() => {
    const closeOutside = (event) => {
      if (!disclosure.current?.contains(event.target) && disclosure.current) disclosure.current.open = false
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  return <details ref={disclosure} className={`${styles.menu} ${inline ? styles.inline : ''}`}
    onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
    }}
    onKeyDown={(event) => {
      if (event.key === 'Escape' && event.currentTarget.open) {
        event.preventDefault()
        event.stopPropagation()
        event.currentTarget.open = false
        event.currentTarget.querySelector('summary')?.focus()
      }
    }}>
    <summary className={`${styles.trigger} ${triggerClassName}`}>LEARN</summary>
    <ul className={styles.links}>
      {LEARN_LINKS.map(({ label, href }) => <li key={href}>
        <a href={`${baseUrl}${href}`} onClick={() => {
          if (disclosure.current) disclosure.current.open = false
          onNavigate?.()
        }}>{label}</a>
      </li>)}
    </ul>
  </details>
}
