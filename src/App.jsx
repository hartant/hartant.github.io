import { useEffect } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import { About, Experience, Projects, Websites, Skills, Contact, Footer } from './components/Sections.jsx'

export default function App() {
  // Fade sections in as they scroll into view.
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Websites />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
