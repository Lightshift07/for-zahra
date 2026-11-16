/**
 * Date-unlock rules for "Open On" letters. See CLAUDE.md → "Date-unlock rules".
 *
 * - unlockDate "YYYY-MM-DD" unlocks at 00:00 in the VIEWER'S LOCAL TIME on that day
 *   (so Christmas opens at midnight wherever Zahra's phone is).
 * - unlockDate null = "date TBD" → always locked, shown as "Date to be revealed".
 * - Locking is cosmetic: content ships in the JS bundle. It's a promise, not security.
 */
import type { OnLetter } from './schema'

/** Local-midnight Date for a "YYYY-MM-DD" string. */
export function unlockMoment(isoDate: string): Date {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d, 0, 0, 0, 0)
}

/** Dev-only escape hatch: VITE_UNLOCK_ALL=true npm run dev. Ignored in production builds. */
export const UNLOCK_ALL = import.meta.env.DEV && import.meta.env.VITE_UNLOCK_ALL === 'true'

export function isUnlocked(letter: Pick<OnLetter, 'unlockDate'>, now: Date = new Date()): boolean {
  if (UNLOCK_ALL) return true
  if (letter.unlockDate === null) return false
  return now.getTime() >= unlockMoment(letter.unlockDate).getTime()
}

/** Whole days until unlock (0 = unlocks today/already open), or null if TBD. */
export function daysUntil(letter: Pick<OnLetter, 'unlockDate'>, now: Date = new Date()): number | null {
  if (letter.unlockDate === null) return null
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = unlockMoment(letter.unlockDate).getTime() - today.getTime()
  return Math.max(0, Math.round(diff / 86_400_000))
}
