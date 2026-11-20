import type { CSSProperties } from 'react'
import { HeartIcon, LockIcon } from './Icons'
import WaxSeal from './WaxSeal'
import './Envelope.css'

export type EnvelopeState = 'sealed' | 'opening' | 'locked'

/* Small hearts that float up when the envelope opens: [x offset, delay factor, size]. */
const HEARTS: [number, number, number][] = [
  [-70, 0, 22],
  [-30, 0.07, 16],
  [6, 0.02, 26],
  [40, 0.1, 18],
  [78, 0.05, 22],
  [-95, 0.12, 14],
  [100, 0.14, 15],
]

/**
 * Purely visual envelope (aria-hidden). The interactive wrapper and all text
 * alternatives live in LetterPage. The opening choreography is CSS-driven by
 * the `envelope--opening` class and scaled by --envelope-duration.
 */
export default function Envelope({ state, label = 'For you' }: { state: EnvelopeState; label?: string }) {
  return (
    <div className={`envelope envelope--${state}`} aria-hidden="true">
      <div className="envelope__body">
        <div className="envelope__back" />
        <div className="envelope__pocket" />
      </div>
      <div className="envelope__paper">
        <span className="envelope__paper-text">{label}</span>
        <span className="envelope__paper-line" />
        <span className="envelope__paper-line" />
        <span className="envelope__paper-line envelope__paper-line--short" />
      </div>
      <svg className="envelope__flap" viewBox="0 0 100 60" preserveAspectRatio="none">
        <path d="M0 7 Q0 0 7 0 L93 0 Q100 0 100 7 L55 55 Q50 60 45 55 Z" />
      </svg>
      <span className={`envelope__seal${state === 'locked' ? ' envelope__seal--locked' : ''}`}>
        {state === 'locked' ? <LockIcon size={20} /> : <WaxSeal />}
      </span>
      {state === 'opening' && (
        <div className="envelope__hearts">
          {HEARTS.map(([x, d, size], i) => (
            <span key={i} className="envelope__heart" style={{ '--x': `${x}px`, '--d': d } as CSSProperties}>
              <HeartIcon size={size} />
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
