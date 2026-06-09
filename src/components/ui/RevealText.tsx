import { useLayoutEffect, useMemo, useRef } from 'react'
import { gsap } from '../../lib/gsap'

/**
 * Scroll-scrubbed "reading wave".
 *
 * Each word travels dim → cyan → white as you scroll, so a cyan highlight band
 * (the colour we use for accents elsewhere) moves down the paragraph, lighting
 * roughly a couple of lines at a time. Words ahead of the band are dimmed +
 * blurred (not read yet); words behind it settle to white (read). By the end of
 * the scroll the whole paragraph is unfolded.
 *
 * Tuning:
 *  - `stagger` ↓ = wider cyan band (more words lit at once)
 *  - scrollTrigger start/end = how much scroll distance the reveal takes
 */
export function RevealText({ children, className = '' }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = useMemo(() => children.split(' '), [children])

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // Reduced motion: leave the text fully readable (white), no scrub animation.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const spans = el.querySelectorAll<HTMLElement>('.rw')
    const ctx = gsap.context(() => {
      gsap.set(spans, { color: 'rgba(255,255,255,0.14)', filter: 'blur(5px)', y: 14 })
      gsap.to(spans, {
        keyframes: {
          // dim → cyan (held across the middle = a ~2-line band) → white
          color: [
            'rgba(255,255,255,0.14)',
            'rgb(54,224,255)',
            'rgb(54,224,255)',
            'rgb(54,224,255)',
            'rgb(255,255,255)',
          ],
          filter: ['blur(5px)', 'blur(0px)', 'blur(0px)', 'blur(0px)', 'blur(0px)'],
          textShadow: [
            '0 0 0px rgba(54,224,255,0)',
            '0 0 26px rgba(54,224,255,0.75)',
            '0 0 22px rgba(54,224,255,0.6)',
            '0 0 18px rgba(54,224,255,0.45)',
            '0 0 0px rgba(54,224,255,0)',
          ],
          y: [14, 0, 0, 0, 0],
          easeEach: 'none',
        },
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 60%', scrub: true },
      })
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
