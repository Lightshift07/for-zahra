import { NavLink } from 'react-router'
import { CalendarIcon, EnvelopeIcon, HomeIcon } from './Icons'
import './TabBar.css'

const TABS = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/open-when', label: 'Open When', Icon: EnvelopeIcon, end: false },
  { to: '/open-on', label: 'Open On', Icon: CalendarIcon, end: false },
] as const

/** Bottom navigation. Essential when launched from the home screen: there's no browser back button. */
export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Main">
      <ul className="tabbar__list">
        {TABS.map(({ to, label, Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className="tabbar__link">
              <span className="tabbar__icon">
                <Icon size={22} />
              </span>
              <span className="tabbar__label">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
