import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { reply, welcome } from '../chat/bot.js'
import { profile } from '../data.js'

// Turn **bold** into <strong>; newlines are kept by CSS (white-space: pre-line).
function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
  )
}

export default function Chat({ open, onClose, onRoute }) {
  const [messages, setMessages] = useState(() => [{ from: 'bot', ...welcome() }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
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
      aria-label={`Chat about ${profile.firstName}`}
      aria-hidden={!open}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose()
        }
      }}
    >
      <header className="chat__head">
        <span className="chat__badge">
          <Icon name="chat" size={16} />
        </span>
        <div className="chat__titles">
          <p className="chat__title">Ask about {profile.firstName}</p>
          <p className="chat__sub">Skills, projects, contact · EN / FR</p>
        </div>
        <button className="chat__close" onClick={onClose} aria-label="Close chat">
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
          <div className="msg msg--bot msg--typing" aria-label="Typing">
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
