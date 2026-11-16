/**
 * Offline + automatic updates (see vite/offline.ts for the build side).
 *
 * - registerServiceWorker(): installs sw.js, which saves the whole site for offline use.
 * - useAutoUpdate(): checks /version.json whenever the app opens, comes back to the
 *   foreground, regains signal, and every 15 minutes. If a newer version is live,
 *   the page reloads itself — but never while a letter is open: it waits until she
 *   leaves the letter (or the app goes to the background).
 * Production only; the dev server is unaffected.
 */
import { useEffect, useRef } from 'react'

const CHECK_EVERY_MS = 15 * 60_000

export function registerServiceWorker() {
  if (import.meta.env.DEV || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './', updateViaCache: 'none' })
      .catch(() => {
        // Offline support is a bonus; the site works without it.
      })
  })
}

async function newerVersionLive(): Promise<boolean> {
  try {
    const res = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return false
    const { version } = (await res.json()) as { version?: string }
    return typeof version === 'string' && version !== __APP_VERSION__
  } catch {
    return false // offline — try again later
  }
}

export function useAutoUpdate(inLetter: boolean) {
  const pending = useRef(false)
  const inLetterRef = useRef(inLetter)

  useEffect(() => {
    inLetterRef.current = inLetter
    if (pending.current && !inLetter) window.location.reload()
  }, [inLetter])

  useEffect(() => {
    if (import.meta.env.DEV) return

    const reloadIfSafe = () => {
      if (pending.current && (!inLetterRef.current || document.visibilityState === 'hidden')) {
        window.location.reload()
      }
    }
    const check = async () => {
      if (pending.current) return reloadIfSafe()
      if (await newerVersionLive()) {
        pending.current = true
        navigator.serviceWorker?.getRegistration().then((r) => r?.update()).catch(() => {})
        reloadIfSafe()
      }
    }
    const onVisibility = () => (document.visibilityState === 'visible' ? check() : reloadIfSafe())

    check()
    const id = window.setInterval(check, CHECK_EVERY_MS)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('online', check)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('online', check)
    }
  }, [])
}
