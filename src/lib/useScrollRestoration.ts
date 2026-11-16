import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/**
 * Scroll behaviour between pages (replaces react-router's data-router-only
 * <ScrollRestoration />, which cost ~18 KB):
 *   - going to a new page (tap a card / tab) → start at the top
 *   - going back (Back button, swipe back)   → return to where she was
 * Positions are kept per history entry, also across an automatic-update reload.
 */
const KEY = 'for-zahra:scroll'
let positions: Record<string, number> = {}
try {
  positions = JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Record<string, number>
} catch {
  positions = {}
}

function persist() {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(positions))
  } catch {
    // storage unavailable — positions still work for this visit
  }
}

export function useScrollRestoration() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  }, [])

  // Remember this page's position while she scrolls.
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        positions[location.key] = window.scrollY
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', persist)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', persist)
      persist()
    }
  }, [location.key])

  // Restore (back/forward) or reset (new page) before the new page paints.
  useLayoutEffect(() => {
    const saved = positions[location.key]
    window.scrollTo(0, navigationType === 'POP' && saved !== undefined ? saved : 0)
  }, [location.key, navigationType])
}
