import Icon from './Icons.jsx'
import { HeroImage } from './Art.jsx'
import { PAGES } from './Pages.jsx'
import { profile, socials } from '../data.js'

export default function Menu({ selected, onSelect, onOpen }) {
  return (
    <div className="home">
      <div className="home__art">
        <div className="home__art-clip">
          <HeroImage />
        </div>
      </div>

      <div className="home__brand">
        <p className="home__name">{profile.name}</p>
        <p className="home__role">{profile.role}</p>
        {profile.available && (
          <p className="status">
            <span className="status__dot" /> Open to opportunities
          </p>
        )}
      </div>

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

      <div className="home__socials">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.url}
            aria-label={s.label}
            title={s.label}
            target={s.url.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
          >
            <Icon name={s.icon} size={18} />
          </a>
        ))}
      </div>
    </div>
  )
}
