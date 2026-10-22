import { motion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { TiltCard } from '@/components/TiltCard'
import { PROJECTS } from '@/data/portfolio'

export function Work() {
  return (
    <Section
      id="work"
      index="03"
      eyebrow="Selected work"
      title={
        <>
          Four things I built
          <br />
          <span className="text-white/45">that I still talk about.</span>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.1}>
            <TiltCard className="h-full">
              <a
                href={project.href}
                className="glass group relative flex h-full flex-col overflow-hidden rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-7"
                data-cursor-label="Open"
              >
                <span
                  className="absolute -top-24 -right-16 h-52 w-52 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-45"
                  style={{ background: project.accent }}
                />

                <div className="relative flex items-center justify-between gap-4">
                  <span
                    className="rounded-full border px-2.5 py-1 font-sans text-[9px] tracking-[0.2em] uppercase"
                    style={{
                      color: project.accent,
                      borderColor: `${project.accent}44`,
                      background: `${project.accent}12`,
                    }}
                  >
                    {project.tag}
                  </span>
                  <span className="font-mono text-[10px] text-white/30">{project.year}</span>
                </div>

                <h3 className="relative mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {project.title}
                </h3>

                <p className="relative mt-3 font-sans text-sm leading-relaxed text-white/50">
                  {project.description}
                </p>

                <div className="relative mt-7 flex items-end justify-between gap-6">
                  <div>
                    <div
                      className="font-display text-4xl font-bold tracking-tight tabular-nums"
                      style={{ color: project.accent }}
                    >
                      {project.metric}
                    </div>
                    <div className="mt-1 font-sans text-[10px] tracking-[0.2em] text-white/35 uppercase">
                      {project.metricLabel}
                    </div>
                  </div>

                  <ul className="flex flex-wrap justify-end gap-1.5">
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[9px] text-white/50"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.span
                  className="relative mt-7 inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.22em] text-white/50 uppercase transition-colors group-hover:text-white"
                  initial={false}
                >
                  View case study
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </motion.span>
              </a>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
