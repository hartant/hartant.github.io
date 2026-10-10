import Icon from './Icons.jsx'
import { profile } from '../data.js'

export default function TopBar({ theme, onToggleTheme, children }) {
  return (
    <header className="topbar">
      {children}
      <div className="topbar__actions">
        <button
          className="chip-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <a className="chip-btn chip-btn--gold" href={profile.cv} download>
          <Icon name="download" size={15} />
          <span>CV</span>
        </a>
      </div>
    </header>
  )
}
