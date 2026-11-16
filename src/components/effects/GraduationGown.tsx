import './GraduationGown.css'

/**
 * A little graduation gown (with gold stole and diploma) wearing a mortarboard,
 * perched on the corner of a graduation letter. Decorative. The tassel sways
 * gently unless reduced motion is on.
 */
export default function GraduationGown() {
  return (
    <svg className="grad" viewBox="0 0 72 96" aria-hidden="true" focusable="false">
      {/* gown: shoulders, sleeves and flared robe */}
      <path className="grad__gown" d="M36 34 L20 38 Q12 41 9 52 L5 74 L15 76 L18 60 L16 92 L56 92 L54 60 L57 76 L67 74 L63 52 Q60 41 52 38 Z" />
      {/* sleeve folds */}
      <path className="grad__fold" d="M18 60 L20 50 M54 60 L52 50 M30 92 L31 62 M42 92 L41 62" />
      {/* gold stole */}
      <path className="grad__stole" d="M30 36 L33 36 L33 78 L28 82 Z" />
      <path className="grad__stole" d="M42 36 L39 36 L39 78 L44 82 Z" />
      {/* V neck / collar */}
      <path className="grad__collar" d="M30 35 L36 46 L42 35 Q36 32 30 35 Z" />
      {/* diploma scroll with a ribbon, tucked in one sleeve */}
      <g className="grad__diploma">
        <rect x="48" y="68" width="20" height="7" rx="3.5" />
        <path className="grad__ribbon" d="M57 67 L57 76 M57 76 L54 80 M57 76 L60 80" />
      </g>
      {/* mortarboard: cap + board */}
      <path className="grad__cap" d="M26 22 L26 30 Q36 35 46 30 L46 22 Z" />
      <path className="grad__board" d="M36 8 L66 18 L36 28 L6 18 Z" />
      <circle className="grad__button" cx="36" cy="18" r="2" />
      {/* tassel */}
      <g className="grad__tassel">
        <path className="grad__cord" d="M36 18 L58 21 L58 34" />
        <path className="grad__fringe" d="M55 33 L61 33 L62 41 L54 41 Z" />
      </g>
    </svg>
  )
}
