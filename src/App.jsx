import { useCallback, useEffect, useState } from 'react'
import Start from './components/Start.jsx'
import Menu from './components/Menu.jsx'
import Player from './components/Player.jsx'
import TopBar from './components/TopBar.jsx'
import { PAGES, Page } from './components/Pages.jsx'
import { music } from './audio/music.js'

function routeFromHash() {
  const id = window.location.hash.replace(/^#\/?/, '')
  return PAGES.some((p) => p.id === id) ? id : 'home'
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function readPref(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

function writePref(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* storage unavailable */
  }
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [musicOn, setMusicOn] = useState(() => readPref('music', 'on') === 'on')
  const [route, setRoute] = useState(routeFromHash)
  const [selected, setSelected] = useState(0)
  const [wipe, setWipe] = useState(false)
  // index.html sets the starting theme before React loads (no flash).
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#2f86ee' : '#08112a')
    writePref('theme', theme)
  }, [theme])

  useEffect(() => {
    const onHash = () => {
      const r = routeFromHash()
      setRoute((prev) => {
        // Coming back to the menu: keep the item you came from selected.
        if (r === 'home' && prev !== 'home') setSelected(PAGES.findIndex((p) => p.id === prev))
        return r
      })
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const begin = useCallback(() => {
    setStarted(true)
    if (musicOn) music.play()
  }, [musicOn])

  const toggleMusicPref = () => {
    const next = !musicOn
    setMusicOn(next)
    writePref('music', next ? 'on' : 'off')
  }

  // Navigate with a short slanted wipe between screens.
  const go = useCallback((id) => {
    const hash = id ? `#/${id}` : '#/'
    if (reducedMotion()) {
      window.location.hash = hash
      return
    }
    setWipe(true)
    setTimeout(() => {
      window.location.hash = hash
    }, 320)
    setTimeout(() => setWipe(false), 700)
  }, [])

  // Keyboard: arrows + Enter on the menu, Esc / Backspace to go back.
  useEffect(() => {
    if (!started) return
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      if (e.target.matches?.('input')) return
      if (route === 'home') {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault()
          setSelected((s) => (s + 1) % PAGES.length)
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault()
          setSelected((s) => (s - 1 + PAGES.length) % PAGES.length)
        } else if (e.key === 'Enter' && document.activeElement === document.body) {
          go(PAGES[selected].id)
        }
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault()
        go(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [started, route, selected, go])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="app">
      <div className="water" aria-hidden="true" />
      {!started ? (
        <Start musicOn={musicOn} onToggleMusic={toggleMusicPref} onContinue={begin} />
      ) : (
        <>
          <TopBar theme={theme} onToggleTheme={toggleTheme} />
          {route === 'home' ? (
            <Menu selected={selected} onSelect={setSelected} onOpen={go} />
          ) : (
            <Page id={route} onBack={() => go(null)} />
          )}
          <Player
            onChange={(playing) => {
              setMusicOn(playing)
              writePref('music', playing ? 'on' : 'off')
            }}
          />
        </>
      )}
      <div className={`wipe ${wipe ? 'is-on' : ''}`} aria-hidden="true" />
    </div>
  )
}
