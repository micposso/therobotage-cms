export type WebMcpActivityStatus = 'received' | 'executing' | 'completed' | 'failed'

export type WebMcpActivityEntry = {
  id: string
  toolName: string
  source: 'Browser agent'
  status: WebMcpActivityStatus
  timestamp: string
  durationMs?: number
}

const MAX_HISTORY = 8
const listeners = new Set<() => void>()
const startedAt = new Map<string, number>()
let history: WebMcpActivityEntry[] = []

function emit() {
  for (const listener of listeners) listener()
}

export function subscribeToWebMcpActivity(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getWebMcpActivitySnapshot() {
  return history
}

export function beginWebMcpActivity(toolName: string) {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

  startedAt.set(id, performance.now())
  const entry: WebMcpActivityEntry = {
    id,
    toolName,
    source: 'Browser agent',
    status: 'received',
    timestamp: new Date().toISOString(),
  }
  history = [
    entry,
    ...history,
  ].slice(0, MAX_HISTORY)
  emit()
  return id
}

export function updateWebMcpActivity(id: string, status: WebMcpActivityStatus) {
  const start = startedAt.get(id)
  const isFinished = status === 'completed' || status === 'failed'

  history = history.map((entry) => (
    entry.id === id
      ? {
          ...entry,
          status,
          durationMs: isFinished && start !== undefined
            ? Math.max(0, Math.round(performance.now() - start))
            : undefined,
        }
      : entry
  ))

  if (isFinished) startedAt.delete(id)
  emit()
}
