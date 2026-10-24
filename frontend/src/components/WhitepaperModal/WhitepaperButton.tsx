'use client'

import type { ReactNode } from 'react'

export default function WhitepaperButton({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event('tra:open-whitepaper'))}>
      {children}
    </button>
  )
}
