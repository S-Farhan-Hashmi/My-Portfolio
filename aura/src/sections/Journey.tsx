import { motion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { TIMELINE } from '@/data/portfolio'

export function Journey() {
  return (
    <Section
      id="journey"
      index="04"
      eyebrow="The long way round"
      title={
        <>
          Education & milestones.
          <br />
          <span className="text-white/45">How the foundations got laid.</span>
        </>
      }
    >
      <ol className="relative flex flex-col gap-9 border-l border-white/10 pl-7 md:pl-10">
        {TIMELINE.map((role, i) => (
          <Reveal key={role.title} delay={i * 0.12} y={22}>
            <li className="relative">
              <span className="absolute -left-[2.05rem] top-1.5 md:-left-[2.7rem]">
                <span className="absolute -inset-2 animate-pulse-ring rounded-full bg-cyan-400/30" />
                <span className="relative block h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_3px_rgba(34,211,238,0.6)]" />
              </span>

              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
                <span className="font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-cyan-300/70">
                  {role.period}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {role.title}
                  </h3>
                  <p className="mt-1 font-sans text-sm text-white/45">
                    {role.company} — {role.note}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {role.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 font-sans text-sm leading-relaxed text-white/55"
                      >
                        <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>

      <motion.div
        className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {[
          ['2026', 'Started B.E. CSE'],
          ['9.85', 'CGPA / 10'],
          ['4', 'Projects shipped'],
          ['RVCE', 'Bengaluru, IN'],
        ].map(([year, label]) => (
          <div key={year} className="bg-void/70 px-5 py-5">
            <div className="font-display text-lg font-bold text-white/90">{year}</div>
            <div className="mt-1 font-sans text-[10px] tracking-[0.2em] text-white/35 uppercase">
              {label}
            </div>
          </div>
        ))}
      </motion.div>
    </Section>
  )
}
