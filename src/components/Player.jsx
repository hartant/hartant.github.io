import { useEffect, useRef, useState } from 'react'
import Icon from './Icons.jsx'
import { music } from '../audio/music.js'
import { playlist, YT_ELEMENT_ID } from '../audio/playlist.js'

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const BARS = 26

// "Now playing" widget, bottom-left, with a visualizer.
export default function Player({ onChange }) {
  const [st, setSt] = useState(playlist.state())
  const barsRef = useRef(null)

  useEffect(() => playlist.on(setSt), [])

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
          // Real spectrum for the synth tracks; a gentle wave for YouTube,
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

  return (
    <div className={`player ${st.kind === 'yt' ? 'player--video' : ''}`} role="region" aria-label="Music player">
      {/* YouTube's player lives here; kept mounted so it survives track changes */}
      <div className="player__video" aria-hidden={st.kind !== 'yt'}>
        <div id={YT_ELEMENT_ID} />
      </div>
      <div className="player__body">
        <p className="player__label">Now playing</p>
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
  )
}
