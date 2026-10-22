import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { PRINCIPLES, PROFILE } from '@/data/portfolio'

export function About() {
  return (
    <Section
      id="about"
      index="01"
      eyebrow="Who is behind the render"
      title={
        <>
          Half engineer.
          <br />
          <span className="text-white/45">Half art director.</span>
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr]">
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
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
            {PROFILE.stats.map((stat) => (
              <div key={stat.label} className="bg-void/70 px-5 py-6 backdrop-blur-sm">
                <dt className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-1.5 font-sans text-[10px] tracking-[0.2em] text-white/40 uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
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
