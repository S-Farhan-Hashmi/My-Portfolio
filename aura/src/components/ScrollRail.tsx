import { motion, useSpring, useTransform } from 'framer-motion'
import { useMemo } from 'react'
import { SECTION_IDS } from '@/data/portfolio'
import { scrollToId, useScrollProgress } from '@/lib/scroll'

const LABELS: Record<string, string> = {
  hero: 'Intro',
  about: 'About',
  skills: 'Skills',
  work: 'Work',
  journey: 'Journey',
  contact: 'Contact',
}

export function ScrollRail() {
  const progress = useScrollProgress()

  const smooth = useSpring(progress, { stiffness: 120, damping: 26, mass: 0.4 })
  const scaleY = useTransform(smooth, [0, 1], [0, 1])
  const percent = useTransform(smooth, (v) => Math.round(v * 100))
  const handleTop = useTransform(smooth, (v) => `${v * 100}%`)

  const active = useMemo(
    () =>
      Math.min(SECTION_IDS.length - 1, Math.max(0, Math.round(progress * (SECTION_IDS.length - 1)))),
    [progress],
  )

  return (
    <div className="pointer-events-none fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 lg:block">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end gap-3">
          {SECTION_IDS.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToId(id)}
              className="pointer-events-auto group flex items-center justify-end gap-3"
            >
              <span
                className={`font-sans text-[10px] tracking-[0.22em] uppercase transition-all duration-300 ${
                  i === active
                    ? 'text-white opacity-100'
                    : 'translate-x-1 text-white/35 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                }`}
              >
                {LABELS[id]}
              </span>
              <span
                className={`font-mono text-[9px] tabular-nums transition-colors duration-300 ${
                  i === active ? 'text-cyan-300' : 'text-white/25'
                }`}
              >
                {String(i).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>

        <div className="relative h-44 w-px bg-white/10">
          <motion.div
            className="absolute inset-x-0 top-0 origin-top bg-gradient-to-b from-cyan via-violet to-rose"
            style={{ height: '100%', scaleY }}
          />
          <motion.span
            className="absolute -left-[3px] h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.6)]"
            style={{ top: handleTop }}
          />
        </div>

        <motion.span className="font-mono text-[10px] tabular-nums text-white/35 [writing-mode:vertical-rl]">
          {percent}
        </motion.span>
      </div>
    </div>
  )
}
