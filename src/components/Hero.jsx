import Icon from './Icons.jsx'
import { profile, socials, stats } from '../data.js'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__text">
          {profile.available && (
            <span className="badge reveal">
              <span className="badge__dot" /> Open to opportunities
            </span>
          )}
          <p className="hero__hello mono reveal">Hi, my name is</p>
          <h1 className="hero__name reveal">{profile.name}.</h1>
          <h2 className="hero__role reveal">{profile.role}</h2>
          <p className="hero__tagline reveal">{profile.tagline}</p>

          <div className="hero__cta reveal">
            <a href="#projects" className="btn btn--primary">
              View my work <Icon name="arrow" size={16} />
            </a>
            <a href={profile.cv} className="btn btn--ghost" download>
              <Icon name="download" size={16} /> Download CV
            </a>
          </div>

          <div className="hero__meta reveal">
            <span className="hero__location">
              <Icon name="pin" size={15} /> {profile.location}
            </span>
            <div className="socials">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  className="icon-btn"
                  aria-label={s.label}
                  title={s.label}
                  target={s.url.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  <Icon name={s.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hero__card reveal" aria-hidden="true">
          <div className="terminal">
            <div className="terminal__bar">
              <span /> <span /> <span />
              <em>~/mohammed — python</em>
            </div>
            <pre className="terminal__body mono">
{`>>> from mohammed import Engineer
>>> me = Engineer()
>>> me.focus
`}<span className="t-str">['AI systems', 'Data pipelines', 'Web apps']</span>{`
>>> me.stack
`}<span className="t-str">['Python', 'LLMs', 'SQL', 'REST', 'C']</span>{`
>>> me.school
`}<span className="t-str">'1337 — 42 Network (UM6P)'</span>{`
>>> me.ship()
`}<span className="t-ok">✓ built end to end</span>{`
>>> `}<span className="cursor">▍</span>
            </pre>
          </div>
        </div>
      </div>

      <div className="container">
        <ul className="stats reveal">
          {stats.map((s) => (
            <li key={s.label}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
