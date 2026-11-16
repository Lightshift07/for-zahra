import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Letter } from '../content'
import { useReducedMotion } from '../lib/useReducedMotion'
import { ShuffleIcon } from './Icons'
import './PickForMe.css'

/* Gaps between title flips, in ms: fast at first, slowing down like a slot machine. */
const TICKS = [55, 55, 60, 65, 70, 80, 95, 110, 130, 155, 185, 220, 265, 320]
/** How long the chosen title stays on screen before the letter opens. */
const LANDED_MS = 1100

/** The last letter picked this visit, so two taps in a row never pick the same one. */
let lastPick: string | null = null

type Phase = 'idle' | 'shuffling' | 'landed'

/**
 * "Pick one for me": shuffles through letter titles, lands on a random one,
 * then opens it. Under reduced motion it opens the pick straight away.
 */
export default function PickForMe({ letters }: { letters: Letter[] }) {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('idle')
  const [shown, setShown] = useState<{ title: string; tick: number }>({ title: '', tick: 0 })
  const [chosen, setChosen] = useState<Letter | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  if (letters.length === 0) return null

  const start = () => {
    const pool = letters.length > 1 ? letters.filter((l) => l.id !== lastPick) : letters
    const pick = pool[Math.floor(Math.random() * pool.length)]
    lastPick = pick.id
    setChosen(pick)

    if (reducedMotion) {
      navigate(`/letter/${pick.id}`)
      return
    }

    setPhase('shuffling')
    let at = 0
    let prev = -1
    TICKS.forEach((gap, i) => {
      at += gap
      const last = i === TICKS.length - 1
      timers.current.push(
        window.setTimeout(() => {
          let idx = Math.floor(Math.random() * letters.length)
          if (letters.length > 1) while (idx === prev) idx = Math.floor(Math.random() * letters.length)
          prev = idx
          setShown({ title: last ? pick.title : letters[idx].title, tick: i + 1 })
          if (last) setPhase('landed')
        }, at),
      )
    })
    timers.current.push(window.setTimeout(() => navigate(`/letter/${pick.id}`), at + LANDED_MS))
  }

  return (
    <div className="pick">
      {phase === 'idle' ? (
        <button type="button" className="pick__btn" onClick={start}>
          <ShuffleIcon size={22} />
          Pick one for me
        </button>
      ) : (
        <div className={`pick__panel pick__panel--${phase}`} aria-hidden="true">
          <p className="pick__label">{phase === 'landed' ? "This one's for you" : 'Shuffling…'}</p>
          <p key={shown.tick} className="pick__title">
            {shown.title || '…'}
          </p>
        </div>
      )}
      <p className="visually-hidden" role="status">
        {phase === 'shuffling' ? 'Picking a letter for you…' : phase === 'landed' && chosen ? `Picked: ${chosen.title}. Opening it now.` : ''}
      </p>
    </div>
  )
}
