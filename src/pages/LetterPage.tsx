import { useEffect, type MouseEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { ArrowLeftIcon, HeartIcon, LockIcon } from '../components/Icons'
import { daysUntil, getLetter, isUnlocked, mediaUrl, renderBody } from '../content'
import { countdownLabel, formatDate } from '../lib/format'
import { markOpened } from '../lib/opened'
import { useNow } from '../lib/useNow'
import { usePageTitle } from '../lib/usePageTitle'
import NotFound from './NotFound'
import './LetterPage.css'

export default function LetterPage() {
  const { id = '' } = useParams()
  const letter = getLetter(id)
  const now = useNow()
  const navigate = useNavigate()
  const location = useLocation()
  const unlocked = letter ? letter.section === 'when' || isUnlocked(letter, now) : false

  usePageTitle(letter?.title)
  useEffect(() => {
    if (letter && unlocked) markOpened(letter.id)
  }, [letter, unlocked])

  if (!letter) return <NotFound />

  const sectionPath = letter.section === 'when' ? '/open-when' : '/open-on'
  const sectionName = letter.section === 'when' ? 'Open When' : 'Open On'
  const date = letter.section === 'on' && letter.unlockDate ? formatDate(letter.unlockDate) : null

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
          <span className="letter__locked-icon">
            <LockIcon size={32} />
          </span>
          <h1 className="letter__title">{letter.title}</h1>
          <p>{date ? `This letter opens on ${date}.` : "This letter's date is still a secret."}</p>
          {date && <p className="letter__countdown">{countdownLabel(daysUntil(letter, now))}</p>}
          <p className="letter__note">Not yet, my love. It'll be worth the wait.</p>
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
        <p className="letter__kicker">{date ?? sectionName}</p>
        <h1 id="letter-title" className="letter__title">
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
