import './Crown.css'

/** A little gold crown perched on the top corner of a Girlfriend Day letter. Decorative. */
export default function Crown() {
  return (
    <svg className="crown" viewBox="0 0 72 56" aria-hidden="true" focusable="false">
      {/* points */}
      <path className="crown__body" d="M6 44 L4 14 L20 28 L36 6 L52 28 L68 14 L66 44 Z" />
      {/* inner shading */}
      <path className="crown__shade" d="M36 6 L44 22 L36 34 L28 22 Z" />
      {/* band */}
      <rect className="crown__band" x="5" y="40" width="62" height="11" rx="3" />
      {/* gems on the band */}
      <circle className="crown__gem crown__gem--rose" cx="20" cy="45.5" r="3" />
      <circle className="crown__gem crown__gem--mauve" cx="36" cy="45.5" r="3.6" />
      <circle className="crown__gem crown__gem--rose" cx="52" cy="45.5" r="3" />
      {/* pearls on the tips */}
      <circle className="crown__pearl" cx="4" cy="13" r="3.2" />
      <circle className="crown__pearl" cx="36" cy="5" r="3.6" />
      <circle className="crown__pearl" cx="68" cy="13" r="3.2" />
      {/* tiny glints */}
      <path className="crown__glint" d="M58 32 l1.2 3 l3 1.2 l-3 1.2 l-1.2 3 l-1.2 -3 l-3 -1.2 l3 -1.2 Z" />
    </svg>
  )
}
