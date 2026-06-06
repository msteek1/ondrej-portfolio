import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export function SectionHeading({
  kicker,
  title,
  className = '',
}: {
  kicker: string
  title: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px w-8 bg-accent" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">{kicker}</span>
      </div>
      <h2 className="font-display text-[clamp(30px,4.6vw,64px)] uppercase leading-[1.02] tracking-[-0.03em]">
        {title}
      </h2>
    </motion.div>
  )
}
