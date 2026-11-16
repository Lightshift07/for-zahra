import { useEffect, useState } from 'react'
import { msUntilEasternMidnight } from '../content'

/**
 * The current time, kept live so countdowns and unlocks change on their own:
 *   - exactly at 12:00am Eastern (a timer aimed at the next Eastern midnight),
 *   - every minute as a safety net (phones can delay or pause timers),
 *   - whenever the app comes back to the foreground.
 * Pass the result to isUnlocked()/daysUntil(); don't call `new Date()` in components.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    const id = window.setInterval(tick, intervalMs)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [intervalMs])

  // Re-armed after every update, so it always targets the coming midnight.
  useEffect(() => {
    const t = window.setTimeout(() => setNow(new Date()), msUntilEasternMidnight(now) + 250)
    return () => window.clearTimeout(t)
  }, [now])

  return now
}
