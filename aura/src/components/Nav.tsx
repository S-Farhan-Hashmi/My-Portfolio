import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState } from 'react'
import { PROFILE } from '@/data/portfolio'
import { scrollToId, useActiveChapter } from '@/lib/scroll'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export function Nav() {
  const active = useActiveChapter()
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    setHidden(latest > previous && latest > 220)
  })

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-5 py-5 md:px-10"
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        type="button"
        onClick={() => scrollToId('hero')}
        className="group flex items-center gap-3"
        data-cursor-label="Top"
      >
        <span className="relative flex h-8 w-8 items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-violet/40 transition-colors duration-500 group-hover:border-cyan/70" />
          <span className="absolute inset-[5px] animate-spin-slow rounded-full border border-dashed border-cyan/40" />
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]" />
        </span>
        <span className="font-display text-sm font-bold tracking-[0.34em] text-white">AURA</span>
      </button>

      <nav className="hidden items-center gap-1 md:flex">
        {NAV.map((item) => {
          const isActive = active === NAV.findIndex((n) => n.id === item.id) + 1
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToId(item.id)}
              className="relative px-3.5 py-2 font-sans text-[11px] tracking-[0.18em] uppercase transition-colors duration-300"
            >
              <span className={isActive ? 'text-white' : 'text-white/45 hover:text-white/80'}>
                {item.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          )
        })}
      </nav>

      <a
        href={`mailto:${PROFILE.email}`}
        className="glass group flex items-center gap-2 rounded-full px-4 py-2 font-sans text-[10px] tracking-[0.18em] uppercase transition-transform duration-300 hover:scale-[1.03]"
        data-cursor-label="Email"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="hidden text-white/70 sm:inline">Available</span>
        <span className="text-white">Let’s talk</span>
      </a>
    </motion.header>
  )
}
