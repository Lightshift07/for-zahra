import './PartyGarland.css'

/**
 * Streamers draped across the top edge of a birthday letter. Two ribbon swags
 * either side of the heart seal, plus little dangling curls. Decorative.
 */
export default function PartyGarland() {
  return (
    <svg className="party-garland" viewBox="0 0 300 48" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="party-garland__ribbon party-garland__ribbon--a" d="M4 4 Q38 40 72 6 Q104 38 128 8" />
      <path className="party-garland__ribbon party-garland__ribbon--b" d="M4 10 Q38 46 72 12 Q104 44 128 14" />
      <path className="party-garland__ribbon party-garland__ribbon--a" d="M172 8 Q196 38 228 6 Q262 40 296 4" />
      <path className="party-garland__ribbon party-garland__ribbon--b" d="M172 14 Q196 44 228 12 Q262 46 296 10" />
      <path className="party-garland__curl party-garland__curl--c" d="M72 8 q4 6 0 11 t0 11 t0 9" />
      <path className="party-garland__curl party-garland__curl--d" d="M228 8 q-4 6 0 11 t0 11 t0 9" />
    </svg>
  )
}
