// Kuro, the site's chat cat. It runs in the browser and answers questions
// about Mohammed from data.js: specific names first (projects, sites, tech),
// then keyword intents, then a retrieval step over all the facts.
import { profile, contacts, experience, projects, websites, skills, education, languages } from '../data.js'

export const BOT_NAME = 'Kuro'

const norm = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
const tokenize = (s) => norm(s).match(/[a-z0-9+#]+/g) || []

// Whole-word / whole-phrase match, so "rag" doesn't match "storage".
const words = (s) => ` ${norm(s).replace(/[^a-z0-9]+/g, ' ').trim()} `
const hasPhrase = (q, phrase) => q.includes(words(phrase))

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const list = (items) => items.map((x) => `• ${x}`).join('\n')
const first = profile.firstName

const STOP = new Set(
  'a an the is are was were be to of in on for and or with what whats who how his he him me my you your do does did can could about tell show give please le la les un une des de du et est que qui quoi quel quelle quels ses son sa il elle ce c'.split(
    ' '
  )
)

const contact = Object.fromEntries(contacts.map((c) => [c.icon, c]))
const CONTACT_ACTIONS = [
  contact.whatsapp && { label: 'Open WhatsApp', href: contact.whatsapp.url },
  contact.mail && { label: 'Send an email', href: contact.mail.url },
  contact.linkedin && { label: 'LinkedIn', href: contact.linkedin.url },
].filter(Boolean)

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

/* ---------- suggestions ---------- */

export const SUGGESTIONS = [
  { label: 'What are his skills?', ask: 'What are his skills?' },
  { label: 'Show me his projects', ask: 'Show me his projects' },
  { label: 'Is he available?', ask: 'Is he available for work?' },
  { label: 'How can I contact him?', ask: 'How can I contact him?' },
]

const MORE = [
  { label: 'Why hire him?', ask: 'Why should I hire him?' },
  { label: 'His AI work', ask: 'What AI work has he done?' },
  { label: 'What can he build for me?', ask: 'What can he build for me?' },
  { label: 'His experience', ask: 'Tell me about his experience' },
  { label: 'What is 1337?', ask: 'What is 1337?' },
  { label: 'Download his CV', ask: 'Send me his CV' },
  { label: 'Tell me a joke', ask: 'Tell me a joke' },
]

// Two follow-up ideas, different from what was just asked.
function followUps(exclude) {
  const pool = [...SUGGESTIONS, ...MORE].filter((s) => !exclude.includes(s.ask))
  const out = []
  while (out.length < 2 && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
  return out
}

/* ---------- intents (English, French and a little Darija) ---------- */
// Single words of 4+ letters also match as prefixes; phrases score double.
// Order breaks ties.

const INTENTS = [
  { id: 'bot', words: ['who are you', 'your name', 'are you a bot', 'are you ai', 'are you real', 'kuro', 'chatbot', 'robot', 't es qui', 'tu es qui', 'chkon nta', 'chkoun nta'] },
  { id: 'meow', words: ['meow', 'miaou', 'miaw', 'purr', 'cat', 'kitty', 'chat noir', 'mchicha'] },
  { id: 'joke', words: ['joke', 'funny', 'laugh', 'blague', 'drole', 'nokta'] },
  { id: 'personal', words: ['age', 'old', 'married', 'wife', 'girlfriend', 'religion', 'hobby', 'hobbies', 'birthday', 'family', 'marie', 'famille', 'loisir'] },
  { id: 'greet', words: ['hi', 'hello', 'hey', 'salam', 'salut', 'bonjour', 'yo', 'slm', 'coucou', 'hola', 'labas', 'ahlan', 'mrhba', 'marhaba', 'bonsoir'] },
  { id: 'thanks', words: ['thanks', 'thank', 'thx', 'merci', 'shukran', 'chokran', 'baraka', 'great', 'cool', 'nice', 'awesome'] },
  { id: 'bye', words: ['bye', 'goodbye', 'see you', 'ciao', 'bslama', 'beslama', 'au revoir', 'a plus'] },
  { id: 'cv', words: ['cv', 'resume', 'curriculum'] },
  { id: 'salary', words: ['salary', 'rate', 'price', 'pricing', 'cost', 'budget', 'pay', 'charge', 'salaire', 'tarif', 'prix', 'combien', 'chhal', 'ch7al'] },
  { id: 'remote', words: ['remote', 'relocate', 'relocation', 'onsite', 'on site', 'hybrid', 'travel', 'teletravail', 'distance', 'demenager'] },
  { id: 'response', words: ['reply', 'respond', 'response', 'quickly', 'hours', 'timezone', 'time zone', 'repond', 'rapide'] },
  { id: 'what1337', words: ['what is 1337', 'what s 1337', 'c est quoi 1337', 'quoi 1337', '42 network', 'what is 42', 'chno hiya 1337'] },
  { id: 'ai', words: ['ai', 'ia', 'ml', 'machine learning', 'deep learning', 'llm', 'gpt', 'model', 'neural', 'artificial', 'intelligence', 'data science', 'nlp'] },
  { id: 'strengths', words: ['why', 'hire', 'strength', 'strong', 'best', 'good at', 'stand out', 'value', 'pourquoi', 'force', 'atout', 'avantage', '3lach', 'alach'] },
  { id: 'services', words: ['service', 'offer', 'for me', 'help me', 'can he build', 'can he do', 'business', 'startup', 'propose', 'aider', 'faire pour'] },
  { id: 'site', words: ['this site', 'this website', 'this portfolio', 'built this', 'made this', 'ce site', 'how was', 'music', 'musique', 'song'] },
  { id: 'school', words: ['1337 project', '1337 projects', 'school project', 'school projects', 'c project', 'projet 1337', 'projets 1337', 'projets ecole'] },
  { id: 'years', words: ['how long', 'years', 'since when', 'timeline', 'depuis', 'annees'] },
  {
    id: 'contact',
    words: ['contact', 'reach', 'email', 'mail', 'phone', 'call', 'number', 'whatsapp', 'linkedin', 'github', 'message', 'joindre', 'contacter', 'telephone', 'numero', 'appeler', 'raqm', 'nhder', 'ntwasel'],
  },
  {
    id: 'available',
    words: ['available', 'availability', 'hiring', 'internship', 'intern', 'freelance', 'job', 'disponible', 'stage', 'opportunit', 'recrut', 'embauch', 'open', 'khdma'],
  },
  { id: 'langs', words: ['speak', 'spoken', 'arabic', 'french', 'english', 'langue', 'parle', 'arabe', 'anglais', 'francais', 'darija'] },
  {
    id: 'skills',
    words: ['skill', 'stack', 'tech', 'technolog', 'tool', 'know', 'programming', 'language', 'competence', 'outils', 'maitrise', 'expert', 'kay3ref', 'ya3ref'],
  },
  { id: 'websites', words: ['website', 'site', 'web', 'live site', 'vercel', 'sites'] },
  { id: 'projects', words: ['project', 'built', 'build', 'portfolio', 'made', 'work', 'projet', 'realis', 'cree', 'machari3', 'mashari3'] },
  { id: 'experience', words: ['experience', 'worked', 'career', 'company', 'role', 'position', 'emploi', 'poste', 'carriere', 'entreprise'] },
  { id: 'education', words: ['education', 'school', 'study', 'studied', 'university', 'degree', '1337', 'um6p', 'formation', 'ecole', 'etude', 'diplome', 'faculty', 'qra'] },
  { id: 'location', words: ['where', 'live', 'lives', 'based', 'location', 'city', 'country', 'morocco', 'casablanca', 'habite', 'maroc', 'ville', 'fin', 'fayn'] },
  { id: 'about', words: ['who', 'about', 'himself', 'introduce', 'summary', 'qui', 'presente', 'profil', 'mohammed', 'benamar', 'chkon'] },
]

function matchCount(q, tokens, intent) {
  let n = 0
  for (const w of intent.words) {
    if (w.includes(' ')) {
      if (hasPhrase(q, w)) n += 2
    } else if (tokens.some((t) => t === w || (w.length >= 4 && t.startsWith(w)))) n++
  }
  return n
}

/* ---------- answers ---------- */

const aiProjects = projects.filter((p) => p.category === 'ai')
const schoolProjects = projects.filter((p) => p.category === 'school')

const A = {
  greet: () => ({
    text: pick([
      `Hi! 👋 I'm ${BOT_NAME}, ${first}'s cat. Ask me about his skills, projects, experience, or how to reach him.`,
      `Salam! 🐾 I'm ${BOT_NAME}. What would you like to know about ${first}?`,
      `Hey there! I'm ${BOT_NAME}. I know everything about ${first}'s work. Go ahead, ask!`,
    ]),
    actions: SUGGESTIONS,
  }),
  thanks: () => ({ text: pick(["You're welcome! 🐾 Anything else?", 'Happy to help! Want to know more?', 'Purr… my pleasure. 😺']), actions: followUps([]) }),
  bye: () => ({ text: `Bye! 👋 Don't forget: WhatsApp is the fastest way to reach ${first}.`, actions: CONTACT_ACTIONS.slice(0, 1) }),
  bot: () => ({
    text: `I'm **${BOT_NAME}** 🐈‍⬛, ${first}'s black cat assistant. I live on this site and answer questions about his work. I'm not a big AI model, just a clever little cat who knows his portfolio by heart.`,
    actions: followUps([]),
  }),
  meow: () => ({
    text: pick([`Meow! 🐾 *purrs* Ask me anything about ${first}.`, 'Miaou ! 😺 What can I tell you?', `Mrrp? I'm listening… what do you want to know about ${first}?`]),
    actions: SUGGESTIONS.slice(0, 2),
  }),
  joke: () => ({
    text: pick([
      'Why do programmers prefer dark mode? Because light attracts bugs. 🐛',
      "I'd tell you a UDP joke, but you might not get it.",
      'My favourite data structure? A cat-alog. 🐈‍⬛',
      "There are 10 kinds of people: those who understand binary and those who don't.",
      'Why did the neural network go to therapy? Too many unresolved layers.',
    ]),
    actions: followUps(['Tell me a joke']),
  }),
  personal: () => ({
    text: `I only know ${first}'s professional side 🐾: skills, projects, experience. For anything personal, ask him directly!`,
    actions: CONTACT_ACTIONS.slice(0, 1),
  }),
  about: () => ({
    text: `**${profile.name}** is an **${profile.role}** based in ${profile.location}.\n\n${profile.summary[0]}`,
    actions: [{ label: 'About page', route: 'about' }, { label: 'See projects', route: 'build' }],
  }),
  skills: () => ({
    text: `Here's what ${first} works with:\n\n${skills.map((g) => `**${g.group}:** ${g.items.join(', ')}`).join('\n')}`,
    actions: [{ label: 'Skills page', route: 'skills' }, ...followUps(['What are his skills?'])],
  }),
  projects: () => ({
    text: `${first} has built ${projects.length} projects:\n\n${list(
      projects.map((p) => `**${p.title}**: ${p.description.split('.')[0]}.`)
    )}\n\nAsk me about any of them by name.`,
    actions: [{ label: 'See all projects', route: 'build' }],
  }),
  ai: () => ({
    text: `${first}'s AI / ML work:\n\n${list(aiProjects.map((p) => `**${p.title}**: ${p.description.split('.')[0]}.`))}${
      experience[0] ? `\n\nHe was also **${experience[0].role}** at ${experience[0].company}, building ML pipelines for prediction and anomaly detection.` : ''
    }`,
    actions: [{ label: 'See AI projects', route: 'build' }, ...followUps(['What AI work has he done?']).slice(0, 1)],
  }),
  school: () => ({
    text: `Projects from 1337:\n\n${list(schoolProjects.map((p) => `**${p.title}**: ${p.description.split('.')[0]}.`))}`,
    actions: [{ label: 'See projects', route: 'build' }],
  }),
  websites: () => ({
    text: `Live websites ${first} has shipped:\n\n${list(websites.map((w) => `**${w.name}**: ${w.type}`))}`,
    actions: websites.map((w) => ({ label: `Open ${w.name}`, href: w.url })),
  }),
  experience: () => ({
    text: experience.map((j) => `**${j.role}** · ${j.company} (${j.period})\n${j.points[0]}`).join('\n\n'),
    actions: [{ label: 'Career page', route: 'career' }, ...followUps(['Tell me about his experience']).slice(0, 1)],
  }),
  years: () => ({
    text: `${first}'s timeline:\n\n${list([
      ...experience.map((j) => `**${j.period}**: ${j.role} (${j.company})`),
      ...education.map((e) => `**${e.period}**: ${e.school}`),
    ])}`,
    actions: [{ label: 'Career page', route: 'career' }],
  }),
  education: () => ({
    text: list(education.map((e) => `**${e.school}**: ${e.detail}, ${e.place} (${e.period})`)),
    actions: [{ label: 'About page', route: 'about' }, { label: 'What is 1337?', ask: 'What is 1337?' }],
  }),
  what1337: () => ({
    text: `**1337** is a tuition-free coding school in Morocco, part of the **42 Network** and backed by **UM6P**. There are no teachers or lectures: students learn by building projects and reviewing each other's code. It's intense and very hands-on. ${first} trained there in Computer Science.`,
    actions: [{ label: 'His 1337 projects', ask: 'Show me his 1337 projects' }],
  }),
  langs: () => ({ text: `${first} speaks ${languages.map((l) => `**${l.name}** (${l.level})`).join(', ')}.` }),
  location: () => ({
    text: `${first} is based in **${profile.location}**, and open to remote work.`,
    actions: [{ label: 'Remote work?', ask: 'Is he open to remote work?' }],
  }),
  remote: () => ({
    text: `${first} is based in **${profile.location}** and open to **remote** work as well as on-site or hybrid roles. For relocation, the best is to ask him directly.`,
    actions: CONTACT_ACTIONS,
  }),
  response: () => ({
    text: `**WhatsApp** is the fastest: he usually replies quickly. Email and LinkedIn work too. He's in Morocco (GMT+1).`,
    actions: CONTACT_ACTIONS,
  }),
  salary: () => ({
    text: `That depends on the role or the project. The best is to talk about it directly with ${first}: he's flexible and happy to discuss.`,
    actions: CONTACT_ACTIONS,
  }),
  strengths: () => ({
    text: `Why ${first}? 🐾\n\n${list(
      [
        '**Ships end to end**: from data pipelines and LLM tools to the web interface.',
        `**Real AI work**: ${aiProjects.map((p) => p.title).join(', ')}.`,
        experience[0] ? `**Industry experience**: ${experience[0].role} at ${experience[0].company}.` : null,
        '**Trained at 1337 (42 Network)**: project-based, autonomous, learns new tools fast.',
        '**Freelance since 2024**: used to working directly with clients.',
      ].filter(Boolean)
    )}`,
    actions: [{ label: 'Download CV', href: profile.cv, download: true }, ...CONTACT_ACTIONS.slice(0, 1)],
  }),
  services: () => ({
    text: `What ${first} can build for you:\n\n${list([
      '**AI assistants & RAG chatbots** over your documents or data',
      '**Data pipelines & extraction**: messy sources (HTML, PDFs, APIs) into clean JSON / SQL',
      '**Dashboards & web apps** with React / Next.js',
      '**REST APIs & integrations** between your tools',
    ])}`,
    actions: CONTACT_ACTIONS,
  }),
  site: () => ({
    text: `This portfolio is built with **React + Vite**. I (${BOT_NAME}) run entirely in your browser, and the music streams from YouTube. You can drag, shrink or hide the music player.`,
    actions: followUps([]),
  }),
  available: () => ({
    text: profile.available
      ? `Yes! ${first} is **open to opportunities**: full-time roles, internships and freelance work in AI, data and web. WhatsApp or a call is the fastest way to reach him.`
      : `${first} isn't actively looking right now, but you can still get in touch.`,
    actions: CONTACT_ACTIONS,
  }),
  contact: () => ({
    text: `You can reach ${first} here:\n\n${list(contacts.map((c) => `**${c.label}:** ${c.value}`))}`,
    actions: [contact.phone && { label: 'Call', href: contact.phone.url }, ...CONTACT_ACTIONS].filter(Boolean),
  }),
  cv: () => ({
    text: `Sure, here's ${first}'s CV (PDF). 📄`,
    actions: [{ label: 'Download CV', href: profile.cv, download: true }],
  }),
}

function projectAnswer(p) {
  const actions = []
  if (p.links.live) actions.push({ label: 'Open live', href: p.links.live })
  if (p.links.github) actions.push({ label: 'See the code', href: p.links.github })
  return { text: `**${p.title}**\n\n${p.description}\n\n**Tech:** ${p.tech.join(', ')}`, actions }
}

function websiteAnswer(w) {
  return { text: `**${w.name}**: ${w.type}. It's live at ${new URL(w.url).hostname}.`, actions: [{ label: `Open ${w.name}`, href: w.url }] }
}

/* ---------- specific technologies ---------- */

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
        if (d === t || (t.length >= 4 && d.length >= 4 && (d.startsWith(t) || t.startsWith(d)))) {
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

/* ---------- main entry ---------- */

export function reply(question) {
  const q = words(question)
  const tokens = tokenize(question)
  if (!tokens.length) return A.greet()

  // A specific project or website by name.
  for (const p of projects) {
    if ([p.title, ...(ALIASES[p.title] || [])].some((n) => hasPhrase(q, n))) return projectAnswer(p)
  }
  for (const w of websites) {
    if ([w.name, ...(ALIASES[w.name] || [])].some((n) => hasPhrase(q, n))) return websiteAnswer(w)
  }

  // Best-matching intent.
  let bestId = null
  let bestN = 0
  for (const it of INTENTS) {
    const n = matchCount(q, tokens, it)
    if (n > bestN) {
      bestN = n
      bestId = it.id
    }
  }
  // A long message that only contains "hi" is probably a real question.
  if (bestId === 'greet' && tokens.length > 3) bestId = null

  // A specific technology ("does he know TensorFlow?"), unless the question is
  // clearly about something else.
  const SKIP_TECH = ['contact', 'cv', 'langs', 'location', 'bot', 'site', 'joke', 'salary', 'what1337', 'school', 'services', 'strengths']
  if (!SKIP_TECH.includes(bestId)) {
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
    text: pick([
      `Hmm, I'm not sure about that one. 🐾 I know ${first}'s skills, projects, experience, education, and how to contact him.`,
      `That's outside what this cat knows! Try asking about ${first}'s work.`,
      `Mrrp? I didn't catch that. Here are some things I can answer:`,
    ]),
    actions: [...SUGGESTIONS.slice(0, 2), ...MORE.slice(0, 2)],
  }
}

export function welcome() {
  return {
    text: `Hi! 👋 I'm **${BOT_NAME}**, ${first}'s black cat. Ask me anything about his work, in English or French.`,
    actions: [...SUGGESTIONS, MORE[0], MORE[1]],
  }
}
