import { useId, useState } from 'react'
import { Link } from 'react-router'
import { daysUntil, isUnlocked, type Letter } from '../content'
import { countdownLabel, formatDate } from '../lib/format'
import { HeartIcon, LockIcon } from './Icons'
import './LetterCard.css'

interface Props {
  letter: Letter
  now: Date
  opened: boolean
  tone?: 'blush' | 'lavender'
}

/**
 * One card in a letter list. Open letters are links; locked "Open On" letters
 * are focusable buttons (aria-disabled) that answer a tap with a gentle "not yet".
 * A locked card never shows any of the letter's content beyond title + teaser.
 */
export default function LetterCard({ letter, now, opened, tone = 'blush' }: Props) {
  const isOn = letter.section === 'on'
  const unlocked = !isOn || isUnlocked(letter, now)
  const days = isOn ? daysUntil(letter, now) : null
  const dateText = isOn && letter.unlockDate ? formatDate(letter.unlockDate) : null
  const isNew = isOn && unlocked && !opened

  const nudgeId = useId()
  const [nudge, setNudge] = useState('')
  const [wiggle, setWiggle] = useState(false)

  if (!unlocked) {
    const lockText = dateText ? `Locked until ${dateText}` : 'Date to be revealed'
    return (
      <div className="card-wrap">
        <button
          type="button"
          className={`card card--locked${wiggle ? ' is-wiggling' : ''}`}
          aria-disabled="true"
          aria-describedby={nudgeId}
          onClick={() => {
            setWiggle(true)
            setNudge(
              dateText
                ? `Not yet, my love. This one opens on ${dateText}. ${countdownLabel(days)}.`
                : `Not yet, my love. I'll tell you when this one is ready.`,
            )
          }}
          onAnimationEnd={() => setWiggle(false)}
        >
          <span className="card__seal card__seal--locked">
            <LockIcon size={20} />
          </span>
          <span className="card__body">
            <span className="card__title">{letter.title}</span>
            <span className="card__teaser">{letter.teaser}</span>
            <span className="card__meta">
              <span className="visually-hidden">{lockText}. </span>
              <span aria-hidden="true">{dateText ?? 'Date to be revealed'}</span>
              {dateText && <span className="card__pill">{countdownLabel(days)}</span>}
            </span>
          </span>
        </button>
        <p id={nudgeId} className="card__nudge" aria-live="polite">
          {nudge}
        </p>
      </div>
    )
  }

  return (
    <div className="card-wrap">
      <Link to={`/letter/${letter.id}`} className={`card card--${tone}`}>
        <span className="card__seal">
          <HeartIcon size={20} />
        </span>
        <span className="card__body">
          <span className="card__title">{letter.title}</span>
          <span className="card__teaser">{letter.teaser}</span>
          {(dateText || isNew) && (
            <span className="card__meta">
              {dateText && <span>{dateText}</span>}
              {isNew && <span className="card__pill card__pill--new">New</span>}
            </span>
          )}
        </span>
      </Link>
    </div>
  )
}
