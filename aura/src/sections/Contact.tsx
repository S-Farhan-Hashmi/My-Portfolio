import { motion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { PROFILE, YEAR } from '@/data/portfolio'

export function Contact() {
  return (
    <Section
      id="contact"
      index="05"
      eyebrow="Send it"
      title={
        <>
          Let’s build something
          <br />
          <span className="text-gradient">worth rendering.</span>
        </>
      }
      className="pb-32"
    >
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal delay={0.12}>
          <div className="flex flex-col gap-8">
            <p className="max-w-xl font-sans text-[15px] leading-[1.75] text-white/55 sm:text-base">
              I’m a 2nd-year CS student at RVCE, currently open to internships. If you’ve
              got a role, a project, or just a problem you want a second brain on — send it.
            </p>

            <a
              href={`mailto:${PROFILE.email}`}
              className="group relative inline-flex w-fit items-center gap-4 overflow-hidden rounded-full border border-white/20 bg-white/[0.03] px-7 py-4 backdrop-blur-md transition-colors duration-300 hover:border-cyan/60"
              data-cursor-label="Send"
            >
              <span className="relative z-10 font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                {PROFILE.email}
              </span>
              <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300 text-void transition-transform duration-300 group-hover:rotate-45">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M7 17L17 7M17 7H8M17 7V16"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-cyan/20 to-violet/20 transition-transform duration-500 group-hover:translate-x-0" />
            </a>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] text-white/35">
              <span>{PROFILE.location}</span>
              <span className="hidden h-3 w-px bg-white/15 sm:block" />
              <span>{PROFILE.availability}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-sans text-[10px] tracking-[0.3em] text-white/40 uppercase">
                Channels
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            </div>

            <ul className="flex flex-col">
              {PROFILE.socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-4 border-b border-white/8 py-4 transition-colors duration-300 last:border-b-0 hover:border-white/25"
                    data-cursor-label={social.label}
                  >
                    <span className="font-display text-sm font-semibold tracking-tight text-white">
                      {social.label}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-white/35 transition-colors group-hover:text-white/70">
                        {social.handle}
                      </span>
                      <span className="text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan">
                        →
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <motion.footer
        className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.3 }}
      >
        <p className="font-mono text-[10px] tracking-[0.18em] text-white/25 uppercase">
          © {YEAR} {PROFILE.firstName} {PROFILE.lastName} — rendered in
          realtime
        </p>
        <p className="font-mono text-[10px] tracking-[0.18em] text-white/25 uppercase">
          Built with React · Three.js · WebGL
        </p>
      </motion.footer>
    </Section>
  )
}
