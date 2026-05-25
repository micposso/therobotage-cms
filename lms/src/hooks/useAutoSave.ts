'use client'

import { useEffect, useRef, useCallback } from 'react'

const DEBOUNCE_MS = 2000

export function useAutoSave(
  submissionId: string | null,
  content: string,
  onSaved?: (savedAt: string) => void
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedRef = useRef<string>('')

  const save = useCallback(async (text: string) => {
    if (!submissionId || text === lastSavedRef.current) return
    try {
      const res = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft: text }),
      })
      if (res.ok) {
        const data = await res.json()
        lastSavedRef.current = text
        onSaved?.(data.draft_saved_at)
      }
    } catch {
      // Silent fail — next keystroke will retry
    }
  }, [submissionId, onSaved])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => save(content), DEBOUNCE_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [content, save])

  const flush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    return save(content)
  }, [content, save])

  return { flush }
}
