import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { SectionHeading } from './ui/SectionHeading'
import { TIMELINE } from '../data'

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 62%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 })

  // End the rail exactly at the last node (the goal) — never past it.
  const [railBottom, setRailBottom] = useState(8)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const calc = () => {
      const dots = el.querySelectorAll('.tl-dot')
      if (!dots.length) return
      const last = dots[dots.length - 1].getBoundingClientRect()
      const box = el.getBoundingClientRect()
      const lastCenter = last.top - box.top + last.height / 2
      setRailBottom(Math.max(0, Math.round(el.clientHeight - lastCenter)))
    }
    calc()
    const t = window.setTimeout(calc, 350)
    window.addEventListener('resize', calc)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', calc)
    }
  }, [])

  return (
    <section id="path" className="relative scroll-mt-24 pt-14 pb-28 md:pt-16 md:pb-40">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <SectionHeading
          title={
            <>
              Seven years,
              <br />
              marketing → AI
            </>
          }
        />

        <div ref={ref} className="relative mt-16">
          {/* rail — ends at the last node (style bottom), never past it */}
          <div
            style={{ bottom: railBottom }}
            className="absolute top-2 left-[94px] w-px bg-white/12 md:left-[152px]"
          />
          <motion.div
            style={{ scaleY: fill, bottom: railBottom }}
            className="absolute top-2 left-[94px] w-px origin-top bg-accent md:left-[152px]"
          />

          <div className="space-y-12 md:space-y-16">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 26 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-90px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid grid-cols-[72px_1fr] gap-x-11 md:grid-cols-[120px_1fr] md:gap-x-16"
              >
                <div className="pt-1 text-right">
                  <span className="font-display text-[15px] text-white/85 md:text-[19px]">{t.year}</span>
                </div>

                <span className="tl-dot absolute top-2 left-[94px] h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-ink md:left-[152px]" />

                <div className="pl-1">
                  {t.tag && (
                    <span className="mb-2 inline-block rounded-full border border-accent/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent">
                      {t.tag}
                    </span>
                  )}
                  <h3 className="font-display text-[18px] uppercase tracking-tight md:text-[22px]">{t.role}</h3>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.12em] text-accent/90">
                    {t.org}
                    {t.place ? ` · ${t.place}` : ''}
                  </p>
                  <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-white/55">{t.blurb}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
