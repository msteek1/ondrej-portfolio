import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { SectionHeading } from './ui/SectionHeading'
import { PROJECTS } from '../data'
import type { Project } from '../data'

function Card({ p, i, total }: { p: Project; i: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const targetScale = 1 - (total - i) * 0.04
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])
  const accent = p.accent ?? '#36e0ff'

  return (
    <div ref={ref} className="sticky top-0 flex h-screen items-center justify-center">
      <motion.article
        style={{ scale, top: `calc(-6vh + ${i * 24}px)` }}
        className="group relative w-full max-w-[1080px] overflow-hidden rounded-[28px] border border-white/12 bg-ink-2"
      >
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4">
              <span className="font-display text-[34px] leading-none md:text-[44px]" style={{ color: accent }}>
                {p.n}
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">{p.kind}</span>
            </div>
            <h3 className="mt-6 font-display text-[clamp(26px,3.4vw,46px)] uppercase tracking-[-0.02em]">
              {p.name}
            </h3>
            <p className="mt-4 max-w-[46ch] text-[14.5px] leading-relaxed text-white/60">{p.desc}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-wide text-white/55"
                >
                  {tag}
                </span>
              ))}
            </div>
            {p.href && (
              <a
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.08em] transition-transform hover:scale-[1.03]"
                style={{ borderColor: accent, color: accent }}
              >
                Visit <ArrowUpRight size={16} strokeWidth={2.5} />
              </a>
            )}
            <span className="mt-6 block text-[12px] uppercase tracking-[0.2em] text-white/55">{p.year}</span>
          </div>

          <div
            className="relative min-h-[240px] overflow-hidden"
            style={{ background: `radial-gradient(120% 120% at 70% 18%, ${accent}22, transparent 60%), #070b11` }}
          >
            {p.media ? (
              <>
                <img
                  src={p.media}
                  alt={p.mediaAlt ?? p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {/* bottom scrim keeps the url label readable over the artifact */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(7,11,17,0.85) 100%)' }}
                />
              </>
            ) : (
              <>
                <div className="absolute inset-0 digital-grid opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-[clamp(60px,10vw,150px)] uppercase leading-none opacity-[0.12]">
                    {p.name.charAt(0)}
                  </span>
                </div>
              </>
            )}
            <div className="absolute left-6 top-6 flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            </div>
            <div className="absolute bottom-6 right-6 font-mono text-[11px] text-white/75">
              {p.href ? p.href.replace('https://', '').replace(/\/$/, '') : 'internal'}
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 pt-14 md:pt-16">
      <div className="mx-auto max-w-[1300px] px-5 md:px-10">
        <SectionHeading
          title={
            <>
              Selected
              <br />
              work
            </>
          }
        />
      </div>
      <div className="mx-auto max-w-[1300px] px-5 md:px-10">
        {PROJECTS.map((p, i) => (
          <Card key={p.n} p={p} i={i} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  )
}
