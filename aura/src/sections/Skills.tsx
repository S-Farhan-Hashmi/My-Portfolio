import { motion } from 'framer-motion'
import { Reveal } from '@/components/Reveal'
import { Section } from '@/components/Section'
import { SKILLS } from '@/data/portfolio'

const CATEGORY_COLOR = {
  Engine: 'from-cyan to-sky-400',
  Craft: 'from-violet to-fuchsia-400',
  Ship: 'from-amber to-orange-400',
} as const

const GROUPS = ['Engine', 'Craft', 'Ship'] as const

export function Skills() {
  return (
    <Section
      id="skills"
      index="02"
      eyebrow="The toolkit"
      title={
        <>
          Tools I reach for
          <br />
          <span className="text-white/45">before I reach for anything else.</span>
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-3">
        {GROUPS.map((group, gi) => {
          const items = SKILLS.filter((skill) => skill.category === group)
          return (
            <Reveal key={group} delay={gi * 0.1}>
              <div className="flex h-full flex-col">
                <div className="mb-5 flex items-baseline gap-3 border-b border-white/10 pb-3">
                  <h3 className="font-display text-sm font-semibold tracking-[0.2em] text-white uppercase">
                    {group}
                  </h3>
                  <span className="font-mono text-[10px] text-white/25">
                    {String(items.length).padStart(2, '0')}
                  </span>
                </div>

                <ul className="flex flex-col gap-4">
                  {items.map((skill, i) => (
                    <li key={skill.name}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <span className="font-sans text-sm text-white/75">{skill.name}</span>
                        <span className="font-mono text-[10px] text-white/30 tabular-nums">
                          {skill.level}
                        </span>
                      </div>
                      <div className="h-px w-full overflow-hidden bg-white/10">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${CATEGORY_COLOR[skill.category]}`}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: skill.level / 100 }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{
                            duration: 1.1,
                            delay: gi * 0.1 + i * 0.06,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ originX: 0 }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
