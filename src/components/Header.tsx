import { useEffect, useState } from 'react'
import { NAV, LINKS } from '../data'
import { scrollToId, scrollToTop } from '../lib/useSmoothScroll'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = NAV.map((n) => n.id)
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      let cur = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.42) cur = id
      }
      setActive(cur)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-white/5 bg-ink/70 backdrop-blur-xl' : ''
      }`}
    >
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-10 md:py-5">
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-3"
          aria-label="Back to top"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-accent/40 transition-colors group-hover:border-accent">
            <span className="h-3.5 w-3.5 rounded-full border-2 border-accent" />
            <span className="absolute h-1 w-1 rounded-full bg-accent" />
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block font-display text-[13px] uppercase tracking-[0.04em]">Ondrej Zuscik</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-white/55">Marketing × AI</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollToId(n.id)}
              className={`rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors ${
                active === n.id ? 'text-accent' : 'text-white/65 hover:text-white'
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <a
          href={`mailto:${LINKS.email}`}
          className="rounded-full border border-white/15 px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-ink"
        >
          Let&apos;s talk
        </a>
      </div>
    </header>
  )
}
