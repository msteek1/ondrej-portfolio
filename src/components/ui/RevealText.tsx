import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'

/** Word-by-word opacity + de-blur reveal, scrubbed by scroll. */
export function RevealText({ children, className = '' }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = useMemo(() => children.split(' '), [children])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const spans = el.querySelectorAll('.rw')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { opacity: 0.12, filter: 'blur(6px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 38%', scrub: true },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="rw" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
          {w + ' '}
        </span>
      ))}
    </p>
  )
}
