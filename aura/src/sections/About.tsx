import { Portrait } from '@/components/Portrait'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { PRINCIPLES, PROFILE, TOOLING } from '@/data/portfolio'

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="Who is behind the render"
      title={
        <>
          CS student at RVCE.
          <br />
          <span className="text-white/45">Ships real systems, not just assignments.</span>
        </>
      }
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Portrait className="mx-auto w-full max-w-[300px] lg:max-w-none" />

        <Reveal delay={0.12}>
          <div className="flex flex-col gap-5">
            {PROFILE.bio.map((paragraph) => (
              <p
                key={paragraph}
                className="font-sans text-[15px] leading-[1.75] text-white/60 sm:text-base"
              >
                {paragraph}
              </p>
            ))}

            <a
              href={PROFILE.resume}
              target="_blank"
              rel="noreferrer"
              className="glass mt-3 inline-flex w-fit items-center gap-3 self-start rounded-full px-5 py-3 transition-transform duration-300 hover:scale-[1.03]"
              data-cursor-label="PDF"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
                  stroke="#22d3ee"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2v6h6M9 15h6"
                  stroke="#22d3ee"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-sans text-[10px] tracking-[0.2em] text-white/80 uppercase">
                View résumé
              </span>
            </a>

            <ul className="mt-2 flex flex-wrap gap-1.5">
              {TOOLING.map((tool) => (
                <li
                  key={tool}
                  className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] text-white/50"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-4">
        {PROFILE.stats.map((stat) => (
          <div key={stat.label} className="bg-void/70 px-5 py-6 backdrop-blur-sm">
            <div className="font-display text-3xl font-bold tracking-tight text-white tabular-nums sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1.5 font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {PRINCIPLES.map((principle, i) => (
          <Reveal key={principle.title} delay={0.12 * i}>
            <article className="glass group h-full rounded-2xl p-6 transition-transform duration-500 hover:-translate-y-1">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
                <h3 className="font-display text-base font-semibold tracking-tight text-white">
                  {principle.title}
                </h3>
              </div>
              <p className="font-sans text-sm leading-relaxed text-white/50">
                {principle.body}
              </p>
              <span className="mt-5 block font-mono text-[10px] text-white/20">
                {String(i + 1).padStart(2, '0')}
              </span>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
