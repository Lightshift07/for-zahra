import { useId } from 'react'
import './AnniversaryCandle.css'

/**
 * A striped number candle (the years together) perched on the corner of an
 * anniversary letter, with a flickering flame. Decorative. The flame holds
 * still under reduced motion.
 */
export default function AnniversaryCandle({ years }: { years: number }) {
  const id = useId().replace(/:/g, '')
  const label = String(years)
  // Wider viewBox for two-digit numbers, so the candle never clips.
  const width = label.length > 1 ? 100 : 64
  return (
    <svg className="candle" viewBox={`0 0 ${width} 120`} style={{ width: `${(width / 64) * 4.25}rem` }} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${id}-stripes`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="10" height="10" className="candle__stripe-a" />
          <rect width="5" height="10" className="candle__stripe-b" />
        </pattern>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0%" className="candle__glow-in" />
          <stop offset="100%" className="candle__glow-out" />
        </radialGradient>
      </defs>

      {/* soft glow behind the flame */}
      <circle className="candle__glow" cx={width / 2} cy="22" r="22" fill={`url(#${id}-glow)`} />

      {/* wick */}
      <path className="candle__wick" d={`M${width / 2} 36 L${width / 2} 60`} />

      {/* flame: outer + inner, flickering independently */}
      <g className="candle__flame" style={{ transformOrigin: `${width / 2}px 38px` }}>
        <path className="candle__flame-outer" d={`M${width / 2} 6 C${width / 2 + 9} 18 ${width / 2 + 10} 28 ${width / 2} 38 C${width / 2 - 10} 28 ${width / 2 - 9} 18 ${width / 2} 6 Z`} />
        <path
          className="candle__flame-inner"
          style={{ transformOrigin: `${width / 2}px 37px` }}
          d={`M${width / 2} 18 C${width / 2 + 5} 25 ${width / 2 + 5} 31 ${width / 2} 37 C${width / 2 - 5} 31 ${width / 2 - 5} 25 ${width / 2} 18 Z`}
        />
      </g>

      {/* the number itself */}
      <text className="candle__number" x={width / 2} y="114" textAnchor="middle" fill={`url(#${id}-stripes)`}>
        {label}
      </text>
    </svg>
  )
}
