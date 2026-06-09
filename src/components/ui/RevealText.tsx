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
      // No transforms — keep the text perfectly crisp. The wave is purely a moving
      // colour highlight over always-readable text (grey -> cyan + glow -> white),
      // so you can read at your own pace and nothing blurs.
      gsap.set(spans, { color: 'rgb(150,160,172)' })
      gsap.to(spans, {
        keyframes: {
          color: [
            'rgb(150,160,172)',
            'rgb(54,224,255)',
            'rgb(54,224,255)',
            'rgb(54,224,255)',
            'rgb(255,255,255)',
          ],
          textShadow: [
            '0 0 0px rgba(54,224,255,0)',
            '0 0 22px rgba(54,224,255,0.85)',
            '0 0 16px rgba(54,224,255,0.55)',
            '0 0 10px rgba(54,224,255,0.3)',
            '0 0 0px rgba(54,224,255,0)',
          ],
          easeEach: 'none',
        },
        ease: 'none',
        stagger: 0.07,
        // Slow, gliding highlight across the readable middle of the screen.
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 20%', scrub: 1.5 },
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
