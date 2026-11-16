import LetterCard from '../components/LetterCard'
import PageHeader from '../components/PageHeader'
import PickForMe from '../components/PickForMe'
import { whenLetters } from '../content'
import { useNow } from '../lib/useNow'
import { useOpened } from '../lib/opened'
import { usePageTitle } from '../lib/usePageTitle'

export default function OpenWhen() {
  usePageTitle('Open When')
  const now = useNow()
  const opened = useOpened()
  return (
    <main className="page">
      <PageHeader title="Open when…" intro="Whenever you need me. These are always open." />
      <PickForMe letters={whenLetters} />
      <ul className="card-list">
        {whenLetters.map((l, i) => (
          <li key={l.id}>
            <LetterCard letter={l} now={now} opened={opened.has(l.id)} tone={i % 2 ? 'lavender' : 'blush'} />
          </li>
        ))}
      </ul>
    </main>
  )
}
