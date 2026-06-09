import { motion } from 'motion/react'
import { Target, Sparkles, Workflow, BarChart3, TrendingUp, Code2 } from 'lucide-react'
import type { ComponentType } from 'react'
import { SectionHeading } from './ui/SectionHeading'
import { EXPERTISE } from '../data'

const ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Target,
  Sparkles,
  Workflow,
  BarChart3,
  TrendingUp,
  Code2,
}

export function Expertise() {
  return (
    <section id="work" className="relative scroll-mt-24 border-t border-white/5 py-28 md:py-40">
      <div className="mx-auto max-w-[1300px] px-5 md:px-10">
        <SectionHeading
          kicker="What I do"
          title={
            <>
              The work,
              <br />
              end to end
            </>
          }
        />
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((e, i) => {
            const Icon = ICONS[e.icon] ?? Sparkles
            return (
              <motion.article
                key={e.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-2 p-7 transition-colors duration-300 hover:border-accent/50"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-all duration-500 group-hover:bg-accent/15" />
                <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent transition-colors group-hover:border-accent/40">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-[17px] uppercase tracking-tight">{e.title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/55">{e.desc}</p>
                <span className="mt-6 block font-mono text-[12px] tabular-nums text-white/40">
                  0{i + 1}
                </span>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
