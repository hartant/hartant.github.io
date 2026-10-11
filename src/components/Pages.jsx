import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { Collage, Thumb } from './Art.jsx'
import {
  profile,
  contacts,
  experience,
  projects,
  websites,
  skills,
  education,
  languages,
} from '../data.js'

const skillCount = skills.reduce((n, g) => n + g.items.length, 0)
const isExternal = (url) => url.startsWith('http')

// Main menu entries. `note` is the small line shown under the selected word.
export const PAGES = [
  { id: 'career', label: 'Career', note: `${experience.length} roles · AI & web` },
  { id: 'build', label: 'Build', note: `${projects.length} projects · ${websites.length} live sites` },
  { id: 'skills', label: 'Skills', note: `${skillCount} tools & languages` },
  { id: 'about', label: 'About', note: '1337 · UM6P · Casablanca' },
  { id: 'links', label: 'Links', note: 'Phone · WhatsApp · LinkedIn' },
  { id: 'credits', label: 'Credits', note: 'Code & fonts' },
]

/* ---------- Row data for each page ---------- */

function careerRows() {
  return experience.map((job, i) => ({
    key: job.role + job.company,
    stamp: /present/i.test(job.period) ? 'Current' : null,
    thumb: i,
    title: job.role,
    sub: [job.company, job.location].filter(Boolean).join(', '),
    side: job.period,
    details: (
      <>
        <ul className="points">
          {job.points.map((p, j) => (
            <li key={j}>{p}</li>
          ))}
        </ul>
        <p className="tech">{job.tags.join(' / ')}</p>
      </>
    ),
  }))
}

const BUILD_TABS = [
  { id: 'sites', label: 'Live sites' },
  { id: 'ai', label: 'AI & data' },
  { id: 'school', label: '1337' },
]

function buildRows(tab) {
  if (tab === 'sites') {
    return websites.map((w) => ({
      key: w.name,
      logo: w.logo,
      title: w.name,
      sub: w.type,
      side: '',
      href: w.url,
    }))
  }
  return projects
    .filter((p) => p.category === tab)
    .map((p, i) => ({
      key: p.title,
      thumb: i + 1,
      title: p.title,
      sub: p.tech.slice(0, 3).join(' · '),
      side: p.links.live ? 'Live' : p.links.github ? 'Code' : '',
      href: p.links.live || p.links.github,
      details: (
        <>
          <p className="desc">{p.description}</p>
          <p className="tech">{p.tech.join(' / ')}</p>
          <p className="row__links">
            {p.links.github && (
              <a href={p.links.github} target="_blank" rel="noreferrer">
                <Icon name="github" size={14} /> Code
              </a>
            )}
            {p.links.live && (
              <a href={p.links.live} target="_blank" rel="noreferrer">
                <Icon name="external" size={14} /> Live
              </a>
            )}
          </p>
        </>
      ),
    }))
}

function skillRows() {
  return skills.map((g, i) => ({
    key: g.group,
    thumb: i + 2,
    title: g.group,
    sub: `${g.items.length} skills`,
    side: '',
    open: true,
    details: (
      <p className="chips">
        {g.items.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </p>
    ),
  }))
}

function aboutRows() {
  return [
    ...education.map((e, i) => ({
      key: e.school,
      stamp: i === 0 ? 'School' : null,
      thumb: i + 3,
      title: e.school,
      sub: `${e.detail} · ${e.place}`,
      side: e.period,
    })),
    {
      key: 'languages',
      thumb: 0,
      title: 'Languages',
      sub: languages.map((l) => `${l.name} ${l.level}`).join(' · '),
      side: '',
    },
  ]
}

function linkRows() {
  return [
    ...contacts.map((c) => ({
      key: c.label,
      icon: c.icon,
      title: c.value,
      sub: c.label,
      side: '',
      href: c.url,
    })),
    {
      key: 'cv',
      icon: 'download',
      title: 'Download my CV',
      sub: 'PDF',
      side: '',
      href: profile.cv,
      download: true,
      gold: true,
    },
  ]
}

function creditRows() {
  return [
    { key: 'code', icon: 'code', title: 'Design & code', sub: `${profile.name} · React + Vite`, side: '' },
    { key: 'fonts', icon: 'globe', title: 'Fonts', sub: 'Archivo & Geist Mono', side: '' },
  ]
}

/* ---------- Row list with keyboard selection ---------- */

function Rows({ rows }) {
  const [sel, setSel] = useState(0)
  const listRef = useRef(null)

  useEffect(() => setSel(0), [rows.length, rows[0]?.key])

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.target.closest?.('input, textarea, .chat')) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSel((s) => Math.min(s + 1, rows.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSel((s) => Math.max(s - 1, 0))
      } else if (e.key === 'Enter' && document.activeElement === document.body) {
        const row = rows[sel]
        if (row?.href) {
          if (row.download) listRef.current?.querySelectorAll('.row__bar')[sel]?.click()
          else window.open(row.href, isExternal(row.href) ? '_blank' : '_self', 'noreferrer')
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [rows, sel])

  useEffect(() => {
    listRef.current?.children[sel]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [sel])

  return (
    <ul className="rows" ref={listRef}>
      {rows.map((row, i) => {
        const inner = (
          <>
            {row.stamp && <span className="row__stamp">{row.stamp}</span>}
            {row.logo ? (
              <span className="thumb thumb--logo">
                <img src={row.logo} alt="" />
              </span>
            ) : row.icon ? (
              <span className={`thumb thumb--icon icon--${row.icon}`}>
                <Icon name={row.icon} size={24} />
              </span>
            ) : (
              <Thumb index={row.thumb} />
            )}
            <span className="row__main">
              <span className="row__title">{row.title}</span>
              <span className="row__sub">{row.sub}</span>
            </span>
            {row.side && <span className="row__side">{row.side}</span>}
            {row.href && !row.details && <Icon name="arrow" size={18} />}
          </>
        )
        const barProps = {
          className: 'row__bar',
          onMouseEnter: () => setSel(i),
          onFocus: () => setSel(i),
        }
        return (
          <li
            key={row.key}
            className={`row ${sel === i ? 'is-selected' : ''} ${row.gold ? 'row--gold' : ''} ${row.open ? 'is-open' : ''}`}
            style={{ '--i': i }}
          >
            {row.href && !row.details ? (
              <a
                {...barProps}
                href={row.href}
                {...(row.download ? { download: true } : isExternal(row.href) ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {inner}
              </a>
            ) : (
              <button {...barProps} onClick={() => setSel(i)} aria-expanded={row.details ? sel === i || !!row.open : undefined}>
                {inner}
              </button>
            )}
            {row.details && (
              <div className="row__details">
                <div className="row__details-in">{row.details}</div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- Page shell ---------- */

function BuildBody() {
  const [tab, setTab] = useState('sites')

  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, .chat')) return
      const i = BUILD_TABS.findIndex((t) => t.id === tab)
      if (e.key === 'ArrowRight') setTab(BUILD_TABS[(i + 1) % BUILD_TABS.length].id)
      if (e.key === 'ArrowLeft') setTab(BUILD_TABS[(i - 1 + BUILD_TABS.length) % BUILD_TABS.length].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tab])

  return (
    <>
      <div className="tabs" role="tablist" aria-label="Project type">
        {BUILD_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? 'is-active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
          </button>
        ))}
        <span className="tabs__hint">← → switch</span>
      </div>
      <Rows rows={buildRows(tab)} />
    </>
  )
}

const BODIES = {
  career: () => <Rows rows={careerRows()} />,
  build: BuildBody,
  skills: () => <Rows rows={skillRows()} />,
  about: () => (
    <>
      <div className="intro-panel">
        {profile.summary.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <Rows rows={aboutRows()} />
    </>
  ),
  links: () => (
    <>
      <p className="lead">
        Open to full-time roles, internships and freelance work in AI, data and web. WhatsApp or a call is the
        fastest way to reach me.
      </p>
      <Rows rows={linkRows()} />
    </>
  ),
  credits: () => <Rows rows={creditRows()} />,
}

export function Page({ id, onBack }) {
  const page = PAGES.find((p) => p.id === id)
  const Body = BODIES[id]
  return (
    <div className="page">
      <Collage />
      <div className="page__main">
        <div className="page__head">
          <button className="back" onClick={onBack}>
            <Icon name="arrow" size={16} />
            <span>Back</span>
          </button>
          <h1 className="page__title">{page.label}</h1>
        </div>
        <Body />
      </div>
    </div>
  )
}
