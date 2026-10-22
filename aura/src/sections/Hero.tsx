import { motion } from 'framer-motion'
import { PROFILE, YEAR } from '@/data/portfolio'
import { scrollToId } from '@/lib/scroll'

const word = {
  hidden: { opacity: 0, y: '110%', rotateX: -55 },
  show: (i: number) => ({
    opacity: 1,
    y: '0%',
    rotateX: 0,
    transition: { delay: 0.12 * i, duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

function Line({ text, gradient }: { text: string; gradient?: boolean }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block font-display text-[clamp(3rem,13vw,10rem)] leading-[0.85] font-bold tracking-[-0.055em] ${
          gradient ? 'text-gradient' : 'text-white'
        }`}
        initial="hidden"
        animate="show"
      >
        {Array.from(text).map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            custom={i}
            variants={word}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    </span>
  )
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-5 pt-28 pb-20 md:px-10"
    >
      <motion.p
        className="mb-8 font-sans text-[10px] tracking-[0.5em] text-white/40 uppercase"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.9 }}
      >
        Portfolio — {YEAR}
      </motion.p>

      <h1 className="text-center" style={{ perspective: '1000px' }}>
        <Line text={PROFILE.firstName} />
        <Line text={PROFILE.lastName} gradient />
      </h1>

      <motion.div
        className="mt-10 flex max-w-xl flex-col items-center gap-5 text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-display text-sm tracking-[0.22em] text-cyan-200/90 uppercase sm:text-base">
          {PROFILE.role}
        </p>
        <p className="max-w-md font-sans text-sm leading-relaxed text-white/55 sm:text-base">
          {PROFILE.tagline}
        </p>
      </motion.div>

      <motion.div
        className="mt-12 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.9 }}
      >
        <button
          type="button"
          onClick={() => scrollToId('work')}
          className="group relative overflow-hidden rounded-full bg-white px-7 py-3.5 font-sans text-[11px] tracking-[0.2em] text-void uppercase transition-transform duration-300 hover:scale-[1.04]"
          data-cursor-label="View"
        >
          <span className="relative z-10">See the work</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan to-violet transition-transform duration-500 group-hover:translate-x-0" />
        </button>
        <button
          type="button"
          onClick={() => scrollToId('contact')}
          className="rounded-full border border-white/20 px-7 py-3.5 font-sans text-[11px] tracking-[0.2em] text-white/80 uppercase backdrop-blur-md transition-colors duration-300 hover:border-cyan/60 hover:text-white"
          data-cursor-label="Email"
        >
          Get in touch
        </button>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToId('about')}
        className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        <span className="font-sans text-[9px] tracking-[0.4em] text-white/35 uppercase">
          Scroll
        </span>
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-cyan to-transparent"
            animate={{ y: [-16, 48] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>

      <motion.div
        className="absolute bottom-10 left-5 hidden flex-col gap-1 font-mono text-[10px] text-white/25 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span>{PROFILE.location}</span>
        <span>{PROFILE.availability}</span>
      </motion.div>
    </section>
  )
}
