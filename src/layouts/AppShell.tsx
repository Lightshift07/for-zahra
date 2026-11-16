import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation, useMatch } from 'react-router'
import TabBar from '../components/TabBar'

/**
 * Wraps every route: restores scroll position on back/forward, moves focus to
 * the new page's <h1> after navigation (so screen readers announce it), and
 * shows the tab bar everywhere except inside a letter.
 */
export default function AppShell() {
  const { pathname } = useLocation()
  const inLetter = useMatch('/letter/:id') !== null
  const firstRender = useRef(true)

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
      <Outlet />
      {!inLetter && <TabBar />}
      <ScrollRestoration />
    </>
  )
}
