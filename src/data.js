// ============================================================
//  All the content of the site lives here.
//  Edit this file to change text, add projects, or update links.
// ============================================================

export const profile = {
  name: 'Mohammed Benamar',
  firstName: 'Mohammed',
  role: 'Full-Stack / Software Engineer',
  location: 'Casablanca-Settat, Morocco',
  email: 'simoben3502@gmail.com',
  cv: 'CV_Mohammed_Benamar.pdf', // file inside /public
  available: true, // shows the "Open to opportunities" badge
  tagline:
    'I build data pipelines, AI systems and web apps — turning messy, unstructured data into something clean and usable.',
  summary: [
    'Full-stack software engineer with a strong focus on Python and data. I build pipelines that pull structured information out of messy sources and turn it into something usable — HTML parsing, regex-based extraction, REST APIs and JSON data.',
    'I trained at 1337 (42 Network – UM6P), and I have hands-on experience with LLM-powered systems such as Retrieval-Augmented Generation and natural-language function calling. I pick up new tools quickly, and I ship what I build: solo, end to end, from back-end logic to front-end interfaces.',
  ],
}

export const socials = [
  { label: 'GitHub', url: 'https://github.com/hartant', icon: 'github' },
  { label: 'Email', url: 'mailto:simoben3502@gmail.com', icon: 'mail' },
]

export const stats = [
  { value: '1337', label: '42 Network – UM6P' },
  { value: '2024', label: 'Freelancing since' },
  { value: '3', label: 'Languages spoken' },
]

export const experience = [
  {
    role: 'AI Developer',
    company: 'MindX Challenge × OCP Group',
    team: 'EcoEnergy Pioneers',
    location: 'Casablanca',
    period: 'Dec 2025 – Mar 2026',
    points: [
      'Built a data pipeline for an industrial IoT + Machine Learning platform: ingested raw sensor data, cleaned and transformed it, and fed it into prediction and anomaly-detection models — an end-to-end ETL workflow.',
      'Worked with real-time data caching and structured JSON outputs to keep the dashboard fast and reliable.',
    ],
    tags: ['Python', 'ETL', 'Machine Learning', 'IoT'],
  },
  {
    role: 'Freelance Web Developer',
    company: 'Self-employed',
    location: 'Remote',
    period: '2024 – Present',
    points: [
      'Built and integrated REST APIs and data-driven features into client websites, working directly with JSON data and HTML/DOM structures.',
      "Worked independently across the full stack, learning new tools and libraries quickly to match each project's needs.",
    ],
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
  },
]

// category must be one of: 'ai' | 'web' | 'school'
// links: add { github: '...', live: '...' } — leave out what you don't have.
export const projects = [
  {
    title: 'RAG Against the Machine',
    category: 'ai',
    description:
      'A Retrieval-Augmented Generation system for codebase Q&A. It indexes and chunks source data, retrieves the most relevant context, and uses an LLM to generate accurate answers from unstructured content.',
    tech: ['Python', 'LLM', 'Embeddings', 'Vector Search', 'FAISS', 'Chunking'],
    links: { github: 'https://github.com/hartant/RAG' },
    featured: true,
  },
  {
    title: 'Call Me Maybe',
    category: 'ai',
    description:
      'Turns natural-language prompts into structured function calls with a small local LLM (Qwen3-0.6B). Constrained decoding with a token-level trie guarantees valid, schema-compliant JSON every time.',
    tech: ['Python', 'LLM', 'Constrained Decoding', 'JSON'],
    links: { github: 'https://github.com/hartant/call_me_baby' },
    featured: true,
  },
  {
    title: 'SCADA-IA — EcoEnergy Pioneers',
    category: 'ai',
    description:
      'Real-time supervision dashboard for an industrial cogeneration site (steam, electricity, water treatment): animated process diagram, ML-based predictions and anomaly detection, email alerts and a what-if simulator. Built for the MindX × OCP challenge.',
    tech: ['Next.js', 'TypeScript', 'Python', 'Machine Learning', 'IoT'],
    links: {
      github: 'https://github.com/hartant/ECOENERGY-PIONEERS',
      live: 'https://ecoenergy-pioneers-583a.vercel.app/',
    },
    featured: true,
  },

  // ---------- 1337 / SCHOOL PROJECTS ----------
  {
    title: 'Codexion',
    category: 'school',
    description:
      'A multithreaded take on the Dining Philosophers problem: POSIX threads share limited resources using mutexes and condition variables, with a min-heap scheduler (FIFO / EDF) and a monitor thread for millisecond-precise shutdown.',
    tech: ['C', 'pthreads', 'Concurrency', 'Min-heap'],
    links: { github: 'https://github.com/hartant/codexion-' },
  },
  {
    title: 'Fly-in',
    category: 'school',
    description:
      'Drone routing simulation: parses a custom map format from scratch, builds a graph, plans routes with a custom Dijkstra-based algorithm under capacity constraints, and animates the fleet turn by turn in pygame.',
    tech: ['Python', 'Dijkstra', 'Graphs', 'pygame'],
    links: { github: 'https://github.com/hartant/fly_in' },
  },
  {
    title: 'A-Maze-ing',
    category: 'school',
    description:
      'Configurable maze generator and solver: builds perfect or looped mazes with a recursive backtracker, embeds a "42" pattern, finds the shortest path with BFS, and renders it in an interactive terminal UI.',
    tech: ['Python', 'DFS / BFS', 'Algorithms', 'curses'],
    links: { github: 'https://github.com/hartant/a-maze-ing' },
  },
]

// ---------- WEBSITES YOU BUILT (shown as clickable logos) ----------
// name:  the site / client name
// url:   the live website — clicking the logo opens it in a new tab
// logo:  put the logo image in  public/logos/  and write its file name here,
//        e.g. 'logos/my-client.png' (PNG or SVG with a transparent background looks best).
//        If you leave logo out, the site's initials are shown instead.
// type:  optional short label, e.g. 'E-commerce', 'Restaurant', 'Landing page'
export const websites = [
  {
    name: 'ContentCollective AI',
    url: 'https://contentcollective-ai.vercel.app/',
    type: 'AI course landing page',
    logo: 'logos/contentcollective-ai.svg',
  },
  {
    name: 'EcoEnergy Pioneers',
    url: 'https://ecoenergy-pioneers-583a.vercel.app/',
    type: 'Industrial SCADA dashboard',
    logo: 'logos/ecoenergy-pioneers.svg',
  },
]

export const projectFilters = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Data' },
  { id: 'school', label: '1337 / School' },
]

export const skills = [
  {
    group: 'Languages',
    items: ['Python', 'C', 'SQL', 'JavaScript', 'Shell Scripting'],
  },
  {
    group: 'AI & Data',
    items: ['LLM-Assisted Extraction', 'RAG', 'Data Pipelines / ETL', 'Scikit-learn', 'TensorFlow'],
  },
  {
    group: 'Web & APIs',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'JSON', 'HTML Parsing', 'Web Scraping', 'Regex / Pattern Matching'],
  },
  {
    group: 'Tools & Fundamentals',
    items: ['Git / GitHub', 'Linux', 'Algorithms', 'Data Structures'],
  },
]

export const education = [
  {
    school: '1337 (42 Network) – UM6P',
    detail: 'Computer Science — Coding School',
    place: 'Ben Guerir',
    period: '2025',
  },
  {
    school: 'Faculty of Law, Economics and Social Sciences',
    detail: 'Foundation year',
    place: 'Meknes',
    period: '1 year',
  },
]

export const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'English', level: 'B2' },
  { name: 'French', level: 'B2' },
]
