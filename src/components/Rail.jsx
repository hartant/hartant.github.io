import Icon from './Icons.jsx'
import { profile, socials } from '../data.js'

export const sections = [
  { id: 'intro', label: 'Intro' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'websites', label: 'Websites' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export default function Rail({ active, theme, onToggleTheme }) {
  return (
    <aside className="rail">
      <div className="rail__top">
        <div className="rail__brand">
          <a href="#intro" className="rail__mark" aria-label="Back to top">
            MB
          </a>
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={15} />
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <h1 className="rail__name">
          Mohammed
          <br />
          Benamar
        </h1>
        <p className="rail__role">{profile.role}</p>
        <p className="rail__tagline">{profile.tagline}</p>
        {profile.available && (
          <p className="rail__status">
            <span className="dot" /> Open to opportunities
          </p>
        )}
      </div>

      <nav className="rail__nav" aria-label="Sections">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={active === s.id ? 'is-active' : undefined}
            aria-current={active === s.id ? 'true' : undefined}
          >
            <span className="rail__nav-line" />
            {s.label}
          </a>
        ))}
      </nav>

      <div className="rail__bottom">
        <a className="btn btn--primary" href={profile.cv} download>
          <Icon name="download" size={16} /> Download CV
        </a>
        <div className="rail__socials">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              aria-label={s.label}
              title={s.label}
              target={s.url.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              <Icon name={s.icon} size={20} />
            </a>
          ))}
        </div>
        <p className="rail__loc mono">
          <Icon name="pin" size={13} /> {profile.location}
        </p>
      </div>
    </aside>
  )
}
