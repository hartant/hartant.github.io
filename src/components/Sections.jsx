import { useState } from 'react'
import Icon from './Icons.jsx'
import {
  profile,
  experience,
  projects,
  projectFilters,
  websites,
  contacts,
  skills,
} from '../data.js'

// Section header written like a data key: projects[6]
function Key({ name, count, title }) {
  return (
    <header className="block__head">
      <p className="key mono">
        <span className="key__name">{name}</span>
        {count !== undefined && <span className="key__count">[{count}]</span>}
      </p>
      <h2 className="block__title">{title}</h2>
    </header>
  )
}

export function Experience() {
  return (
    <section id="experience" className="block">
      <Key name="experience" count={experience.length} title="Where I've worked" />
      <ol className="jobs">
        {experience.map((job) => (
          <li key={job.role + job.company} className="job">
            <div className="job__when mono">{job.period}</div>
            <div className="job__body">
              <h3>
                {job.role}
                <span className="job__at"> · {job.company}</span>
              </h3>
              <p className="job__meta">{[job.team, job.location].filter(Boolean).join(' · ')}</p>
              <ul className="job__points">
                {job.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <p className="tags mono">{job.tags.join('  ·  ')}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

const categoryLabel = { ai: 'AI & data', web: 'Web', school: '1337' }

export function Projects() {
  const [filter, setFilter] = useState('all')
  const shown = projects.filter((p) => filter === 'all' || p.category === filter)

  return (
    <section id="projects" className="block">
      <Key name="projects" count={projects.length} title="Things I've built" />

      <div className="filters" role="tablist" aria-label="Filter projects">
        {projectFilters.map((f) => {
          const count =
            f.id === 'all' ? projects.length : projects.filter((p) => p.category === f.id).length
          if (count === 0) return null
          return (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`filter mono ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label} <span>{count}</span>
            </button>
          )
        })}
      </div>

      <ul className="projects">
        {shown.map((p) => {
          const main = p.links.live || p.links.github
          return (
            <li key={p.title} className="project">
              <div className="project__head">
                <span className={`project__cat mono cat--${p.category}`}>
                  {categoryLabel[p.category]}
                </span>
                <h3>
                  {main ? (
                    <a href={main} target="_blank" rel="noreferrer">
                      {p.title}
                      <Icon name="arrow" size={18} />
                    </a>
                  ) : (
                    p.title
                  )}
                </h3>
              </div>
              <p className="project__desc">{p.description}</p>
              <div className="project__foot">
                <p className="tags mono">{p.tech.join('  ·  ')}</p>
                <div className="project__links">
                  {p.links.github && (
                    <a href={p.links.github} target="_blank" rel="noreferrer">
                      <Icon name="github" size={15} /> Code
                    </a>
                  )}
                  {p.links.live && (
                    <a href={p.links.live} target="_blank" rel="noreferrer">
                      <Icon name="external" size={15} /> Live
                    </a>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

function domain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function Websites() {
  if (websites.length === 0) return null
  return (
    <section id="websites" className="block">
      <Key name="live_sites" count={websites.length} title="Websites I've shipped" />
      <ul className="sites">
        {websites.map((w) => (
          <li key={w.name}>
            <a
              className="site"
              href={w.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${w.name} (opens in a new tab)`}
            >
              <span className="site__logo">
                {w.logo ? (
                  <img src={w.logo} alt="" loading="lazy" />
                ) : (
                  <span className="site__monogram">{initials(w.name)}</span>
                )}
              </span>
              <span className="site__info">
                <span className="site__name">{w.name}</span>
                <span className="site__type">{w.type}</span>
                <span className="site__url mono">
                  {domain(w.url)} <Icon name="external" size={13} />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Skills() {
  return (
    <section id="skills" className="block">
      <Key name="skills" title="What I work with" />
      <dl className="skills">
        {skills.map((g) => (
          <div key={g.group} className="skills__row">
            <dt className="mono">{g.group}</dt>
            <dd>
              {g.items.map((s) => (
                <span key={s} className="skill">
                  {s}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" className="block contact">
      <Key name="contact" title="Let's work together" />
      <p className="contact__lead">
        I'm open to full-time roles, internships and freelance projects in AI, data and web
        development. The fastest way to reach me is WhatsApp or a call.
      </p>
      <ul className="contacts">
        {contacts.map((c) => (
          <li key={c.label}>
            <a
              className={`contact-card contact-card--${c.icon}`}
              href={c.url}
              target={c.url.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              <span className="contact-card__icon">
                <Icon name={c.icon} size={22} />
              </span>
              <span className="contact-card__text">
                <span className="contact-card__label mono">{c.label}</span>
                <span className="contact-card__value">{c.value}</span>
              </span>
              <span className="contact-card__go" aria-hidden="true">
                <Icon name="arrow" size={16} />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer mono">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span>Built with React · hosted on GitHub Pages</span>
    </footer>
  )
}
