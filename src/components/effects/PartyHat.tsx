import './PartyHat.css'

/** A striped party hat perched on the top corner of a birthday letter. Decorative. */
export default function PartyHat() {
  return (
    <svg className="party-hat" viewBox="0 0 64 80" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="party-hat-cone">
          <path d="M32 8 L56 70 Q32 78 8 70 Z" />
        </clipPath>
      </defs>
      {/* cone */}
      <path className="party-hat__cone" d="M32 8 L56 70 Q32 78 8 70 Z" />
      {/* diagonal stripes, clipped to the cone */}
      <g clipPath="url(#party-hat-cone)">
        <path className="party-hat__stripe" d="M0 34 L64 18 L64 26 L0 42 Z" />
        <path className="party-hat__stripe" d="M0 52 L64 36 L64 44 L0 60 Z" />
        <path className="party-hat__stripe" d="M0 70 L64 54 L64 62 L0 78 Z" />
      </g>
      {/* dots */}
      <circle className="party-hat__dot" cx="27" cy="31" r="2" />
      <circle className="party-hat__dot" cx="38" cy="47" r="2" />
      <circle className="party-hat__dot" cx="22" cy="58" r="2" />
      {/* brim */}
      <path className="party-hat__brim" d="M8 70 Q32 78 56 70 L56 73 Q32 82 8 73 Z" />
      {/* pom-pom */}
      <circle className="party-hat__pom" cx="32" cy="7" r="6.5" />
      <path className="party-hat__pom-line" d="M26 4 L38 10 M26 10 L38 4 M32 0.5 L32 13.5" />
    </svg>
  )
}
