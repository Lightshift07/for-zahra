import LetterCard from '../components/LetterCard'
import PageHeader from '../components/PageHeader'
import { isUnlocked, onLetters } from '../content'
import { useNow } from '../lib/useNow'
import { useOpened } from '../lib/opened'
import { usePageTitle } from '../lib/usePageTitle'

export default function OpenOn() {
  usePageTitle('Open On')
  const now = useNow()
  const opened = useOpened()
  const openCount = onLetters.filter((l) => isUnlocked(l, now)).length
  return (
    <main className="page">
      <PageHeader title="Open on…" intro="Each one unlocks on its special day. No peeking!" />
      <p className="visually-hidden">
        {openCount} of {onLetters.length} letters are open.
      </p>
      <ul className="card-list">
        {onLetters.map((l) => (
          <li key={l.id}>
            <LetterCard letter={l} now={now} opened={opened.has(l.id)} />
          </li>
        ))}
      </ul>
    </main>
  )
}
