import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useMatch } from 'react-router'
import TabBar from '../components/TabBar'
import { UNLOCK_ALL } from '../content'
import { useAutoUpdate } from '../lib/autoUpdate'
import { useScrollRestoration } from '../lib/useScrollRestoration'
import './AppShell.css'

/**
 * Wraps every route: restores scroll position on back/forward, moves focus to
 * the new page's <h1> after navigation (so screen readers announce it), and
 * shows the tab bar everywhere except inside a letter.
 */
export default function AppShell() {
  const { pathname } = useLocation()
  const inLetter = useMatch('/letter/:id') !== null
  const firstRender = useRef(true)
  useAutoUpdate(inLetter)
  useScrollRestoration()

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const h1 = document.querySelector<HTMLElement>('main h1')
    if (h1) {
      h1.setAttribute('tabindex', '-1')
      h1.focus({ preventScroll: true })
    }
  }, [pathname])

  return (
    <>
      {UNLOCK_ALL && <p className="preview-flag">Preview mode · all letters unlocked</p>}
      <Outlet />
      {!inLetter && <TabBar />}
    </>
  )
}
