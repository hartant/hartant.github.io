import Icon from './Icons.jsx'
import { profile } from '../data.js'

export default function TopBar({ theme, onToggleTheme, onChat, chatOpen, children }) {
  return (
    <header className="topbar">
      {children}
      <div className="topbar__actions">
        {onChat && (
          <button
            className={`chip-btn chip-btn--ask ${chatOpen ? 'is-on' : ''}`}
            onClick={onChat}
            aria-expanded={chatOpen}
            aria-label="Ask questions about Mohammed"
          >
            <Icon name="chat" size={15} />
            <span>Ask</span>
          </button>
        )}
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
