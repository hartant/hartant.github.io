import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { music } from '../audio/music.js'
import { playlist, YT_ELEMENT_ID } from '../audio/playlist.js'

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const BARS = 26
const MOBILE = '(max-width: 760px)'

function readJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}

// Keep the widget fully on screen.
function clamp(pos, el) {
  if (!pos || !el) return pos
  const w = el.offsetWidth
  const h = el.offsetHeight
  return {
    x: Math.min(Math.max(8, pos.x), window.innerWidth - w - 8),
    y: Math.min(Math.max(8, pos.y), window.innerHeight - h - 8),
  }
}

// "Now playing" widget. Drag it by the top strip, shrink it, or hide it.
export default function Player({ onChange }) {
  const [st, setSt] = useState(playlist.state())
  // full | mini | hidden
  const [mode, setMode] = useState(() => {
    const m = readJSON('playerMode', 'full')
    return m === 'hidden' ? 'full' : m
  })
  const [pos, setPos] = useState(() => readJSON('playerPos', null))
  const [mobile, setMobile] = useState(() => window.matchMedia(MOBILE).matches)
  const resumeOnShow = useRef(false)
  const boxRef = useRef(null)
  const barsRef = useRef(null)
  const drag = useRef(null)

  useEffect(() => playlist.on(setSt), [])

  useEffect(() => {
    const mq = window.matchMedia(MOBILE)
    const onChange = () => setMobile(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Re-fit the saved position when the window or the widget size changes.
  useEffect(() => {
    const fit = () => setPos((p) => clamp(p, boxRef.current))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [mode, st.kind])

  useEffect(() => writeJSON('playerMode', mode), [mode])

  // Animate the visualizer and the clock while playing.
  useEffect(() => {
    let raf
    const data = new Uint8Array(64)
    const tick = (t) => {
      const s = playlist.state()
      setSt(s)
      const el = barsRef.current
      if (el) {
        if (s.kind === 'synth') music.bars(data)
        for (let i = 0; i < BARS; i++) {
          // Real spectrum for synth tracks; a gentle wave for YouTube,
          // whose audio the page is not allowed to read.
          const v =
            s.kind === 'synth'
              ? data[Math.floor((i / BARS) * 40)] / 255
              : 0.2 + 0.55 * Math.abs(Math.sin(t / 260 + i * 0.7) * Math.cos(t / 410 + i * 0.3))
          el.children[i].style.transform = `scaleY(${Math.max(0.06, v)})`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    if (st.playing) raf = requestAnimationFrame(tick)
    else if (barsRef.current) [...barsRef.current.children].forEach((b) => (b.style.transform = 'scaleY(0.06)'))
    return () => cancelAnimationFrame(raf)
  }, [st.playing])

  const toggle = () => {
    playlist.toggle()
    onChange?.(playlist.playing)
  }

  // YouTube's player must stay visible while it plays, so hiding pauses it.
  const hide = () => {
    resumeOnShow.current = playlist.playing
    if (playlist.playing) playlist.pause()
    setMode('hidden')
  }

  const show = () => {
    setMode('full')
    if (resumeOnShow.current) playlist.play()
    resumeOnShow.current = false
  }

  /* ---------- dragging ---------- */
  const onPointerDown = (e) => {
    if (mobile || e.button > 0) return
    const rect = boxRef.current.getBoundingClientRect()
    drag.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* capture not available: dragging still works while the pointer stays on the strip */
    }
  }

  const onPointerMove = (e) => {
    if (!drag.current) return
    setPos(clamp({ x: e.clientX - drag.current.dx, y: e.clientY - drag.current.dy }, boxRef.current))
  }

  const onPointerUp = () => {
    if (!drag.current) return
    drag.current = null
    setPos((p) => {
      writeJSON('playerPos', p)
      return p
    })
  }

  const style = !mobile && pos ? { left: pos.x, top: pos.y, bottom: 'auto' } : undefined

  return (
    <>
      <div
        ref={boxRef}
        style={style}
        className={`player player--${mode} ${st.kind === 'yt' ? 'player--video' : ''}`}
        role="region"
        aria-label="Music player"
        aria-hidden={mode === 'hidden'}
      >
        <div className="player__top">
          <div
            className="player__grip"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            title="Drag to move"
          >
            <span className="player__label">{mode === 'mini' ? st.title : 'Now playing'}</span>
          </div>
          <button
            className="player__win"
            onClick={() => setMode(mode === 'mini' ? 'full' : 'mini')}
            aria-label={mode === 'mini' ? 'Expand player' : 'Make player smaller'}
            title={mode === 'mini' ? 'Expand' : 'Smaller'}
          >
            <Icon name={mode === 'mini' ? 'expand' : 'minus'} size={13} />
          </button>
          <button className="player__win" onClick={hide} aria-label="Hide player" title="Hide">
            <Icon name="close" size={13} />
          </button>
        </div>

        {/* YouTube's player lives here; kept mounted so it survives track and size changes */}
        <div className="player__video" aria-hidden={st.kind !== 'yt'}>
          <div id={YT_ELEMENT_ID} />
        </div>

        <div className="player__body">
          <p className="player__title">{st.title}</p>
          <div className="player__bars" ref={barsRef} aria-hidden="true">
            {Array.from({ length: BARS }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="player__progress" aria-hidden="true">
            <span style={{ width: `${st.length ? (st.elapsed / st.length) * 100 : 0}%` }} />
          </div>
          <div className="player__row">
            <button className="player__btn" onClick={() => playlist.prev()} aria-label="Previous track">
              <Icon name="prev" size={13} />
            </button>
            <button
              className="player__btn player__btn--main"
              onClick={toggle}
              aria-label={st.playing ? 'Pause music' : 'Play music'}
            >
              <Icon name={st.playing ? 'pause' : 'play'} size={13} />
            </button>
            <button className="player__btn" onClick={() => playlist.next()} aria-label="Next track">
              <Icon name="next" size={13} />
            </button>
            <span className="player__time">
              {fmt(st.elapsed)} / {fmt(st.length)}
            </span>
          </div>
          <label className="player__vol">
            <Icon name="volume" size={13} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={st.volume}
              onChange={(e) => playlist.setVolume(Number(e.target.value))}
              aria-label="Volume"
            />
          </label>
        </div>
      </div>

      {mode === 'hidden' && (
        <button className="player-fab" onClick={show} aria-label="Show music player" title="Show music player">
          <Icon name="music" size={20} />
        </button>
      )}
    </>
  )
}
