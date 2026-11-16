import { daysUntil, isUnlocked, onLetters, whenLetters } from '../content'
import './Home.css'

/** Placeholder home route — proves content loads. Real UI comes later. */
export default function Home() {
  return (
    <main className="home">
      <h1 className="home__title">For Zahra</h1>
      <p className="home__note">Placeholder — the real pages are coming soon.</p>

      <section aria-labelledby="when-h">
        <h2 id="when-h">Open When… ({whenLetters.length})</h2>
        <ul>
          {whenLetters.map((l) => (
            <li key={l.id}>
              <strong>{l.title}</strong> — {l.teaser}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="on-h">
        <h2 id="on-h">Open On… ({onLetters.length})</h2>
        <ul>
          {onLetters.map((l) => {
            const days = daysUntil(l)
            const status = isUnlocked(l)
              ? 'open'
              : days === null
                ? 'date to be revealed'
                : `locked · ${days} day${days === 1 ? '' : 's'} to go`
            return (
              <li key={l.id}>
                <strong>{l.title}</strong> — {l.teaser} <em>({status})</em>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
