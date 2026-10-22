/**
 * ---------------------------------------------------------------------------
 *  AURA — single source of truth for every word on the site.
 *  Edit this file and the whole 3D experience updates. Nothing else to touch.
 * ---------------------------------------------------------------------------
 */

export const PROFILE = {
  firstName: 'FARHAN',
  lastName: 'HASHMI',
  fullName: 'Syed Farhan Hashmi',
  role: 'Computer Science Student · RV College of Engineering',
  tagline: 'CS student building real systems in Java and Python — from a Swing GUI wired to MySQL, down to the data structures underneath.',
  location: 'Bengaluru, India',
  email: 'farhan.hashmi@example.com',
  availability: 'Open to internships',
  github: 'https://github.com/S-Farhan-Hashmi',
  linkedin: 'https://www.linkedin.com/in/s-farhan-hashmi/',
  resume: '/farhan-resume.pdf',
  bio: [
    'Computer Science student at RV College of Engineering, currently in my 2nd semester with a CGPA of 9.85 / 10. Strong foundations in Java, Python, and Data Structures, with real shipped projects rather than just coursework.',
    'I like the part where a design decision has consequences: object-oriented structure that keeps a booking system scalable, a database schema that survives a restart, or a CLI that stays clean once it grows past a hundred lines.',
  ],
  socials: [
    { label: 'GitHub', handle: '@S-Farhan-Hashmi', href: 'https://github.com/S-Farhan-Hashmi' },
    { label: 'LinkedIn', handle: 'in/s-farhan-hashmi', href: 'https://www.linkedin.com/in/s-farhan-hashmi/' },
    { label: 'Resume', handle: 'Download PDF', href: '/farhan-resume.pdf' },
    { label: 'Email', handle: 'farhan.hashmi@example.com', href: 'mailto:farhan.hashmi@example.com' },
  ],
  stats: [
    { value: '9.85', label: 'CGPA / 10' },
    { value: '4', label: 'Projects shipped' },
    { value: '3', label: 'Languages' },
    { value: '2nd', label: 'Semester CS' },
  ],
} as const

export type Skill = {
  name: string
  category: 'Engine' | 'Craft' | 'Ship'
  level: number
}

export const SKILLS: Skill[] = [
  { name: 'Java (OOP)', category: 'Engine', level: 86 },
  { name: 'Multithreading', category: 'Engine', level: 72 },
  { name: 'Python (OOP)', category: 'Engine', level: 83 },
  { name: 'C', category: 'Engine', level: 68 },
  { name: 'Data Structures', category: 'Engine', level: 84 },
  { name: 'Algorithms', category: 'Engine', level: 82 },
  { name: 'Bit Manipulation', category: 'Craft', level: 70 },
  { name: 'NumPy', category: 'Craft', level: 74 },
  { name: 'Pandas', category: 'Craft', level: 73 },
  { name: 'Matplotlib', category: 'Craft', level: 68 },
  { name: 'MySQL', category: 'Ship', level: 78 },
  { name: 'Git & GitHub', category: 'Ship', level: 80 },
]

export const TOOLING = ['VS Code', 'IntelliJ IDEA', 'PyCharm', 'JDBC', 'Java Swing', 'Scikit-learn']

export type Project = {
  title: string
  tag: string
  year: string
  description: string
  stack: string[]
  metric: string
  metricLabel: string
  accent: string
  href: string
}

export const PROJECTS: Project[] = [
  {
    title: 'Airline Management System',
    tag: 'Flagship',
    year: '2025',
    description:
      'A full airline application with account creation, transactions and record management. Swing GUI over a JDBC-wired MySQL backend, covering booking, cancelling and live flight tracking.',
    stack: ['Java', 'JDBC', 'Swing', 'MySQL'],
    metric: '5',
    metricLabel: 'modules · OOP architecture',
    accent: '#7c5cff',
    href: 'https://github.com/S-Farhan-Hashmi',
  },
  {
    title: 'Password Manager',
    tag: 'Security',
    year: '2025',
    description:
      'Secure credential vault behind a single master-password gate. File-backed persistence with search built for fast retrieval across a growing store.',
    stack: ['Python', 'File I/O', 'OOP'],
    metric: '1',
    metricLabel: 'master password, full vault',
    accent: '#22d3ee',
    href: 'https://github.com/S-Farhan-Hashmi',
  },
  {
    title: 'Task Manager CLI',
    tag: 'Tooling',
    year: '2025',
    description:
      'Command-line task manager with full CRUD. Task data is structured for cheap updates and categorisation, with the whole thing kept modular as it grew.',
    stack: ['Python', 'CRUD', 'CLI'],
    metric: 'CRUD',
    metricLabel: 'create · read · update · delete',
    accent: '#5eead4',
    href: 'https://github.com/S-Farhan-Hashmi',
  },
  {
    title: 'Text-Based Adventure',
    tag: 'Experiment',
    year: '2025',
    description:
      'Interactive fiction driven by structured logic and modular functions. A dictionary-based navigation and decision system keeps the world graph easy to extend.',
    stack: ['Python', 'Dicts', 'Game Logic'],
    metric: '∞',
    metricLabel: 'branching paths to explore',
    accent: '#ffb547',
    href: 'https://github.com/S-Farhan-Hashmi',
  },
]

export type Role = {
  period: string
  title: string
  company: string
  note: string
  points: string[]
}

export const TIMELINE: Role[] = [
  {
    period: '2026 — Present',
    title: 'B.E. in Computer Science',
    company: 'RV College of Engineering (RVCE)',
    note: '2nd Semester · CGPA 9.85 / 10',
    points: [
      'Core focus on Data Structures & Algorithms: arrays, sorting, searching, bit manipulation.',
      'Building depth in object-oriented design and multithreaded Java.',
    ],
  },
  {
    period: '2025 — 2026',
    title: 'Four Shipped Applications',
    company: 'Self-directed',
    note: 'Java and Python, each one taken from idea to working system.',
    points: [
      'Airline Management System — Swing GUI, JDBC, MySQL, OOP architecture.',
      'Password Manager, Task Manager CLI and a text-based adventure game.',
    ],
  },
  {
    period: '2025',
    title: 'Data & Analysis Stack',
    company: 'Self-taught',
    note: 'NumPy, Pandas, Matplotlib and Scikit-learn.',
    points: [
      'Used across coursework and personal data projects for analysis and visualisation.',
      'Paired with MySQL for anything that needs to persist beyond a session.',
    ],
  },
]

export const PRINCIPLES = [
  {
    title: 'Structure before features',
    body: 'A booking system that can’t take a new feature next month wasn’t finished this month. OOP isn’t homework, it’s a budget.',
  },
  {
    title: 'Persistence is the test',
    body: 'Anything that loses state on restart isn’t done. JDBC and file I/O taught me that faster than any lecture.',
  },
  {
    title: 'Clean beats clever',
    body: 'A CLI is only as good as the day you reopen it six months later and still understand every line.',
  },
]

export const SECTION_IDS = ['hero', 'about', 'skills', 'work', 'journey', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const CHAPTER_GAP = 45
export const CHAPTER_COUNT = SECTION_IDS.length

/** Computed once at module load so render stays pure. */
export const YEAR = new Date().getFullYear()
