// A small chatbot that runs in the browser. It answers questions about
// Mohammed from data.js: keyword intents first, then a simple retrieval
// step (score every fact against the question, answer with the best one).
import { profile, contacts, experience, projects, websites, skills, education, languages } from '../data.js'

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
const tokenize = (s) => norm(s).match(/[a-z0-9+#]+/g) || []

// Whole-word / whole-phrase match, so "rag" doesn't match "storage".
const words = (s) => ` ${norm(s).replace(/[^a-z0-9]+/g, ' ').trim()} `
const hasPhrase = (q, phrase) => q.includes(words(phrase))


const STOP = new Set(
  'a an the is are was were be to of in on for and or with what whats who how his he him me my you your do does did can could about tell show give please le la les un une des de du et est que qui quoi quel quelle quels ses son sa il elle ce c est'.split(
    ' '
  )
)

const contact = Object.fromEntries(contacts.map((c) => [c.icon, c]))

// Extra names people may use for a project or website.
const ALIASES = {
  'RAG Against the Machine': ['rag', 'retrieval', 'rag against'],
  'Call Me Maybe': ['call me maybe', 'callmemaybe', 'function calling', 'function call'],
  'SCADA-IA — EcoEnergy Pioneers': ['scada', 'ecoenergy', 'eco energy', 'ocp', 'mindx'],
  Codexion: ['codexion', 'philosopher', 'dining'],
  'Fly-in': ['fly-in', 'fly in', 'flyin', 'drone'],
  'A-Maze-ing': ['maze', 'amazeing', 'a-maze'],
  'ContentCollective AI': ['contentcollective', 'content collective'],
}

// Intent keywords (English + French). Words of 4+ letters also match as prefixes.
const INTENTS = [
  { id: 'greet', words: ['hi', 'hello', 'hey', 'salam', 'salut', 'bonjour', 'yo', 'slm', 'coucou', 'hola'] },
  { id: 'thanks', words: ['thanks', 'thank', 'thx', 'merci', 'shukran', 'chokran', 'great', 'cool', 'nice'] },
  { id: 'cv', words: ['cv', 'resume', 'curriculum'] },
  {
    id: 'contact',
    words: ['contact', 'reach', 'email', 'mail', 'phone', 'call', 'number', 'whatsapp', 'linkedin', 'github', 'message', 'joindre', 'contacter', 'telephone', 'numero', 'appeler'],
  },
  {
    id: 'available',
    words: ['available', 'availability', 'hire', 'hiring', 'internship', 'intern', 'freelance', 'job', 'disponible', 'stage', 'opportunit', 'recrut', 'embauch', 'open'],
  },
  { id: 'langs', words: ['speak', 'spoken', 'arabic', 'french', 'english', 'langue', 'parle', 'arabe', 'anglais', 'francais'] },
  {
    id: 'skills',
    words: ['skill', 'stack', 'tech', 'technolog', 'tool', 'know', 'programming', 'language', 'python', 'react', 'competence', 'outils', 'maitrise', 'expert'],
  },
  { id: 'websites', words: ['website', 'site', 'web', 'live', 'client', 'vercel', 'sites'] },
  { id: 'projects', words: ['project', 'built', 'build', 'portfolio', 'made', 'work', 'projet', 'realis', 'cree'] },
  { id: 'experience', words: ['experience', 'job', 'worked', 'career', 'company', 'role', 'position', 'emploi', 'poste', 'carriere', 'entreprise'] },
  { id: 'education', words: ['education', 'school', 'study', 'studied', 'university', 'degree', '1337', '42', 'um6p', 'formation', 'ecole', 'etude', 'diplome', 'faculty'] },
  { id: 'location', words: ['where', 'based', 'live', 'location', 'city', 'country', 'morocco', 'casablanca', 'ou', 'habite', 'maroc', 'ville'] },
  { id: 'about', words: ['who', 'about', 'yourself', 'himself', 'introduce', 'summary', 'qui', 'presente', 'profil', 'mohammed', 'benamar'] },
]

function matchCount(tokens, words) {
  let n = 0
  for (const t of tokens) {
    if (words.some((w) => t === w || (w.length >= 4 && t.startsWith(w)))) n++
  }
  return n
}

const list = (items) => items.map((x) => `• ${x}`).join('\n')

const CONTACT_ACTIONS = [
  contact.whatsapp && { label: 'Open WhatsApp', href: contact.whatsapp.url },
  contact.mail && { label: 'Send an email', href: contact.mail.url },
  contact.linkedin && { label: 'LinkedIn', href: contact.linkedin.url },
].filter(Boolean)

/* ---------- answers ---------- */

const A = {
  greet: () => ({
    text: `Hi! 👋 I can tell you about ${profile.firstName}: his skills, projects, experience, or how to reach him. What would you like to know?`,
    actions: SUGGESTIONS,
  }),
  thanks: () => ({ text: "You're welcome! Anything else you'd like to know?", actions: SUGGESTIONS.slice(0, 3) }),
  about: () => ({
    text: `**${profile.name}** is an **${profile.role}** based in ${profile.location}.\n\n${profile.summary[0]}`,
    actions: [{ label: 'About page', route: 'about' }, { label: 'See projects', route: 'build' }],
  }),
  skills: () => ({
    text: `Here's what ${profile.firstName} works with:\n\n${skills.map((g) => `**${g.group}:** ${g.items.join(', ')}`).join('\n')}`,
    actions: [{ label: 'Skills page', route: 'skills' }],
  }),
  projects: () => ({
    text: `${profile.firstName} has built ${projects.length} projects:\n\n${list(
      projects.map((p) => `**${p.title}**: ${p.description.split('.')[0]}.`)
    )}\n\nAsk me about any of them by name.`,
    actions: [{ label: 'See all projects', route: 'build' }],
  }),
  websites: () => ({
    text: `Live websites ${profile.firstName} has shipped:\n\n${list(websites.map((w) => `**${w.name}**: ${w.type}`))}`,
    actions: websites.map((w) => ({ label: `Open ${w.name}`, href: w.url })),
  }),
  experience: () => ({
    text: experience
      .map((j) => `**${j.role}** · ${j.company} (${j.period})\n${j.points[0]}`)
      .join('\n\n'),
    actions: [{ label: 'Career page', route: 'career' }],
  }),
  education: () => ({
    text: list(education.map((e) => `**${e.school}**: ${e.detail}, ${e.place} (${e.period})`)),
    actions: [{ label: 'About page', route: 'about' }],
  }),
  langs: () => ({
    text: `${profile.firstName} speaks ${languages.map((l) => `**${l.name}** (${l.level})`).join(', ')}.`,
  }),
  location: () => ({
    text: `${profile.firstName} is based in **${profile.location}**, and open to remote work.`,
  }),
  available: () => ({
    text: profile.available
      ? `Yes! ${profile.firstName} is **open to opportunities**: full-time roles, internships and freelance work in AI, data and web. WhatsApp or a call is the fastest way to reach him.`
      : `${profile.firstName} isn't actively looking right now, but you can still get in touch.`,
    actions: CONTACT_ACTIONS,
  }),
  contact: () => ({
    text: `You can reach ${profile.firstName} here:\n\n${list(
      contacts.map((c) => `**${c.label}:** ${c.value}`)
    )}`,
    actions: [contact.phone && { label: 'Call', href: contact.phone.url }, ...CONTACT_ACTIONS].filter(Boolean),
  }),
  cv: () => ({
    text: `Sure, here's ${profile.firstName}'s CV (PDF).`,
    actions: [{ label: 'Download CV', href: profile.cv, download: true }],
  }),
}

export const SUGGESTIONS = [
  { label: 'What are his skills?', ask: 'What are his skills?' },
  { label: 'Show me his projects', ask: 'Show me his projects' },
  { label: 'Is he available?', ask: 'Is he available for work?' },
  { label: 'How can I contact him?', ask: 'How can I contact him?' },
]

function projectAnswer(p) {
  const actions = []
  if (p.links.live) actions.push({ label: 'Open live', href: p.links.live })
  if (p.links.github) actions.push({ label: 'See the code', href: p.links.github })
  return { text: `**${p.title}**\n\n${p.description}\n\n**Tech:** ${p.tech.join(', ')}`, actions }
}

function websiteAnswer(w) {
  return { text: `**${w.name}**: ${w.type}. It's live at ${new URL(w.url).hostname}.`, actions: [{ label: `Open ${w.name}`, href: w.url }] }
}

/* ---------- retrieval fallback ---------- */

const DOCS = [
  ...profile.summary.map((s) => ({ text: s, answer: () => ({ text: s }) })),
  ...experience.flatMap((j) =>
    j.points.map((pt) => ({
      text: `${j.role} ${j.company} ${j.tags.join(' ')} ${pt}`,
      answer: () => ({ text: `From his role as **${j.role}** at ${j.company}:\n\n${pt}`, actions: [{ label: 'Career page', route: 'career' }] }),
    }))
  ),
  ...projects.map((p) => ({ text: `${p.title} ${p.description} ${p.tech.join(' ')}`, answer: () => projectAnswer(p) })),
  ...skills.map((g) => ({
    text: `${g.group} ${g.items.join(' ')}`,
    answer: () => ({ text: `**${g.group}:** ${g.items.join(', ')}`, actions: [{ label: 'Skills page', route: 'skills' }] }),
  })),
]

const docTokens = DOCS.map((d) => new Set(tokenize(d.text).filter((t) => !STOP.has(t))))
const df = new Map()
docTokens.forEach((set) => set.forEach((t) => df.set(t, (df.get(t) || 0) + 1)))
const idf = (t) => Math.log((DOCS.length + 1) / ((df.get(t) || 0) + 0.5))

function retrieve(tokens) {
  const q = tokens.filter((t) => !STOP.has(t) && t.length > 2)
  let best = null
  let bestScore = 0
  docTokens.forEach((set, i) => {
    let score = 0
    for (const t of q) {
      for (const d of set) {
        if (d === t || (t.length >= 4 && (d.startsWith(t) || t.startsWith(d)) && d.length >= 4)) {
          score += idf(d)
          break
        }
      }
    }
    if (score > bestScore) {
      bestScore = score
      best = DOCS[i]
    }
  })
  return { doc: bestScore >= 1.8 ? best : null, score: bestScore }
}

/* ---------- specific technologies ---------- */

// Every skill / tech name, with simple variants ("Git / GitHub" -> git, github).
const TECH = new Map()
const addTech = (name, group) => {
  for (const part of name.split('/').map((x) => x.trim())) {
    if (part.replace(/[^a-z0-9]/gi, '').length < 2) continue
    const key = words(part)
    if (!TECH.has(key)) TECH.set(key, { name: part, group })
  }
}
skills.forEach((g) => g.items.forEach((it) => addTech(it, g.group)))
projects.forEach((p) => p.tech.forEach((t) => addTech(t, null)))
experience.forEach((j) => j.tags.forEach((t) => addTech(t, null)))

function techAnswer(t) {
  const lower = t.name.toLowerCase()
  const usedIn = [
    ...projects.filter((p) => p.tech.some((x) => x.toLowerCase().includes(lower))).map((p) => p.title),
    ...experience.filter((j) => j.tags.some((x) => x.toLowerCase().includes(lower))).map((j) => `${j.role} (${j.company})`),
  ]
  let text = `Yes, **${t.name}**`
  text += t.group ? ` is part of his **${t.group}** skills.` : ` is in his toolkit.`
  if (usedIn.length) text += `\n\nHe used it in:\n${list(usedIn.map((x) => `**${x}**`))}`
  return { text, actions: [{ label: 'Skills page', route: 'skills' }, { label: 'See projects', route: 'build' }] }
}

/* ---------- main entry ---------- */

export function reply(question) {
  const q = words(question)
  const tokens = tokenize(question)
  if (!tokens.length) return A.greet()

  // A specific project or website by name.
  for (const p of projects) {
    const names = [p.title, ...(ALIASES[p.title] || [])]
    if (names.some((n) => hasPhrase(q, n))) return projectAnswer(p)
  }
  for (const w of websites) {
    const names = [w.name, ...(ALIASES[w.name] || [])]
    if (names.some((n) => hasPhrase(q, n))) return websiteAnswer(w)
  }

  // Best-matching intent.
  let bestId = null
  let bestN = 0
  for (const it of INTENTS) {
    const n = matchCount(tokens, it.words)
    if (n > bestN) {
      bestN = n
      bestId = it.id
    }
  }
  // A long message that only contains "hi" is probably a real question.
  if (bestId === 'greet' && tokens.length > 3) bestId = null

  // A specific technology ("does he know TensorFlow?"), unless it's clearly
  // about contact details, the CV or spoken languages.
  if (!['contact', 'cv', 'langs', 'location'].includes(bestId)) {
    for (const [key, t] of TECH) {
      if (q.includes(key)) return techAnswer(t)
    }
  }

  // A strong match in the facts beats a single generic keyword.
  const found = retrieve(tokens)
  if (found.doc && found.score >= 3 && bestN <= 1) return found.doc.answer()

  if (bestId) return A[bestId]()
  if (found.doc) return found.doc.answer()

  return {
    text: `I'm not sure about that one. I can answer questions about ${profile.firstName}'s skills, projects, experience, education, or how to contact him.`,
    actions: SUGGESTIONS,
  }
}

export function welcome() {
  return {
    text: `Hi! 👋 I'm ${profile.firstName}'s assistant. Ask me anything about his work, in English or French.`,
    actions: SUGGESTIONS,
  }
}
