'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import {
  getWebMcpActivitySnapshot,
  subscribeToWebMcpActivity,
  type WebMcpActivityStatus,
} from '@/webmcp/activity'
import { registerTheRobotAgeTools } from '@/webmcp/tools'
import styles from './WebMCPActivity.module.css'

type Availability = 'checking' | 'available' | 'unsupported' | 'failed'

const EMPTY_HISTORY: ReturnType<typeof getWebMcpActivitySnapshot> = []
const CONTROLLER_KEY = '__theRobotAgeWebMcpController'

function statusLabel(status: WebMcpActivityStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function WebMCPActivity() {
  const [availability, setAvailability] = useState<Availability>('checking')
  const [toolCount, setToolCount] = useState(0)
  const history = useSyncExternalStore(
    subscribeToWebMcpActivity,
    getWebMcpActivitySnapshot,
    () => EMPTY_HISTORY,
  )

  useEffect(() => {
    const modelContext = document.modelContext
    if (!modelContext) {
      queueMicrotask(() => setAvailability('unsupported'))
      return
    }

    const ownedWindow = window as Window & { [CONTROLLER_KEY]?: AbortController }
    ownedWindow[CONTROLLER_KEY]?.abort()

    const controller = new AbortController()
    ownedWindow[CONTROLLER_KEY] = controller

    registerTheRobotAgeTools(modelContext, controller.signal)
      .then((count) => {
        if (!controller.signal.aborted) {
          setAvailability('available')
          setToolCount(count)
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setAvailability('failed')
          setToolCount(0)
        }
      })

    return () => {
      controller.abort()
      if (ownedWindow[CONTROLLER_KEY] === controller) {
        delete ownedWindow[CONTROLLER_KEY]
      }
    }
  }, [])

  const availabilityLabel = {
    checking: 'Checking browser support',
    available: toolCount ? 'WebMCP available' : 'Registering tools',
    unsupported: 'WebMCP unavailable in this browser',
    failed: 'WebMCP registration failed',
  }[availability]

  return (
    <aside className={styles.panel} aria-labelledby="webmcp-activity-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Browser agent activity</p>
          <h2 id="webmcp-activity-title" className={styles.title}>WebMCP</h2>
        </div>
        <div className={styles.availability} role="status" aria-live="polite">
          <span className={styles.statusMark} aria-hidden="true" />
          <span>{availabilityLabel}</span>
          <strong>{toolCount}/4</strong>
        </div>
      </div>

      <p className={styles.route} aria-label="Agent to WebMCP to The Robot Age">
        <span>Agent</span><span aria-hidden="true">→</span><span>WebMCP</span><span aria-hidden="true">→</span><span>TheRobotAge</span>
      </p>

      <div className={styles.history} aria-live="polite" aria-relevant="additions text">
        {history.length === 0 ? (
          <p className={styles.empty}>No browser-agent calls received in this page session.</p>
        ) : (
          <ol className={styles.list}>
            {history.map((entry) => (
              <li key={entry.id} className={styles.item}>
                <div>
                  <strong>{entry.toolName}</strong>
                  <span>{entry.source}</span>
                </div>
                <div className={styles.meta}>
                  <span className={styles[entry.status]}>{statusLabel(entry.status)}</span>
                  <time dateTime={entry.timestamp}>
                    {new Intl.DateTimeFormat(undefined, {
                      hour: 'numeric',
                      minute: '2-digit',
                      second: '2-digit',
                    }).format(new Date(entry.timestamp))}
                  </time>
                  {entry.durationMs !== undefined && <span>{entry.durationMs} ms</span>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  )
}
