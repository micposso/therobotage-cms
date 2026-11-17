'use client'

import { useSyncExternalStore } from 'react'
import { companies } from '@/lib/metro-robotics'

type Preferences = { category: string; location: string; search: string; selectedId: string | null }
const defaults: Preferences = { category: '', location: '', search: '', selectedId: null }
const key = 'tra-metro-robotics-v2'
const eventName = 'tra-metro-preferences'
let current = defaults
let cachedRaw: string | null | undefined

function getSnapshot() {
  try {
    const raw = localStorage.getItem(key)
    if (raw !== cachedRaw) {
      cachedRaw = raw
      const saved = raw ? JSON.parse(raw) : null
      current = saved && typeof saved === 'object' ? {
        category: typeof saved.category === 'string' ? saved.category : '',
        location: typeof saved.location === 'string' ? saved.location : '',
        search: typeof saved.search === 'string' ? saved.search : '',
        selectedId: companies.some(c => c.id === saved.selectedId) ? saved.selectedId : null,
      } : defaults
    }
  } catch { /* Filtering remains available if browser storage is unavailable. */ }
  return current
}
function subscribe(listener: () => void) {
  window.addEventListener('storage', listener)
  window.addEventListener(eventName, listener)
  return () => {
    window.removeEventListener('storage', listener)
    window.removeEventListener(eventName, listener)
  }
}
function update(patch: Partial<Preferences>) {
  current = { ...getSnapshot(), ...patch }
  try {
    const raw = JSON.stringify(current)
    localStorage.setItem(key, raw)
    cachedRaw = raw
  } catch { /* Keep in-memory state when persistence is unavailable. */ }
  window.dispatchEvent(new Event(eventName))
}

export default function useMapPreferences() {
  const preferences = useSyncExternalStore(subscribe, getSnapshot, () => defaults)
  return [preferences, update] as const
}
