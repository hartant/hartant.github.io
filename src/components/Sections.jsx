import { useState } from 'react'
import Icon from './Icons.jsx'
import {
  profile,
  socials,
  experience,
  projects,
  projectFilters,
  websites,
  skills,
  education,
  languages,
} from '../data.js'

function SectionTitle({ index, title }) {
  return (
    <div className="section-title reveal">
      <span className="mono">{index}.</span>
      <h2>{title}</h2>
      <span className="section-title__line" />
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionTitle index="01" title="About me" />
        <div className="about">
          <div className="about__text reveal">
            {profile.summary.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="about__side">
            <div className="panel reveal">
              <h3>Education</h3>
              <ul className="edu">
                {education.map((e) => (
                  <li key={e.school}>
                    <strong>{e.school}</strong>
                    <span>{e.detail}</span>
                    <span className="muted">
                      {e.place} · {e.period}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel reveal">
              <h3>Languages</h3>
              <ul className="langs">
                {languages.map((l) => (
                  <li key={l.name}>
                    <span>{l.name}</span>
                    <span className="chip chip--soft">{l.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionTitle index="02" title="Experience" />
        <ol className="timeline">
          {experience.map((job) => (
            <li key={job.role + job.company} className="timeline__item reveal">
              <div className="timeline__period mono">{job.period}</div>
              <div className="timeline__card">
                <h3>
                  {job.role} <span className="accent">@ {job.company}</span>
                </h3>
                <p className="muted small">
                  {[job.team, job.location].filter(Boolean).join(' · ')}
                </p>
                <ul className="bullets">
                  {job.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <div className="chips">
                  {job.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const categoryIcon = { ai: 'brain', web: 'globe', school: 'code' }
const categoryLabel = { ai: 'AI & Data', web: 'Web', school: '1337' }

export function Projects() {
  const [filter, setFilter] = useState('all')
  const shown = projects.filter((p) => filter === 'all' || p.category === filter)

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionTitle index="03" title="Projects" />

        <div className="filters reveal" role="tablist" aria-label="Filter projects">
          {projectFilters.map((f) => {
            const count =
              f.id === 'all' ? projects.length : projects.filter((p) => p.category === f.id).length
            if (count === 0) return null
            return (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={`filter ${filter === f.id ? 'is-active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label} <span className="filter__count">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="projects">
          {shown.map((p) => (
            <article
              key={p.title}
              className={`project ${p.featured ? 'project--featured' : ''}`}
            >
              <div className="project__top">
                <span className={`project__icon project__icon--${p.category}`}>
                  <Icon name={categoryIcon[p.category]} size={20} />
                </span>
                <div className="project__links">
                  {p.links.github && (
                    <a href={p.links.github} target="_blank" rel="noreferrer" aria-label="Source code on GitHub" title="Source code">
                      <Icon name="github" />
                    </a>
                  )}
                  {p.links.live && (
                    <a href={p.links.live} target="_blank" rel="noreferrer" aria-label="Open project" title="Open project">
                      <Icon name="external" />
                    </a>
                  )}
                </div>
              </div>
              <span className="project__cat mono">{categoryLabel[p.category]}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="chips">
                {p.tech.map((t) => (
                  <span key={t} className="chip chip--mono">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
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
    <section id="websites" className="section">
      <div className="container">
        <SectionTitle index="04" title="Websites I've built" />
        <p className="section-lead muted reveal">
          Live websites I designed and developed for clients and personal projects. Click a logo
          to visit the site.
        </p>
        <ul className="sites">
          {websites.map((w) => (
            <li key={w.name} className="reveal">
              <a
                className="site"
                href={w.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit ${w.name} (opens in a new tab)`}
              >
                <Icon name="external" size={15} />
                <span className="site__logo">
                  {w.logo ? (
                    <img src={w.logo} alt={`${w.name} logo`} loading="lazy" />
                  ) : (
                    <span className="site__monogram">{initials(w.name)}</span>
                  )}
                </span>
                <span className="site__name">{w.name}</span>
                <span className="site__meta mono">{w.type || domain(w.url)}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionTitle index="05" title="Skills" />
        <div className="skills">
          {skills.map((g) => (
            <div key={g.group} className="panel reveal">
              <h3>{g.group}</h3>
              <div className="chips">
                {g.items.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner reveal">
        <p className="mono accent">06. What's next?</p>
        <h2>Let's work together</h2>
        <p className="muted">
          I'm open to full-time roles, internships and freelance projects, especially in AI, data
          and web development. If you have a question or an opportunity, my inbox is open.
        </p>
        <div className="hero__cta contact__cta">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            <Icon name="mail" size={16} /> Say hello
          </a>
          <a className="btn btn--ghost" href={profile.cv} download>
            <Icon name="download" size={16} /> Download CV
          </a>
        </div>
        <div className="socials socials--center">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url}
              className="icon-btn"
              aria-label={s.label}
              title={s.label}
              target={s.url.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
            >
              <Icon name={s.icon} />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="mono muted">Built with React</span>
      </div>
    </footer>
  )
}
