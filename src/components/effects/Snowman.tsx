import './Snowman.css'

/** A little snowman perched on the top corner of a Christmas letter. Decorative. */
export default function Snowman() {
  return (
    <svg className="snowman" viewBox="0 0 64 84" aria-hidden="true" focusable="false">
      {/* body */}
      <circle className="snowman__snow" cx="32" cy="62" r="20" />
      <circle className="snowman__snow" cx="32" cy="33" r="14" />
      {/* scarf */}
      <path className="snowman__scarf" d="M19 42 Q32 49 45 42 L45 47 Q32 54 19 47 Z" />
      <path className="snowman__scarf" d="M38 46 L43 60 L37 61 L34 48 Z" />
      {/* hat */}
      <rect className="snowman__hat" x="20" y="18" width="24" height="4" rx="2" />
      <rect className="snowman__hat" x="24" y="4" width="16" height="16" rx="3" />
      <rect className="snowman__band" x="24" y="14" width="16" height="3" />
      {/* face */}
      <circle className="snowman__coal" cx="27" cy="30" r="1.8" />
      <circle className="snowman__coal" cx="37" cy="30" r="1.8" />
      <path className="snowman__nose" d="M32 33 L42 35.5 L32 37 Z" />
      <path className="snowman__smile" d="M27 39 Q32 42 37 39" />
      {/* buttons */}
      <circle className="snowman__coal" cx="32" cy="57" r="1.8" />
      <circle className="snowman__coal" cx="32" cy="65" r="1.8" />
      <circle className="snowman__coal" cx="32" cy="73" r="1.8" />
    </svg>
  )
}
