import { formatDate } from '../lib/format'
import { together, TOGETHER_SINCE } from '../lib/together'
import { HeartIcon } from './Icons'
import './TogetherCounter.css'

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/** "Together for 139 days" — live, rolls over at 12:00am Eastern (via the `now` it's given). */
export default function TogetherCounter({ now }: { now: Date }) {
  const { days, months, extraDays } = together(now)
  const breakdown =
    months === 0
      ? null
      : extraDays === 0
        ? `That's exactly ${plural(months, 'month')}!`
        : `That's ${plural(months, 'month')} and ${plural(extraDays, 'day')}.`

  return (
    <section className="together" aria-labelledby="together-title">
      <span className="together__heart">
        <HeartIcon size={22} />
      </span>
      <h2 id="together-title" className="together__label">
        Together for
      </h2>
      <p className="together__count">
        <span className="together__number">{days.toLocaleString('en-US')}</span> {days === 1 ? 'day' : 'days'}
      </p>
      {breakdown && <p className="together__breakdown">{breakdown}</p>}
      <p className="together__since">Since {formatDate(TOGETHER_SINCE)}, and counting</p>
    </section>
  )
}
