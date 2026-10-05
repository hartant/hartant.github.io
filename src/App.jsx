import { useEffect, useState } from 'react'
import Rail, { sections } from './components/Rail.jsx'
import Intro from './components/Intro.jsx'
import { Experience, Projects, Websites, Skills, Contact, Footer } from './components/Sections.jsx'

export default function App() {
  const [active, setActive] = useState('intro')
  // index.html sets the starting theme before React loads (no flash).
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'light' ? '#f6f7fb' : '#06080d'
    )
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  // Highlight the section currently in the middle of the screen.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean)
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="layout">
      <Rail
        active={active}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />
      <main className="content">
        <Intro />
        <Experience />
        <Projects />
        <Websites />
        <Skills />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}
