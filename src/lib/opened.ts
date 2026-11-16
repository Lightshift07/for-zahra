/**
 * Remembers which letters have been opened on this device (localStorage), so
 * newly unlocked letters can show a "New" badge. Purely a nicety: if storage is
 * unavailable (private mode, cleared data) everything still works, just without
 * the badge memory.
 */
import { useSyncExternalStore } from 'react'

const KEY = 'for-zahra:opened'
const listeners = new Set<() => void>()

function read(): ReadonlySet<string> {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [])
  } catch {
    return new Set()
  }
}

let snapshot: ReadonlySet<string> = read()

export function markOpened(id: string) {
  if (snapshot.has(id)) return
  snapshot = new Set([...snapshot, id])
  try {
    localStorage.setItem(KEY, JSON.stringify([...snapshot]))
  } catch {
    // storage unavailable — keep the in-memory value for this visit
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useOpened(): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, () => snapshot)
}
