/** Small inline icons. Decorative by default (aria-hidden); colour follows `currentColor`. */
import type { ReactNode } from 'react'

type IconProps = { size?: number; className?: string }

function Svg({ size = 24, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  )
}

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor" stroke="none" />
  </Svg>
)

export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
)

export const EnvelopeIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="3" />
    <path d="m4 7.5 8 6 8-6" />
  </Svg>
)

export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </Svg>
)

export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 11.5 12 5l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5H9v5H5.5A1.5 1.5 0 0 1 4 19z" />
  </Svg>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Svg>
)

export const PlayNoteIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 18V6l10-2v12" />
    <circle cx="6.5" cy="18" r="2.5" />
    <circle cx="16.5" cy="16" r="2.5" />
  </Svg>
)

export const ShuffleIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7h3.5c2 0 3.2 1 4.3 2.6l2.4 4.8C14.3 16 15.5 17 17.5 17H21" />
    <path d="M3 17h3.5c2 0 3.2-1 4.3-2.6M13.2 9.6C14.3 8 15.5 7 17.5 7H21" />
    <path d="M18.5 4.5 21 7l-2.5 2.5M18.5 14.5 21 17l-2.5 2.5" />
  </Svg>
)
