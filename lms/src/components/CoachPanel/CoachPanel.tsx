'use client'

import { useState, useEffect, useRef } from 'react'
import { useCoach } from '@/hooks/useCoach'
import type { CoachMessage as CoachMessageType } from '@/types'
import styles from './CoachPanel.module.css'

interface CoachPanelProps {
  enrollmentId: string
  courseSlug: string
  weekNumber?: number
}

export function CoachPanel({ enrollmentId, courseSlug, weekNumber }: CoachPanelProps) {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const { messages, streaming, error, sendMessage, loadHistory } = useCoach({
    conversationId: conversationId ?? '',
    courseSlug,
    weekNumber: weekNumber ?? null,
  })

  useEffect(() => {
    async function init() {
      const res = await fetch(`/api/coach/conversations?enrollmentId=${enrollmentId}`)
      const convos = await res.json()
      const existing = convos[0]

      if (existing) {
        setConversationId(existing.id)
        loadHistory(existing.coach_messages ?? [])
      } else {
        const createRes = await fetch('/api/coach/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enrollmentId, weekNumber: weekNumber ?? null }),
        })
        const created = await createRes.json()
        setConversationId(created.id)
      }
    }
    void init()
  }, [enrollmentId, weekNumber, loadHistory])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!conversationId || !input.trim() || streaming) return
    const msg = input
    setInput('')
    await sendMessage(msg)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.title}>Learning Coach</span>
        <span className={styles.limit}>30 messages/day</span>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && !streaming && (
          <p className={styles.empty}>Ask a question about this week's material.</p>
        )}
        {messages.map((msg) => (
          <CoachMessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.inputRow}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          rows={2}
          disabled={streaming || !conversationId}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void handleSend()
            }
          }}
        />
        <button
          type="button"
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={streaming || !input.trim() || !conversationId}
        >
          {streaming ? '…' : 'Send'}
        </button>
      </div>
    </div>
  )
}

function CoachMessageBubble({ message }: { message: CoachMessageType }) {
  return (
    <div className={`${styles.message} ${message.role === 'user' ? styles.user : styles.assistant}`}>
      <p className={styles.messageContent}>{message.content}</p>
    </div>
  )
}
