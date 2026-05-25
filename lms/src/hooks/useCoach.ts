'use client'

import { useState, useCallback, useRef } from 'react'
import type { CoachMessage } from '@/types'

interface UseCoachOptions {
  conversationId: string
  courseSlug: string
  weekNumber?: number | null
}

export function useCoach({ conversationId, courseSlug, weekNumber }: UseCoachOptions) {
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (streaming || !content.trim()) return

    const userMessage: CoachMessage = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'user',
      content,
      rag_chunks_used: [],
      created_at: new Date().toISOString(),
    }

    const assistantMessage: CoachMessage = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      role: 'assistant',
      content: '',
      rag_chunks_used: [],
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setStreaming(true)
    setError(null)

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: content, courseSlug, weekNumber }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Request failed')
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No stream')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder.decode(value).split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6)
          if (raw === '[DONE]') break

          const chunk = JSON.parse(raw) as { text?: string; error?: string }
          if (chunk.error) throw new Error(chunk.error)
          if (chunk.text) {
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last.role === 'assistant') {
                updated[updated.length - 1] = { ...last, content: last.content + chunk.text }
              }
              return updated
            })
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Unknown error')
      setMessages((prev) => prev.slice(0, -1)) // remove empty assistant message
    } finally {
      setStreaming(false)
    }
  }, [conversationId, courseSlug, weekNumber, streaming])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const loadHistory = useCallback((history: CoachMessage[]) => {
    setMessages(history)
  }, [])

  return { messages, streaming, error, sendMessage, stop, loadHistory }
}
