import { useEffect } from 'react'
import Icon from './Icons.jsx'

// "Ready" screen. The first click / key press also unlocks audio in the browser.
export default function Start({ musicOn, onToggleMusic, onContinue }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Tab' || e.key === 'Shift') return
      if (e.target.closest?.('.start__music')) return
      e.preventDefault()
      onContinue()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onContinue])

  return (
    <div className="start" onClick={onContinue}>
      <p className="start__ready">Ready</p>
      <p className="start__hint">Click or press any key to continue</p>

      <ul className="legend">
        <li>
          <span className="legend__key">↑ ↓ ← →</span>
          <span className="legend__what">Navigate</span>
        </li>
        <li>
          <span className="legend__key">Click / Enter</span>
          <span className="legend__what">Select</span>
        </li>
        <li>
          <span className="legend__key">Esc / Backspace</span>
          <span className="legend__what">Back</span>
        </li>
      </ul>

      <button
        className="start__music"
        onClick={(e) => {
          e.stopPropagation()
          onToggleMusic()
        }}
        aria-pressed={musicOn}
      >
        <Icon name={musicOn ? 'volume' : 'mute'} size={14} />
        Music {musicOn ? 'on' : 'off'}
      </button>
    </div>
  )
}
