import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import type { Chapter } from '../../data'

const EASE = [0.16, 1, 0.3, 1] as const

const fade = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

/**
 * The "story thread" — one accent line stitching the chapters of the page
 * together. Each break draws its segment of the thread as it scrolls into
 * view (same motif as the Timeline rail), lands on a node, and hands over to
 * the chapter numeral plus a single connecting line of narration.
 *
 * `grid` keeps the digital-grid backdrop running through the break so the
 * match-cut out of the intro reads as one continuous surface.
 */
export function ChapterBreak({ n, name, line, grid = false }: Chapter & { grid?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 58%'] })
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 })

  return (
    <div ref={ref} className="relative flex flex-col items-center px-6 pt-20 pb-8 md:pt-28 md:pb-10">
      {grid && <div className="pointer-events-none absolute inset-0 digital-grid opacity-[0.25]" />}

      <div className="relative h-[15vh] min-h-[100px] w-px bg-white/10">
        <motion.div style={{ scaleY: draw }} className="absolute inset-0 origin-top bg-accent" />
        <span className="absolute -bottom-[3px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-accent" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
        className="relative flex flex-col items-center"
      >
        <motion.span
          variants={fade}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-8 font-display text-[12px] uppercase tracking-[0.35em] text-accent"
        >
          {n} <span className="text-white/35">/</span> <span className="text-white/85">{name}</span>
        </motion.span>
        <motion.p
          variants={fade}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-5 max-w-[44ch] text-center text-[clamp(16px,1.8vw,21px)] font-medium leading-relaxed text-white/65"
        >
          {line}
        </motion.p>
      </motion.div>
    </div>
  )
}
