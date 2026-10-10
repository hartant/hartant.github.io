import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { music } from '../audio/music.js'

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const BARS = 26

// "Now playing" widget, bottom-left, with a live visualizer.
export default function Player({ onChange }) {
  const [st, setSt] = useState(music.state())
  const barsRef = useRef(null)

  useEffect(() => music.on(setSt), [])

  // Animate the visualizer and the clock while playing.
  useEffect(() => {
    let raf
    const data = new Uint8Array(64)
    const tick = () => {
      setSt(music.state())
      const el = barsRef.current
      if (el && st.playing) {
        music.bars(data)
        for (let i = 0; i < BARS; i++) {
          const v = data[Math.floor((i / BARS) * 40)] / 255
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
    music.toggle()
    onChange?.(music.playing)
  }

  return (
    <div className="player" role="region" aria-label="Music player">
      <p className="player__label">Now playing</p>
      <p className="player__title">{st.title}</p>
      <div className="player__bars" ref={barsRef} aria-hidden="true">
        {Array.from({ length: BARS }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="player__progress" aria-hidden="true">
        <span style={{ width: `${(st.elapsed / st.length) * 100}%` }} />
      </div>
      <div className="player__row">
        <button className="player__btn" onClick={() => music.prev()} aria-label="Previous track">
          <Icon name="prev" size={13} />
        </button>
        <button className="player__btn player__btn--main" onClick={toggle} aria-label={st.playing ? 'Pause music' : 'Play music'}>
          <Icon name={st.playing ? 'pause' : 'play'} size={13} />
        </button>
        <button className="player__btn" onClick={() => music.next()} aria-label="Next track">
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
          onChange={(e) => music.setVolume(Number(e.target.value))}
          aria-label="Volume"
        />
      </label>
    </div>
  )
}
