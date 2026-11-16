import { useState, type CSSProperties } from 'react'
import type { Theme } from '../../content'
import { HeartIcon } from '../Icons'
import './ThemeEffects.css'

/*
 * Full-screen themed effects for an OPEN letter (never shown on cards, the home
 * page or a sealed envelope). Purely decorative: aria-hidden, pointer-events: none,
 * and LetterPage doesn't render them at all under prefers-reduced-motion.
 *   christmas  → snow falling (continuous; she can stop it)
 *   valentines → hearts floating up (continuous; she can stop it)
 *   new-year   → a fireworks show (~5s; she can light it again)
 *   birthday   → curly streamers + confetti fluttering down (continuous; she can stop it)
 */

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]
type Vars = CSSProperties & Record<`--${string}`, string | number>

function Snowfall() {
  const [flakes] = useState(() =>
    Array.from({ length: 60 }, () => ({
      left: rand(0, 100),
      size: rand(5, 13),
      fall: rand(7, 14),
      // some flakes are already mid-fall when the letter opens, the rest drift in
      delay: rand(-5, 6),
      sway: rand(10, 30),
      swayTime: rand(2.5, 5),
      opacity: rand(0.7, 1),
    })),
  )
  return (
    <>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="fx-snow"
          style={{ left: `${f.left}%`, '--fall': `${f.fall}s`, animationDelay: `${f.delay}s` } as Vars}
        >
          <span
            className="fx-snow__flake"
            style={{ width: f.size, height: f.size, opacity: f.opacity, '--sway': `${f.sway}px`, '--sway-time': `${f.swayTime}s` } as Vars}
          />
        </span>
      ))}
    </>
  )
}

function FloatingHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 26 }, () => ({
      left: rand(2, 94),
      size: Math.round(rand(16, 36)),
      rise: rand(8, 14),
      delay: rand(-5, 6),
      sway: rand(12, 34),
      tone: pick(['a', 'b', 'c'] as const),
    })),
  )
  return (
    <>
      {hearts.map((h, i) => (
        <span
          key={i}
          className={`fx-heart fx-heart--${h.tone}`}
          style={{ left: `${h.left}%`, '--rise': `${h.rise}s`, '--sway': `${h.sway}px`, animationDelay: `${h.delay}s` } as Vars}
        >
          <HeartIcon size={h.size} />
        </span>
      ))}
    </>
  )
}

const SPARKS = 18

function Fireworks() {
  const [bursts] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      x: rand(12, 88),
      y: rand(10, 50),
      delay: i * 0.42 + rand(0, 0.25),
      radius: rand(75, 125),
      tone: pick(['a', 'b', 'c', 'd'] as const),
    })),
  )
  return (
    <>
      {bursts.map((b, i) => (
        <span
          key={i}
          className={`fx-firework fx-firework--${b.tone}`}
          style={{ left: `${b.x}%`, top: `${b.y}%`, '--delay': `${b.delay}s`, '--climb': `${100 - b.y}vh`, '--r': `${b.radius}px` } as Vars}
        >
          <span className="fx-firework__rocket" />
          <span className="fx-firework__flash" />
          {Array.from({ length: SPARKS }, (_, k) => (
            <span key={k} className="fx-firework__spark" style={{ '--a': `${(360 / SPARKS) * k}deg` } as Vars} />
          ))}
        </span>
      ))}
    </>
  )
}

function Streamers() {
  const [pieces] = useState(() =>
    Array.from({ length: 48 }, (_, i) => ({
      kind: i % 3 === 0 ? 'confetti' : 'streamer',
      left: rand(0, 100),
      fall: rand(6, 11),
      delay: rand(-5, 5),
      sway: rand(10, 28),
      spin: rand(1.2, 3),
      scale: rand(0.8, 1.35),
      tone: pick(['a', 'b', 'c', 'd'] as const),
    })),
  )
  return (
    <>
      {pieces.map((p, i) => (
        <span
          key={i}
          className={`fx-streamer fx-streamer--${p.tone}`}
          style={{ left: `${p.left}%`, '--fall': `${p.fall}s`, animationDelay: `${p.delay}s` } as Vars}
        >
          <span className="fx-streamer__sway" style={{ '--sway': `${p.sway}px`, '--sway-time': `${p.spin * 1.6}s` } as Vars}>
            {p.kind === 'streamer' ? (
              <svg
                className="fx-streamer__piece"
                viewBox="0 0 12 40"
                style={{ '--spin': `${p.spin}s`, width: 12 * p.scale, height: 40 * p.scale } as Vars}
              >
                <path d="M6 2 Q11 7 6 12 T6 22 T6 32 T6 38" />
              </svg>
            ) : (
              <span className="fx-confetti" style={{ '--spin': `${p.spin}s`, width: 9 * p.scale, height: 6 * p.scale } as Vars} />
            )}
          </span>
        </span>
      ))}
    </>
  )
}

/** `run` changes → fireworks restart. `active` false → continuous effects stop. */
export default function ThemeEffects({ theme, active, run }: { theme: Theme; active: boolean; run: number }) {
  if (!active) return null
  return (
    <div className={`fx fx--${theme}`} aria-hidden="true">
      {theme === 'christmas' && <Snowfall />}
      {theme === 'valentines' && <FloatingHearts />}
      {theme === 'new-year' && <Fireworks key={run} />}
      {theme === 'birthday' && <Streamers />}
    </div>
  )
}
