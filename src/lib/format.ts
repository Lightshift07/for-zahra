import { unlockMoment } from '../content'

const longDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/** "2026-12-25" → "25 December 2026" */
export function formatDate(isoDate: string): string {
  return longDate.format(unlockMoment(isoDate))
}

/** Friendly countdown from daysUntil(): null → TBD. */
export function countdownLabel(days: number | null): string {
  if (days === null) return 'Date to be revealed'
  if (days === 0) return 'Opens today'
  if (days === 1) return 'Opens tomorrow'
  return `${days} days to go`
}
