import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenisRef: Lenis | null = null

/** Smooth-scroll to an element by id (uses Lenis when active). */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef) lenisRef.scrollTo(el, { offset: 0, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Smooth-scroll back to the top. */
export function scrollToTop() {
  if (lenisRef) lenisRef.scrollTo(0, { duration: 1.4 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

/**
 * Smooth scrolling (Lenis) wired into GSAP's ticker + ScrollTrigger.
 * Turns notchy wheel input into continuous motion so the canvas scrub
 * glides frame-by-frame instead of lurching. Disabled for reduced-motion.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    })
    lenisRef = lenis

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef = null
    }
  }, [])
}
