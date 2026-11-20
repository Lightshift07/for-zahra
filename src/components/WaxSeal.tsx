import { SEAL_INITIALS } from '../lib/personal'
import './WaxSeal.css'

/*
 * A melted-wax seal pressed with our initials ("A & Z"). Decorative (aria-hidden):
 * used on the sealed envelope and at the top of an open letter.
 * Wavy edge = 12 soft bumps around a circle, like wax squeezed out under the stamp.
 */
const EDGE = (() => {
  const points = 48
  let d = ''
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2
    const r = 28 + Math.sin(a * 12) * 1.3 + Math.sin(a * 5 + 1) * 0.6
    const x = (30 + Math.cos(a) * r).toFixed(2)
    const y = (30 + Math.sin(a) * r).toFixed(2)
    d += `${i === 0 ? 'M' : 'L'}${x} ${y} `
  }
  return d + 'Z'
})()

export default function WaxSeal({ className = '' }: { className?: string }) {
  return (
    <svg className={`wax-seal ${className}`} viewBox="0 0 60 60" aria-hidden="true" focusable="false">
      <path className="wax-seal__wax" d={EDGE} />
      <circle className="wax-seal__ring" cx="30" cy="30" r="21" />
      <circle className="wax-seal__shine" cx="21" cy="19" r="5" />
      <text className="wax-seal__initials" x="30" y="30" textAnchor="middle" dominantBaseline="central">
        {SEAL_INITIALS.mine}
        <tspan className="wax-seal__amp">&amp;</tspan>
        {SEAL_INITIALS.hers}
      </text>
    </svg>
  )
}
