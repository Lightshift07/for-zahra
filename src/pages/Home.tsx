import { Link } from 'react-router'
import { CalendarIcon, EnvelopeIcon, HeartIcon } from '../components/Icons'
import PageHeader from '../components/PageHeader'
import { daysUntil, isUnlocked, onLetters, whenLetters } from '../content'
import { countdownLabel } from '../lib/format'
import { useOpened } from '../lib/opened'
import { useNow } from '../lib/useNow'
import { usePageTitle } from '../lib/usePageTitle'
import './Home.css'

function greeting(now: Date): string {
  const h = now.getHours()
  if (h < 5) return 'Hello, night owl'
  if (h < 12) return 'Good morning, my love'
  if (h < 18) return 'Good afternoon, my love'
  return 'Good evening, my love'
}

export default function Home() {
  usePageTitle()
  const now = useNow()
  const opened = useOpened()

  const openOn = onLetters.filter((l) => isUnlocked(l, now))
  const fresh = openOn.find((l) => !opened.has(l.id))
  const next = onLetters
    .filter((l) => l.unlockDate !== null && !isUnlocked(l, now))
    .sort((a, b) => (a.unlockDate! < b.unlockDate! ? -1 : 1))[0]

  return (
    <main className="page home">
      <p className="home__greeting">{greeting(now)}</p>
      <PageHeader title="For Zahra" intro="Little letters, for whenever you need them." />

      {fresh ? (
        <Link to={`/letter/${fresh.id}`} className="home__banner home__banner--new">
          <HeartIcon size={22} />
          <span>
            <strong>Something just unlocked for you</strong>
            <span className="home__banner-sub">{fresh.title}</span>
          </span>
        </Link>
      ) : (
        next && (
          <Link to="/open-on" className="home__banner">
            <CalendarIcon size={22} />
            <span>
              <strong>Next to open: {next.title.replace(/^Open (on|when) /i, '')}</strong>
              <span className="home__banner-sub">{countdownLabel(daysUntil(next, now))}</span>
            </span>
          </Link>
        )
      )}

      <ul className="home__tiles">
        <li>
          <Link to="/open-when" className="tile">
            <span className="tile__icon">
              <EnvelopeIcon size={26} />
            </span>
            <span className="tile__title">Open when…</span>
            <span className="tile__desc">For feelings and moments, whenever you need me.</span>
            <span className="tile__count">{whenLetters.length} letters · always open</span>
          </Link>
        </li>
        <li>
          <Link to="/open-on" className="tile tile--lavender">
            <span className="tile__icon">
              <CalendarIcon size={26} />
            </span>
            <span className="tile__title">Open on…</span>
            <span className="tile__desc">For special days. Each one unlocks on its date.</span>
            <span className="tile__count">
              {openOn.length} of {onLetters.length} open
            </span>
          </Link>
        </li>
      </ul>
    </main>
  )
}
