import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import Envelope from '../components/Envelope'
import { ArrowLeftIcon, HeartIcon } from '../components/Icons'
import { daysUntil, getLetter, isUnlocked, mediaUrl, renderBody, type Letter } from '../content'
import { countdownLabel, formatDate } from '../lib/format'
import { envelopeDurationMs } from '../lib/motion'
import { markOpened, useOpened } from '../lib/opened'
import { useNow } from '../lib/useNow'
import { usePageTitle } from '../lib/usePageTitle'
import NotFound from './NotFound'
import './LetterPage.css'

/*
 * Letter route. An unlocked letter goes through three stages:
 *   sealed  → envelope + "Tap to open" (first time she opens this letter)
 *   opening → the envelope animation plays (also auto-plays on re-reads)
 *   open    → the full letter; focus moves to its heading
 * Locked "Open On" letters show a closed envelope with a lock seal instead.
 */
type Stage = 'sealed' | 'opening' | 'open'

/** Fraction of --envelope-duration at which the full letter replaces the envelope (matches Envelope.css). */
const LETTER_SWAP = 0.92

export default function LetterPage() {
  const { id = '' } = useParams()
  const letter = getLetter(id)
  // key={id} → the stage resets when moving between letters
  return letter ? <LetterView key={id} letter={letter} /> : <NotFound />
}

function LetterView({ letter }: { letter: Letter }) {
  const now = useNow()
  const navigate = useNavigate()
  const location = useLocation()
  const opened = useOpened()
  const unlocked = letter.section === 'when' || isUnlocked(letter, now)
  const [stage, setStage] = useState<Stage>(() => (opened.has(letter.id) ? 'opening' : 'sealed'))
  const headingRef = useRef<HTMLHeadingElement>(null)

  usePageTitle(letter.title)

  useEffect(() => {
    if (!unlocked || stage !== 'opening') return
    const t = window.setTimeout(() => setStage('open'), envelopeDurationMs() * LETTER_SWAP)
    return () => window.clearTimeout(t)
  }, [stage, unlocked])

  useEffect(() => {
    if (stage !== 'open') return
    markOpened(letter.id)
    const h = headingRef.current
    if (h) {
      h.setAttribute('tabindex', '-1')
      h.focus({ preventScroll: true })
    }
  }, [stage, letter.id])

  const sectionPath = letter.section === 'when' ? '/open-when' : '/open-on'
  const sectionName = letter.section === 'when' ? 'Open When' : 'Open On'
  const date = letter.section === 'on' && letter.unlockDate ? formatDate(letter.unlockDate) : null
  const kicker = date ?? sectionName

  // Real "back" when we navigated here inside the app (keeps scroll position);
  // otherwise (opened from a link/bookmark) fall back to the section list.
  const goBack = (e: MouseEvent) => {
    if (location.key !== 'default') {
      e.preventDefault()
      navigate(-1)
    }
  }
  const back = (
    <Link to={sectionPath} onClick={goBack} className="letter__back">
      <ArrowLeftIcon size={20} />
      Back
    </Link>
  )

  if (!unlocked && letter.section === 'on') {
    return (
      <main className="letter">
        {back}
        <div className="letter__locked">
          <Envelope state="locked" label="Soon…" />
          <h1 className="letter__title">{letter.title}</h1>
          <p>{date ? `This letter opens on ${date}.` : "This letter's date is still a secret."}</p>
          {date && <p className="letter__countdown">{countdownLabel(daysUntil(letter, now))}</p>}
          <p className="letter__note">Not yet, my love. It'll be worth the wait.</p>
        </div>
      </main>
    )
  }

  if (stage !== 'open') {
    return (
      <main className="letter">
        {back}
        <div className={`letter__stage letter__stage--${stage}`}>
          <div className="letter__stage-head">
            <p className="letter__kicker">{kicker}</p>
            <h1 className="letter__title">{letter.title}</h1>
          </div>
          {stage === 'sealed' ? (
            <button type="button" className="letter__envelope-btn" onClick={() => setStage('opening')}>
              <Envelope state="sealed" />
              <span className="letter__hint">Tap to open</span>
            </button>
          ) : (
            <div className="letter__envelope-btn" role="status">
              <Envelope state="opening" />
              <span className="visually-hidden">Opening your letter…</span>
            </div>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="letter">
      {back}
      <article className="letter__paper" aria-labelledby="letter-title">
        <span className="letter__seal">
          <HeartIcon size={22} />
        </span>
        <p className="letter__kicker">{kicker}</p>
        <h1 id="letter-title" ref={headingRef} className="letter__title">
          {letter.title}
        </h1>

        {/* Trusted, build-time-rendered Markdown (see CLAUDE.md §9). */}
        <div className="letter__body" dangerouslySetInnerHTML={{ __html: renderBody(letter) }} />

        {letter.photos.length > 0 && (
          <div className="letter__photos">
            {letter.photos.map((p) => (
              <figure key={p.file} className="letter__photo">
                <img
                  src={mediaUrl(p.file)}
                  alt={p.alt ?? `Photo from: ${letter.title}`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        )}

        {letter.voiceNote && (
          <section className="letter__voice" aria-labelledby="voice-title">
            <h2 id="voice-title" className="letter__voice-title">
              A voice note for you
            </h2>
            <audio
              controls
              preload="none"
              src={mediaUrl(letter.voiceNote)}
              aria-label={`Voice note: ${letter.title}`}
            >
              Your browser can't play this voice note.
            </audio>
          </section>
        )}
      </article>

      <p className="letter__footer">
        <Link to={sectionPath}>All {sectionName} letters</Link>
      </p>
    </main>
  )
}
