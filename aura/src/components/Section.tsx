import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

type SectionProps = {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  className?: string
}

export function Section({ id, index, eyebrow, title, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative flex min-h-screen flex-col justify-center px-5 py-24 md:px-10 lg:px-24 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="mb-6 flex items-center gap-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-300/80">{index}</span>
            <span className="h-px w-10 bg-white/20" />
            <span className="font-sans text-[10px] tracking-[0.38em] text-white/40 uppercase">
              {eyebrow}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="max-w-4xl text-[clamp(2.25rem,6.5vw,5.25rem)] font-bold tracking-[-0.045em] text-white">
            {title}
          </h2>
        </Reveal>

        <div className="hairline my-10 w-full opacity-60" />

        {children}
      </div>
    </section>
  )
}
