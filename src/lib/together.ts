import { easternDaysSince, easternToday } from '../content'

/** The day it all started. Also recorded in CLAUDE.md → Key dates. */
export const TOGETHER_SINCE = '2026-06-30'

export interface Together {
  days: number
  months: number
  /** Days left over after whole months. */
  extraDays: number
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate() // m is 1-based here
}

/** How long we've been together, counted in Eastern calendar days. */
export function together(now: Date): Together {
  const days = easternDaysSince(TOGETHER_SINCE, now)
  const [sy, sm, sd] = TOGETHER_SINCE.split('-').map(Number)
  const [ty, tm, td] = easternToday(now).split('-').map(Number)

  let months = (ty - sy) * 12 + (tm - sm)
  // A month counts once its day has been reached (the 30th → the last day of a shorter month).
  if (td < Math.min(sd, daysInMonth(ty, tm))) months -= 1
  months = Math.max(0, months)

  const anchorY = sy + Math.floor((sm - 1 + months) / 12)
  const anchorM = ((sm - 1 + months) % 12) + 1
  const anchor = `${anchorY}-${String(anchorM).padStart(2, '0')}-${String(Math.min(sd, daysInMonth(anchorY, anchorM))).padStart(2, '0')}`
  const extraDays = Math.max(0, easternDaysSince(anchor, now))

  return { days: Math.max(0, days), months, extraDays }
}

/** Whole years from TOGETHER_SINCE to `isoDate` (e.g. 2027-06-30 → 1). Used for the anniversary candle. */
export function yearsTogetherOn(isoDate: string): number {
  const [sy, sm, sd] = TOGETHER_SINCE.split('-').map(Number)
  const [y, m, d] = isoDate.split('-').map(Number)
  const years = y - sy - (m < sm || (m === sm && d < sd) ? 1 : 0)
  return Math.max(1, years)
}
