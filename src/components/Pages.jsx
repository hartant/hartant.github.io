import { useState } from 'react'
import Icon from './Icons.jsx'
import TopBar from './TopBar.jsx'
import { ART } from './Art.jsx'
import {
  profile,
  contacts,
  experience,
  projects,
  projectFilters,
  websites,
  skills,
  education,
  languages,
} from '../data.js'

const skillCount = skills.reduce((n, g) => n + g.items.length, 0)

// Menu entries. `note` is the small line shown under the selected word.
export const PAGES = [
  { id: 'about', label: 'About', note: '1337 · UM6P · Casablanca', art: 'close' },
  { id: 'career', label: 'Career', note: `${experience.length} roles · AI & web`, art: 'moon' },
  { id: 'projects', label: 'Projects', note: `${projects.length} builds · AI, data, 1337`, art: 'close' },
  { id: 'websites', label: 'Websites', note: `${websites.length} live sites`, art: 'moon' },
  { id: 'skills', label: 'Skills', note: `${skillCount} tools & languages`, art: 'close' },
  { id: 'contact', label: 'Contact', note: 'Phone · WhatsApp · Email', art: 'moon' },
]

const external = (url) => (url.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})

function About() {
  return (
    <>
      <div className="banner banner--text">
        {profile.summary.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      {education.map((e) => (
        <div key={e.school} className="banner">
          <span className="tag tag--violet">Education</span>
          <div className="banner__main">
            <h3>{e.school}</h3>
            <p className="banner__sub">{e.detail}</p>
          </div>
          <p className="banner__side">
            {e.place}
            <br />
            {e.period}
          </p>
        </div>
      ))}
      <div className="banner">
        <span className="tag tag--cyan">Languages</span>
        <div className="banner__main">
          <p className="langs">
            {languages.map((l) => (
              <span key={l.name}>
                {l.name} <em>{l.level}</em>
              </span>
            ))}
          </p>
        </div>
      </div>
    </>
  )
}

function Career() {
  return experience.map((job) => {
    const current = /present/i.test(job.period)
    return (
      <article key={job.role + job.company} className="banner banner--stack">
        <div className="banner__row">
          {current ? <span className="tag tag--gold">Current</span> : <span className="tag">Past</span>}
          <div className="banner__main">
            <h3>{job.role}</h3>
            <p className="banner__sub">
              {[job.company, job.location].filter(Boolean).join(' · ')}
            </p>
          </div>
          <p className="banner__side">{job.period}</p>
        </div>
        <ul className="points">
          {job.points.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <p className="tech">{job.tags.join(' / ')}</p>
      </article>
    )
  })
}

const catTag = { ai: ['AI & data', 'tag--violet'], web: ['Web', 'tag--cyan'], school: ['1337', 'tag--gold'] }

function Projects() {
  const [filter, setFilter] = useState('all')
  const shown = projects.filter((p) => filter === 'all' || p.category === filter)
  return (
    <>
      <div className="tabs" role="tablist" aria-label="Filter projects">
        {projectFilters.map((f) => {
          const count =
            f.id === 'all' ? projects.length : projects.filter((p) => p.category === f.id).length
          if (!count) return null
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`tab ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              <span>
                {f.label} {count}
              </span>
            </button>
          )
        })}
      </div>
      {shown.map((p) => (
        <article key={p.title} className="banner banner--stack">
          <div className="banner__row">
            <span className={`tag ${catTag[p.category][1]}`}>{catTag[p.category][0]}</span>
            <div className="banner__main">
              <h3>{p.title}</h3>
            </div>
            <div className="links">
              {p.links.github && (
                <a href={p.links.github} {...external(p.links.github)}>
                  <Icon name="github" size={15} /> Code
                </a>
              )}
              {p.links.live && (
                <a href={p.links.live} {...external(p.links.live)}>
                  <Icon name="external" size={15} /> Live
                </a>
              )}
            </div>
          </div>
          <p className="desc">{p.description}</p>
          <p className="tech">{p.tech.join(' / ')}</p>
        </article>
      ))}
    </>
  )
}

function Websites() {
  return (
    <div className="sites">
      {websites.map((w) => (
        <a key={w.name} className="site" href={w.url} {...external(w.url)} aria-label={`Visit ${w.name} (opens in a new tab)`}>
          <span className="site__plate">
            <img src={w.logo} alt="" loading="lazy" />
          </span>
          <span className="site__info">
            <strong>{w.name}</strong>
            <span>{w.type}</span>
            <span className="site__url">
              {new URL(w.url).hostname} <Icon name="external" size={13} />
            </span>
          </span>
        </a>
      ))}
    </div>
  )
}

function Skills() {
  return skills.map((g) => (
    <div key={g.group} className="banner banner--stack">
      <div className="banner__row">
        <div className="banner__main">
          <h3>{g.group}</h3>
        </div>
        <p className="banner__side">{g.items.length}</p>
      </div>
      <p className="skills">
        {g.items.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </p>
    </div>
  ))
}

function Contact() {
  return (
    <>
      <p className="lead">
        Open to full-time roles, internships and freelance work in AI, data and web development.
        WhatsApp or a call is the fastest way to reach me.
      </p>
      {contacts.map((c) => (
        <a key={c.label} className={`banner banner--link contact--${c.icon}`} href={c.url} {...external(c.url)}>
          <span className="contact__icon">
            <Icon name={c.icon} size={22} />
          </span>
          <div className="banner__main">
            <p className="banner__label">{c.label}</p>
            <h3>{c.value}</h3>
          </div>
          <span className="banner__go">
            <Icon name="arrow" size={18} />
          </span>
        </a>
      ))}
      <a className="banner banner--link banner--gold" href={profile.cv} download>
        <span className="contact__icon">
          <Icon name="download" size={22} />
        </span>
        <div className="banner__main">
          <p className="banner__label">Résumé</p>
          <h3>Download my CV (PDF)</h3>
        </div>
        <span className="banner__go">
          <Icon name="arrow" size={18} />
        </span>
      </a>
    </>
  )
}

const BODIES = { about: About, career: Career, projects: Projects, websites: Websites, skills: Skills, contact: Contact }

export function Page({ id, onBack, theme, onToggleTheme }) {
  const page = PAGES.find((p) => p.id === id)
  const Body = BODIES[id]
  const Art = ART[page.art]
  return (
    <div className="page">
      <TopBar theme={theme} onToggleTheme={onToggleTheme}>
        <button className="back" onClick={onBack}>
          <Icon name="arrow" size={16} />
          <span>Back</span>
          <kbd>Esc</kbd>
        </button>
      </TopBar>

      <div className="page__grid">
        <div className="page__main">
          <h1 className="page__title" data-text={page.label}>
            {page.label}
          </h1>
          <div className="page__body">
            <Body />
          </div>
        </div>
        <aside className="page__art">
          <figure className="frame frame--side">
            <div className="frame__inner">
              <Art />
            </div>
          </figure>
        </aside>
      </div>

      <footer className="page__foot">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  )
}
