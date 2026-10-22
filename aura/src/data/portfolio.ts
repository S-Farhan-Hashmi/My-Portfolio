/**
 * ---------------------------------------------------------------------------
 *  AURA — single source of truth for every word on the site.
 *  Edit this file and the whole 3D experience updates. Nothing else to touch.
 * ---------------------------------------------------------------------------
 */

export const PROFILE = {
  firstName: 'ALEX',
  lastName: 'RIVERA',
  // Shown under the name in the hero + used in the nav
  role: 'Creative Engineer & 3D Web Developer',
  tagline: 'I build interfaces that feel like places, not pages.',
  location: 'Brooklyn, NY — available worldwide',
  email: 'hello@alexrivera.dev',
  availability: 'Open to internships & freelance',
  bio: [
    'I design and engineer immersive web experiences — realtime 3D, motion systems, and the kind of detail work that makes a product feel inevitable.',
    'Five years of shipping production interfaces, most of them in the browser at 60fps on a mid-range laptop. I care about performance budgets, motion that has intent, and code that a team can pick up.',
  ],
  socials: [
    { label: 'GitHub', handle: '@alexrivera', href: 'https://github.com' },
    { label: 'LinkedIn', handle: 'in/alexrivera', href: 'https://linkedin.com' },
    { label: 'X', handle: '@alexr', href: 'https://x.com' },
    { label: 'Email', handle: 'hello@alexrivera.dev', href: 'mailto:hello@alexrivera.dev' },
  ],
  stats: [
    { value: '5+', label: 'Years shipping' },
    { value: '40+', label: 'Projects delivered' },
    { value: '60fps', label: 'Non-negotiable' },
    { value: '12', label: 'Open-source libs' },
  ],
} as const

export type Skill = {
  name: string
  category: 'Engine' | 'Craft' | 'Ship'
  level: number
}

export const SKILLS: Skill[] = [
  { name: 'TypeScript', category: 'Engine', level: 95 },
  { name: 'React', category: 'Engine', level: 92 },
  { name: 'Three.js', category: 'Engine', level: 90 },
  { name: 'WebGL / GLSL', category: 'Engine', level: 84 },
  { name: 'Node.js', category: 'Engine', level: 80 },
  { name: 'Rust / WASM', category: 'Engine', level: 62 },
  { name: 'Motion Design', category: 'Craft', level: 88 },
  { name: 'Shader Writing', category: 'Craft', level: 86 },
  { name: 'UI Systems', category: 'Craft', level: 91 },
  { name: 'Blender', category: 'Craft', level: 70 },
  { name: 'Performance', category: 'Ship', level: 93 },
  { name: 'CI / CD', category: 'Ship', level: 78 },
]

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
    title: 'Halcyon Engine',
    tag: 'Featured',
    year: '2025',
    description:
      'A browser-native particle system with GPU-driven simulation. Renders 2.4M particles at 120fps on integrated graphics.',
    stack: ['WebGPU', 'Rust', 'WASM'],
    metric: '2.4M',
    metricLabel: 'particles @ 120fps',
    accent: '#7c5cff',
    href: '#',
  },
  {
    title: 'Northwind',
    tag: 'Product',
    year: '2024',
    description:
      'Realtime analytics surface for logistics fleets. 40k live nodes, streamed over WebSocket, visualised on a GPU timeline.',
    stack: ['React', 'Three.js', 'Go'],
    metric: '40k',
    metricLabel: 'live nodes tracked',
    accent: '#22d3ee',
    href: '#',
  },
  {
    title: 'Spectra',
    tag: 'Open Source',
    year: '2024',
    description:
      'A tiny 3kb shader library for the web. Composables for gradients, glow, and noise that any CSS property can drive.',
    stack: ['TypeScript', 'GLSL', 'Vite'],
    metric: '3kb',
    metricLabel: 'gzipped runtime',
    accent: '#5eead4',
    href: '#',
  },
  {
    title: 'Orbital',
    tag: 'Experiment',
    year: '2023',
    description:
      'Gesture-driven spatial photo browser. Hand tracking maps to a quaternion camera rig with inertia and spring physics.',
    stack: ['MediaPipe', 'WebXR', 'R3F'],
    metric: '±0.2°',
    metricLabel: 'tracking drift',
    accent: '#ffb547',
    href: '#',
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
    period: '2024 — Now',
    title: 'Senior Frontend Engineer',
    company: 'Lumen Labs',
    note: 'Realtime graphics team, 9 people, shipped to 2M users.',
    points: [
      'Led the rewrite of the 3D configurator — cut time-to-interactive 4.1s → 1.2s.',
      'Built the shader authoring tool the design team still uses daily.',
    ],
  },
  {
    period: '2022 — 2024',
    title: 'Creative Technologist',
    company: 'Studio Meridian',
    note: 'Award-winning experiential work for culture and retail brands.',
    points: [
      'Shipped 11 WebGL campaigns, two of which took a Cannes Lions shortlist.',
      'Introduced the studio-wide performance budget; dropped p75 LCP by 58%.',
    ],
  },
  {
    period: '2020 — 2022',
    title: 'Frontend Engineer',
    company: 'Northwind',
    note: 'Internal platform for a 400-person product org.',
    points: [
      'Owned the design system used by 30+ product teams.',
      'Mentored four junior engineers into senior roles.',
    ],
  },
]

export const PRINCIPLES = [
  {
    title: 'Motion with intent',
    body: 'Every animation earns its milliseconds. If it doesn’t orient or explain, it goes.',
  },
  {
    title: 'Real is a budget',
    body: 'A beautiful frame is worthless at 12fps. Performance is part of the design, not a cleanup task.',
  },
  {
    title: 'Detail is the tone',
    body: 'The 20ms of easing nobody notices is exactly what makes the whole thing feel expensive.',
  },
]

export const SECTION_IDS = ['hero', 'about', 'skills', 'work', 'journey', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const CHAPTER_GAP = 45
export const CHAPTER_COUNT = SECTION_IDS.length

/** Computed once at module load so render stays pure. */
export const YEAR = new Date().getFullYear()
