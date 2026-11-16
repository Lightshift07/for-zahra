import { useEffect, useState } from 'react'

/**
 * The current time, re-read every minute and whenever the app comes back to the
 * foreground — so a letter unlocks at midnight even if the app was left open.
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
  return now
}
