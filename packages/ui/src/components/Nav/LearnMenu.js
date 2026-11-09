'use client'

import { useEffect, useRef } from 'react'
import { programLinks } from '../../lib/certifications'
import styles from './LearnMenu.module.css'

const LEARN_LINKS = [...programLinks, { label: 'Academy — Compare Programs', href: '/learn' }]

/** A native disclosure shared by the top, mobile and homepage navigation. */
export default function LearnMenu({ baseUrl = '', inline = false, triggerClassName = '', onNavigate, translate = (text) => text, resolveHref = (href) => href }) {
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
      // Touch browsers may blur the summary with no next focus target before
      // dispatching the link click. Outside pointer presses are handled above.
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
    }}
    onKeyDown={(event) => {
      if (event.key === 'Escape' && event.currentTarget.open) {
        event.preventDefault()
        event.stopPropagation()
        event.currentTarget.open = false
        event.currentTarget.querySelector('summary')?.focus()
      }
    }}
    onPointerEnter={(event) => {
      if (!inline && event.pointerType === 'mouse') event.currentTarget.open = true
    }}
    onPointerLeave={(event) => {
      if (!inline && event.pointerType === 'mouse') event.currentTarget.open = false
    }}>
    <summary className={`${styles.trigger} ${triggerClassName}`}>{translate('PROGRAMS')}</summary>
    <ul className={styles.links}>
      {LEARN_LINKS.map(({ label, href }) => <li key={href}>
        <a href={resolveHref(`${baseUrl}${href}`)} onClick={() => {
          if (disclosure.current) disclosure.current.open = false
          onNavigate?.()
        }}>{translate(label)}</a>
      </li>)}
    </ul>
  </details>
}
