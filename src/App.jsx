import { useEffect, useState } from 'react'
import Rail, { sections } from './components/Rail.jsx'
import Intro from './components/Intro.jsx'
import { Experience, Projects, Websites, Skills, Contact, Footer } from './components/Sections.jsx'

export default function App() {
  const [active, setActive] = useState('intro')

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
      <Rail active={active} />
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
