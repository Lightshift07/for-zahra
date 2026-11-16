/**
 * Date-unlock rules for "Open On" letters. See CLAUDE.md → "Date-unlock rules".
 *
 * - Everything runs on US EASTERN TIME (America/New_York, DST-aware), wherever the
 *   phone is: unlockDate "YYYY-MM-DD" unlocks at 00:00 Eastern on that day, and
 *   countdowns tick down at the same moment.
 * - unlockDate null = "date TBD" → always locked, shown as "Date to be revealed".
 * - Locking is cosmetic: content ships in the JS bundle. It's a promise, not security.
 */
import type { OnLetter } from './schema'

export const UNLOCK_TIME_ZONE = 'America/New_York'

const DAY_MS = 86_400_000

// en-CA formats as YYYY-MM-DD, so results compare correctly as plain strings.
const easternDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: UNLOCK_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const easternClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: UNLOCK_TIME_ZONE,
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

/** Today's date in Eastern time as "YYYY-MM-DD". */
export function easternToday(now: Date = new Date()): string {
  return easternDate.format(now)
}

/** "YYYY-MM-DD" → whole-day number, for exact calendar-day differences. */
function dayNumber(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number)
  return Date.UTC(y, m - 1, d) / DAY_MS
}

/** Milliseconds from `now` until the next 00:00 Eastern. */
export function msUntilEasternMidnight(now: Date = new Date()): number {
  const [h, m, s] = easternClock.format(now).split(':').map(Number)
  const elapsed = ((h * 60 + m) * 60 + s) * 1000 + now.getMilliseconds()
  return Math.max(1000, DAY_MS - elapsed)
}

/** Whole Eastern calendar days from `isoDate` to today (0 on the day itself). */
export function easternDaysSince(isoDate: string, now: Date = new Date()): number {
  return dayNumber(easternToday(now)) - dayNumber(isoDate)
}

/** Dev-only escape hatch: VITE_UNLOCK_ALL=true npm run dev. Ignored in production builds. */
export const UNLOCK_ALL = import.meta.env.DEV && import.meta.env.VITE_UNLOCK_ALL === 'true'

export function isUnlocked(letter: Pick<OnLetter, 'unlockDate'>, now: Date = new Date()): boolean {
  if (UNLOCK_ALL) return true
  if (letter.unlockDate === null) return false
  return easternToday(now) >= letter.unlockDate
}

/** Whole Eastern calendar days until unlock (0 = unlocks today / already open), or null if TBD. */
export function daysUntil(letter: Pick<OnLetter, 'unlockDate'>, now: Date = new Date()): number | null {
  if (letter.unlockDate === null) return null
  return Math.max(0, dayNumber(letter.unlockDate) - dayNumber(easternToday(now)))
}
