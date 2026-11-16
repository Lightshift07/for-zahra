import type { ReactNode } from 'react'
import './PageHeader.css'

interface Props {
  title: string
  /** Small line above the title. It's part of the <h1>, so screen readers hear the whole phrase. */
  kicker?: string
  /** Handwritten line underneath. */
  intro?: ReactNode
}

/** The one <h1> for a page. */
export default function PageHeader({ title, kicker, intro }: Props) {
  return (
    <header className="page-header">
      <h1 className="page-header__title">
        {kicker && <span className="page-header__kicker">{kicker} </span>}
        {title}
      </h1>
      {intro && <p className="page-header__intro">{intro}</p>}
    </header>
  )
}
