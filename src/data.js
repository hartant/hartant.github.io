// ============================================================
//  All the content of the site lives here.
//  Edit this file to change text, add projects, or update links.
// ============================================================

export const profile = {
  name: 'Mohammed Benamar',
  firstName: 'Mohammed',
  role: 'AI / ML Developer',
  headline: 'AI / ML Developer · Python · LLM & Data',
  location: 'Casablanca, Morocco',
  website: 'https://hartant.github.io',
  email: 'simoben3502@gmail.com',
  cv: 'CV_Mohammed_Benamar.pdf', // file inside /public
  available: true, // shows the "Open to opportunities" badge
  tagline:
    'I build working LLM systems end to end in Python: RAG, function calling and data pipelines that turn messy data into answers.',
  summary: [
    'AI/ML developer and software engineering student at 1337 (42 Network – UM6P). I build working LLM systems end to end in Python: a Retrieval-Augmented Generation (RAG) system that answers questions over a codebase of nearly 2,000 files, and a function-calling tool that guarantees valid JSON through constrained decoding.',
    'I also have experience with data pipelines (ETL), machine learning for anomaly detection, and full-stack web development. I learn fast and ship prototypes that work, even under tight constraints.',
  ],
}

// Small icon links shown in the side panel.
export const socials = [
  { label: 'GitHub', url: 'https://github.com/hartant', icon: 'github' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mohammed-benamar-66abb1372/', icon: 'linkedin' },
  { label: 'WhatsApp', url: 'https://wa.me/212656202902', icon: 'whatsapp' },
  { label: 'Email', url: 'mailto:simoben3502@gmail.com', icon: 'mail' },
]

// Big contact cards in the Contact section.
export const contacts = [
  { label: 'Phone', value: '+212 6 56 20 29 02', url: 'tel:+212656202902', icon: 'phone' },
  { label: 'WhatsApp', value: 'Chat with me', url: 'https://wa.me/212656202902', icon: 'whatsapp' },
  { label: 'LinkedIn', value: 'Mohammed Benamar', url: 'https://www.linkedin.com/in/mohammed-benamar-66abb1372/', icon: 'linkedin' },
  { label: 'GitHub', value: '@hartant', url: 'https://github.com/hartant', icon: 'github' },
  { label: 'Email', value: 'simoben3502@gmail.com', url: 'mailto:simoben3502@gmail.com', icon: 'mail' },
]

// Key results, shown as big numbers on the About page.
export const highlights = [
  { value: '1,941', label: 'files indexed by the RAG system' },
  { value: '82%', label: 'Recall@5 on documentation' },
  { value: '100%', label: 'valid JSON from a 0.6B model' },
  { value: '~25 s', label: 'to answer 200 questions' },
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
      'Built the data pipeline for an industrial IoT platform: ingested raw sensor data, cleaned and transformed it, and fed it into prediction and anomaly-detection models (end-to-end ETL).',
      'Developed a real-time monitoring dashboard with email alerts and a what-if simulator, using data caching and structured JSON outputs.',
    ],
    tags: ['Python', 'ETL', 'Machine Learning', 'IoT', 'Next.js'],
  },
  {
    role: 'Freelance Web Developer',
    company: 'Self-employed',
    location: 'Remote',
    period: '2024 – Present',
    points: [
      'Built and integrated REST APIs and data-driven features into client websites (JSON, HTML/DOM).',
      'Delivered complete projects on my own, from back end to front end, picking up new tools quickly.',
    ],
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
  },
]

// category must be one of: 'ai' | 'web' | 'school'
// links: add { github: '...', live: '...' } — leave out what you don't have.
export const projects = [
  {
    title: 'RAG Against the Machine',
    subtitle: 'Question answering over a codebase',
    category: 'ai',
    description:
      'End-to-end RAG pipeline that indexes the vLLM repository (1,941 files, 13,126 chunks), retrieves relevant passages with BM25, and generates grounded answers with a local LLM. Code-aware chunking splits Python files at functions and classes (ast module) and Markdown at headers.',
    tech: ['Python', 'BM25', 'Hugging Face Transformers', 'Qwen3-0.6B', 'Pydantic', 'Python Fire'],
    // Short results, shown as badges.
    highlights: ['82% Recall@5 on docs', '61% Recall@5 on code', 'Indexed in ~24 s', '200 queries in ~25 s'],
    links: { github: 'https://github.com/hartant/RAG' },
    featured: true,
  },
  {
    title: 'Call Me Maybe',
    subtitle: 'Function calling with LLMs',
    category: 'ai',
    description:
      'Turns natural-language prompts into structured function calls, e.g. "sum of 2 and 3" → fn_add_numbers(a=2, b=3). Constrained decoding built from scratch: a token-level trie for function names and token masking for numbers, booleans and JSON structure. Data is validated with Pydantic, and errors are handled per prompt so one failure never stops the batch.',
    tech: ['Python', 'Qwen3-0.6B', 'NumPy', 'Pydantic', 'uv', 'mypy', 'flake8'],
    highlights: ['100% valid JSON', '0.6B-parameter model', 'Constrained decoding from scratch'],
    links: { github: 'https://github.com/hartant/call_me_baby' },
    featured: true,
  },
  {
    title: 'SCADA-IA — EcoEnergy Pioneers',
    subtitle: 'Industrial IoT monitoring with ML',
    category: 'ai',
    description:
      'Industrial IoT platform for the MindX × OCP challenge: a data pipeline from raw sensor data to prediction and anomaly-detection models, plus a real-time supervision dashboard (steam, electricity, water treatment) with an animated process diagram, email alerts and a what-if simulator.',
    tech: ['Python', 'ETL', 'Machine Learning', 'Next.js', 'TypeScript', 'IoT'],
    highlights: ['End-to-end ETL', 'Anomaly detection', 'Real-time alerts'],
    links: {
      github: 'https://github.com/hartant/ECOENERGY-PIONEERS',
      live: 'https://ecoenergy-pioneers-583a.vercel.app/',
    },
    featured: true,
  },

  // ---------- 1337 / SCHOOL PROJECTS ----------
  {
    title: 'Codexion',
    subtitle: 'Multithreaded scheduler in C',
    category: 'school',
    description:
      'A multithreaded take on the Dining Philosophers problem: POSIX threads share limited resources using mutexes and condition variables, with a min-heap scheduler (FIFO / EDF) and a monitor thread for millisecond-precise shutdown.',
    tech: ['C', 'pthreads', 'Concurrency', 'Min-heap'],
    links: { github: 'https://github.com/hartant/codexion-' },
  },
  {
    title: 'Fly-in',
    subtitle: 'Drone routing simulation',
    category: 'school',
    description:
      'Drone routing simulation: parses a custom map format from scratch, builds a graph, plans routes with a custom Dijkstra-based algorithm under capacity constraints, and animates the fleet turn by turn in pygame.',
    tech: ['Python', 'Dijkstra', 'Graphs', 'pygame'],
    links: { github: 'https://github.com/hartant/fly_in' },
  },
  {
    title: 'A-Maze-ing',
    subtitle: 'Maze generator and solver',
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
  { group: 'Languages', items: ['Python', 'C', 'SQL', 'JavaScript', 'TypeScript', 'Shell'] },
  {
    group: 'AI & Machine Learning',
    items: ['LLM', 'RAG', 'Function Calling', 'Constrained Decoding', 'Hugging Face Transformers', 'PyTorch', 'Scikit-learn', 'TensorFlow', 'Anomaly Detection'],
  },
  {
    group: 'Data & Retrieval',
    items: ['Data Pipelines / ETL', 'BM25', 'TF-IDF', 'Recall@k', 'Pydantic', 'JSON', 'Web Scraping', 'Regex'],
  },
  { group: 'Web & APIs', items: ['React', 'Next.js', 'Tailwind CSS', 'REST APIs', 'HTML/CSS'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'Linux', 'uv', 'Makefile', 'mypy', 'flake8', 'pytest'] },
]

export const softSkills = ['Problem solving', 'Fast learner', 'Self-driven', 'Teamwork & peer review']


export const education = [
  {
    school: '1337 (42 Network) – UM6P',
    detail: 'Software Engineering / Computer Science',
    place: 'Ben Guerir',
    period: '2025 – Present',
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
