import { useCallback, useEffect, useState } from 'react'
import Menu from './components/Menu.jsx'
import { PAGES, Page } from './components/Pages.jsx'

function routeFromHash() {
  const id = window.location.hash.replace(/^#\/?/, '')
  return PAGES.some((p) => p.id === id) ? id : 'home'
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
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
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
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
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
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
  }, [route, selected, go])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <div className="app">
      <div className="water" aria-hidden="true" />
      {route === 'home' ? (
        <Menu
          selected={selected}
          onSelect={setSelected}
          onOpen={go}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <Page id={route} onBack={() => go(null)} theme={theme} onToggleTheme={toggleTheme} />
      )}
      <div className={`wipe ${wipe ? 'is-on' : ''}`} aria-hidden="true" />
    </div>
  )
}
