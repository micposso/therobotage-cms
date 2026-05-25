'use client'

import { useState } from 'react'
import type { RobotFootage } from '@/types'
import styles from './FootageViewer.module.css'

interface FootageViewerProps {
  footage: RobotFootage
  videoUrl: string
  onViewed?: () => void
}

export function FootageViewer({ footage, videoUrl, onViewed }: FootageViewerProps) {
  const [marked, setMarked] = useState(!!footage.viewed_at)

  async function handlePlay() {
    if (marked) return
    setMarked(true)
    try {
      await fetch(`/api/footage/${footage.enrollment_id}/viewed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ footageId: footage.id }),
      })
      onViewed?.()
    } catch {
      // Non-fatal
    }
  }

  return (
    <div className={styles.viewer}>
      <div className={styles.videoWrapper}>
        <video
          className={styles.video}
          src={videoUrl}
          controls
          onPlay={handlePlay}
          playsInline
        />
      </div>
      <div className={styles.meta}>
        <span className={styles.label}>Week {footage.week_number} robot footage</span>
        <span className={styles.uploaded}>
          Uploaded {new Date(footage.uploaded_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </span>
        {marked && <span className={styles.viewed}>Viewed</span>}
      </div>
    </div>
  )
}
