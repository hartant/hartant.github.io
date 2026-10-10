import Icon from './Icons.jsx'
import { HeroArt } from './Art.jsx'
import { PAGES } from './Pages.jsx'
import TopBar from './TopBar.jsx'
import { profile, socials } from '../data.js'

export default function Menu({ selected, onSelect, onOpen, theme, onToggleTheme }) {
  return (
    <div className="home">
      <TopBar theme={theme} onToggleTheme={onToggleTheme}>
        <div className="brand">
          <span className="brand__mark">MB</span>
          <div>
            <p className="brand__name">{profile.name}</p>
            <p className="brand__role">{profile.role}</p>
          </div>
        </div>
      </TopBar>

      <div className="home__stage">
        <figure className="frame frame--hero">
          <div className="frame__inner">
            <HeroArt />
          </div>
        </figure>

        <nav className="menu" aria-label="Main menu">
          {PAGES.map((p, i) => (
            <button
              key={p.id}
              className={`menu__item ${selected === i ? 'is-active' : ''}`}
              style={{ '--i': i }}
              onMouseEnter={() => onSelect(i)}
              onFocus={() => onSelect(i)}
              onClick={() => onOpen(p.id)}
            >
              <span className="menu__word">{p.label}</span>
              <span className="menu__note">{p.note}</span>
            </button>
          ))}
        </nav>
      </div>

      <footer className="home__foot">
        <p className="keys">
          <kbd>↑</kbd>
          <kbd>↓</kbd> choose <kbd>Enter</kbd> open <kbd>Esc</kbd> back
        </p>
        {profile.available && (
          <p className="status">
            <span className="status__dot" /> Open to opportunities
          </p>
        )}
        <div className="socials">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              aria-label={s.label}
              title={s.label}
              target={s.url.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              <Icon name={s.icon} size={19} />
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
