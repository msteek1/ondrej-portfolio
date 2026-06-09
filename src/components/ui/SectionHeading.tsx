import { motion } from 'motion/react'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Shared section heading. The kicker and title share the site's signature
 * "de-blur + rise" reveal (same feel as the Manifesto body), staggered, so
 * every section opens with the same intentional motion.
 *
 * Pass `titleClassName` to override the default title size (e.g. the Manifesto
 * wants a larger, statement-scale headline).
 */
export function SectionHeading({
  kicker,
  title,
  className = '',
  titleClassName = 'font-display text-[clamp(30px,4.6vw,64px)] uppercase leading-[1.02] tracking-[-0.03em]',
}: {
  kicker: string
  title: ReactNode
  className?: string
  titleClassName?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
      className={className}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
          show: { opacity: 1, y: 0, filter: 'blur(0px)' },
        }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mb-4 flex items-center gap-3"
      >
        <span className="h-px w-8 bg-accent" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">{kicker}</span>
      </motion.div>
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
          show: { opacity: 1, y: 0, filter: 'blur(0px)' },
        }}
        transition={{ duration: 0.7, ease: EASE }}
        className={titleClassName}
      >
        {title}
      </motion.h2>
    </motion.div>
  )
}
