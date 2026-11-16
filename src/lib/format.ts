// Format the calendar date itself (no time zone shifting): "2026-12-25" is always 25 December.
const longDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

/** "2026-12-25" → "25 December 2026" */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  return longDate.format(Date.UTC(y, m - 1, d))
}

/** Friendly countdown from daysUntil(): null → TBD. */
export function countdownLabel(days: number | null): string {
  if (days === null) return 'Date to be revealed'
  if (days === 0) return 'Opens today'
  if (days === 1) return 'Opens tomorrow'
  return `${days} days to go`
}
