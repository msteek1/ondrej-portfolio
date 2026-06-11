import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'

/* Chapter anchors, in story order. The bar doubles as a chapter map: a tick
   per chapter, lit once the reader has scrolled past it. */
const CHAPTER_IDS = ['manifesto', 'create', 'work', 'path', 'projects', 'contact']

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  const [marks, setMarks] = useState<number[]>([])
  const [lit, setLit] = useState(0)

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const next = CHAPTER_IDS.map((id) => {
        const el = document.getElementById(id)
        if (!el) return -1
        const top = el.getBoundingClientRect().top + window.scrollY
        return Math.min(0.995, Math.max(0, (top - 100) / max))
      }).filter((m) => m >= 0)
      setMarks(next)
    }
    measure()
    const t = window.setTimeout(measure, 400)
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
    }
  }, [])

  useEffect(
    () =>
      scrollYProgress.on('change', (v) => {
        let n = 0
        for (const m of marks) if (v >= m) n++
        setLit((prev) => (prev === n ? prev : n))
      }),
    [scrollYProgress, marks],
  )

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <motion.div style={{ scaleX: x }} className="h-[3px] origin-left bg-accent" />
      {marks.map((m, i) => (
        <span
          key={i}
          style={{ left: `${m * 100}%` }}
          className={`absolute top-0 h-[8px] w-[2px] -translate-x-1/2 transition-colors duration-300 ${
            i < lit ? 'bg-accent' : 'bg-white/25'
          }`}
        />
      ))}
    </div>
  )
}
