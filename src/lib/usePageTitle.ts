import { useEffect } from 'react'

const SITE = 'For Zahra'

/** Sets document.title to "<title> · For Zahra" (or just "For Zahra"). */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : SITE
  }, [title])
}
