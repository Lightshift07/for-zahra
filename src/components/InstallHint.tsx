import { useState } from 'react'
import { HomeIcon } from './Icons'
import './InstallHint.css'

const KEY = 'for-zahra:install-hint-dismissed'

function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
}

function isIOS(): boolean {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1)
}

function wasDismissed(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** Gentle one-time tip to add the site to the home screen. Hidden once installed or dismissed. */
export default function InstallHint() {
  const [hidden, setHidden] = useState(() => isStandalone() || wasDismissed())
  if (hidden) return null

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      // storage unavailable — just hide for this visit
    }
    setHidden(true)
  }

  return (
    <aside className="install-hint" aria-labelledby="install-hint-title">
      <span className="install-hint__icon">
        <HomeIcon size={22} />
      </span>
      <div>
        <h2 id="install-hint-title" className="install-hint__title">
          Keep me on your home screen
        </h2>
        <p className="install-hint__text">
          {isIOS() ? (
            <>
              Tap <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
            </>
          ) : (
            <>
              Open your browser menu <strong>⋮</strong>, then tap <strong>Add to Home screen</strong>.
            </>
          )}
        </p>
        <button type="button" className="install-hint__dismiss" onClick={dismiss}>
          Got it
        </button>
      </div>
    </aside>
  )
}
