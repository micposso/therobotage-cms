'use client'

import { useMemo } from 'react'

export function useWordCount(text: string): number {
  return useMemo(() => {
    if (!text.trim()) return 0
    return text.trim().split(/\s+/).length
  }, [text])
}
