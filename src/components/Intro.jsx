import { useEffect, useRef, useState } from 'react'
import { intro, profile, education, languages } from '../data.js'

// Turn the parsed object into display lines: [{ key, value, last }]
const entries = Object.entries(intro.parsed)

function formatValue(v) {
  if (Array.isArray(v)) return '[' + v.map((x) => JSON.stringify(x)).join(', ') + ']'
  return JSON.stringify(v)
}

function valueClass(v) {
  if (typeof v === 'boolean') return 'j-bool'
  if (Array.isArray(v)) return 'j-arr'
  return 'j-str'
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function Intro() {
  const total = intro.prompt.length
  const [typed, setTyped] = useState(0)
  const [lines, setLines] = useState(0)
  const [run, setRun] = useState(0)
  const [seen, setSeen] = useState(false)
  const boxRef = useRef(null)

  // Start the demo only once it scrolls into view.
  useEffect(() => {
    const el = boxRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!seen) return
    if (prefersReducedMotion()) {
      setTyped(total)
      setLines(entries.length)
      return
    }
    setTyped(0)
    setLines(0)
    let i = 0
    let l = 0
    let lineTimer
    const typeTimer = setInterval(() => {
      i += 2
      setTyped(Math.min(i, total))
      if (i >= total) {
        clearInterval(typeTimer)
        setTimeout(() => {
          lineTimer = setInterval(() => {
            l += 1
            setLines(l)
            if (l >= entries.length) clearInterval(lineTimer)
          }, 180)
        }, 350)
      }
    }, 22)
    return () => {
      clearInterval(typeTimer)
      clearInterval(lineTimer)
    }
  }, [run, seen, total])

  const parsing = typed >= total && lines < entries.length
  const done = lines >= entries.length

  return (
    <section id="intro" className="block intro">
      <p className="key mono">
        <span className="key__name">whoami</span>
      </p>
      <h2 className="intro__title">
        Unstructured in.
        <br />
        <em>Structured out.</em>
      </h2>
      <p className="intro__lead">
        That's most of what I build: pipelines, LLM tools and web apps that take messy input and
        return something clean you can actually use. Here's a small example.
      </p>

      <div className="parse" ref={boxRef} aria-label="Example: a message parsed into a structured profile">
        <div className="parse__pane parse__in">
          <div className="parse__label mono">
            <span>input</span>
            <span className="muted">natural language</span>
          </div>
          <p className="parse__prompt">
            {intro.prompt.slice(0, typed)}
            {typed < total && <span className="caret" />}
          </p>
        </div>

        <div className={`parse__arrow ${parsing ? 'is-busy' : ''} ${done ? 'is-done' : ''}`} aria-hidden="true">
          <span className="mono">{done ? 'parsed' : parsing ? 'parsing' : 'reading'}</span>
          <svg viewBox="0 0 48 12" width="48" height="12">
            <path d="M0 6h44M38 1l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="parse__pane parse__out">
          <div className="parse__label mono">
            <span>output</span>
            <span className="muted">application/json</span>
          </div>
          <pre className="parse__json mono">
            <span className="j-punc">{'{'}</span>
            {'\n'}
            {entries.map(([k, v], idx) => (
              <span key={k} className={`j-line ${idx < lines ? 'is-in' : ''}`}>
                {'  '}
                <span className="j-key">"{k}"</span>
                <span className="j-punc">: </span>
                <span className={valueClass(v)}>{formatValue(v)}</span>
                {idx < entries.length - 1 && <span className="j-punc">,</span>}
                {'\n'}
              </span>
            ))}
            <span className="j-punc">{'}'}</span>
          </pre>
          <button className="parse__replay mono" onClick={() => setRun((r) => r + 1)} disabled={!done}>
            ↻ Run again
          </button>
        </div>
      </div>

      <div className="about">
        <div className="about__text">
          {profile.summary.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <dl className="facts">
          {education.map((e) => (
            <div key={e.school}>
              <dt className="mono">education</dt>
              <dd>
                <strong>{e.school}</strong>
                <span>
                  {e.detail} · {e.place} · {e.period}
                </span>
              </dd>
            </div>
          ))}
          <div>
            <dt className="mono">languages</dt>
            <dd>
              <span>
                {languages.map((l) => `${l.name} (${l.level})`).join(' · ')}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
