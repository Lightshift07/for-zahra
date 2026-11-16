import type { ReactNode } from 'react'
import './PageHeader.css'

/** The one <h1> for a page, with an optional handwritten line underneath. */
export default function PageHeader({ title, intro }: { title: string; intro?: ReactNode }) {
  return (
    <header className="page-header">
      <h1 className="page-header__title">{title}</h1>
      {intro && <p className="page-header__intro">{intro}</p>}
    </header>
  )
}
