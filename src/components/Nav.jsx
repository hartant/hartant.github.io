import { useEffect, useState } from 'react'
import Icon from './Icons.jsx'
import { profile } from '../data.js'

const links = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#websites', label: 'Websites' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__logo" onClick={() => setOpen(false)}>
          <span className="nav__logo-mark">MB</span>
          <span className="nav__logo-text">{profile.name}</span>
        </a>

        <nav className={`nav__links ${open ? 'is-open' : ''}`} aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a className="btn btn--small btn--primary nav__cv" href={profile.cv} download>
            <Icon name="download" size={15} /> CV
          </a>
        </nav>

        <div className="nav__actions">
          <button
            className="icon-btn nav__burger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>
    </header>
  )
}
