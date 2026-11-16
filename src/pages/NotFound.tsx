import { Link } from 'react-router'
import PageHeader from '../components/PageHeader'
import { usePageTitle } from '../lib/usePageTitle'

export default function NotFound() {
  usePageTitle('Not found')
  return (
    <main className="page">
      <PageHeader title="Hmm, nothing here" intro="This letter must have floated away." />
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </main>
  )
}
