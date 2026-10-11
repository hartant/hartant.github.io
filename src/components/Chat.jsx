import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { reply, welcome, BOT_NAME } from '../chat/bot.js'
import { profile } from '../data.js'

// Kuro: a little black cat with gold eyes, a red collar and a bell.
// It blinks, swishes its tail and tilts its head on hover.
export function CatIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={`cat ${className}`} aria-hidden="true">
      <path className="cat__tail" d="M43 54 C56 53 59 41 52 31" />
      <ellipse className="cat__black" cx="32" cy="47" rx="14" ry="12" />
      <ellipse className="cat__black" cx="25" cy="57.5" rx="4.2" ry="2.6" />
      <ellipse className="cat__black" cx="39" cy="57.5" rx="4.2" ry="2.6" />
      <g className="cat__head">
        <path className="cat__black cat__ear cat__ear--l" d="M20 22 L18.5 6.5 L30 15 Z" />
        <path className="cat__black cat__ear cat__ear--r" d="M44 22 L45.5 6.5 L34 15 Z" />
        <path className="cat__ear-in" d="M22 18 L21.4 11 L27 15 Z" />
        <path className="cat__ear-in" d="M42 18 L42.6 11 L37 15 Z" />
        <circle className="cat__black" cx="32" cy="26" r="13" />
        <g className="cat__eyes">
          <ellipse className="cat__eye" cx="26.5" cy="25" rx="3.5" ry="3.9" />
          <ellipse className="cat__eye" cx="37.5" cy="25" rx="3.5" ry="3.9" />
          <ellipse className="cat__pupil" cx="26.9" cy="25" rx="1" ry="3" />
          <ellipse className="cat__pupil" cx="37.9" cy="25" rx="1" ry="3" />
        </g>
        <path className="cat__nose" d="M30.6 30.2 L33.4 30.2 L32 31.8 Z" />
        <path className="cat__whisker" d="M17 29 L24 30.2 M17.5 32.5 L24 31.6 M47 29 L40 30.2 M46.5 32.5 L40 31.6" />
      </g>
      <path className="cat__collar" d="M21.5 36.5 Q32 42 42.5 36.5" />
      <circle className="cat__bell" cx="32" cy="40" r="2.5" />
    </svg>
  )
}

// The round corner button the chat tucks into.
export function CatLauncher({ onOpen, bubble, onDismissBubble }) {
  return (
    <div className="cat-launch">
      {bubble && (
        <p className="cat-bubble" role="status">
          <button className="cat-bubble__x" onClick={onDismissBubble} aria-label="Dismiss">
            <Icon name="close" size={11} />
          </button>
          Meow! 🐾 Ask me about {profile.firstName}
        </p>
      )}
      <button className="cat-btn" onClick={onOpen} aria-label={`Chat with ${BOT_NAME}, ${profile.firstName}'s assistant`}>
        <CatIcon />
      </button>
    </div>
  )
}

// Turn **bold** into <strong>; newlines are kept by CSS (white-space: pre-line).
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
  )
}

export default function Chat({ open, onClose, onRoute }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const greeted = useRef(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  // The first time the chat opens, Kuro "types" its greeting.
  useEffect(() => {
    if (!open) return
    if (!greeted.current) {
      greeted.current = true
      setTyping(true)
      setTimeout(() => {
        setMessages([{ from: 'bot', ...welcome() }])
        setTyping(false)
      }, 900)
    }
    // Don't pop the phone keyboard open by itself.
    if (!window.matchMedia('(max-width: 760px)').matches) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  const ask = (text) => {
    const q = text.trim()
    if (!q || typing) return
    setMessages((m) => [...m, { from: 'user', text: q }])
    setInput('')
    setTyping(true)
    // A short pause so the answer feels like a reply, not a page jump.
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', ...reply(q) }])
      setTyping(false)
    }, 450 + Math.min(q.length * 8, 400))
  }

  const runAction = (a) => {
    if (a.ask) ask(a.ask)
    else if (a.route) {
      onRoute(a.route)
      if (window.matchMedia('(max-width: 760px)').matches) onClose()
    }
  }

  return (
    <aside
      className={`chat ${open ? 'is-open' : ''}`}
      aria-label={`Chat with ${BOT_NAME}`}
      aria-hidden={!open}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose()
        }
      }}
    >
      <header className="chat__head">
        <span className="chat__avatar">
          <CatIcon />
        </span>
        <div className="chat__titles">
          <p className="chat__title">{BOT_NAME}</p>
          <p className="chat__sub">
            <span className="chat__online" /> Ask me about {profile.firstName} · EN / FR
          </p>
        </div>
        <button className="chat__close" onClick={onClose} aria-label="Hide chat" title="Hide">
          <Icon name="close" size={16} />
        </button>
      </header>

      <div className="chat__list" ref={listRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`msg msg--${m.from}`}>
            <p className="msg__text">
              <Rich text={m.text} />
            </p>
            {m.actions?.length > 0 && (
              <div className="msg__actions">
                {m.actions.map((a) =>
                  a.href ? (
                    <a
                      key={a.label}
                      className="msg__action"
                      href={a.href}
                      {...(a.download
                        ? { download: true }
                        : a.href.startsWith('http')
                          ? { target: '_blank', rel: 'noreferrer' }
                          : {})}
                    >
                      {a.label}
                    </a>
                  ) : (
                    <button key={a.label} className="msg__action" onClick={() => runAction(a)}>
                      {a.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="msg msg--bot msg--typing" aria-label={`${BOT_NAME} is typing`}>
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <form
        className="chat__form"
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          aria-label="Your question"
          maxLength={300}
        />
        <button type="submit" aria-label="Send" disabled={!input.trim() || typing}>
          <Icon name="send" size={16} />
        </button>
      </form>
    </aside>
  )
}
