import { Mail, ArrowUpRight } from 'lucide-react'
import { MagneticButton } from './ui/MagneticButton'
import { LINKS } from '../data'
import { scrollToTop } from '../lib/useSmoothScroll'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={15} height={15} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.53 1.72-2.53 3.49V23h-4V8z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function Contact() {
  const year = new Date().getFullYear()
  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden border-t border-white/5 py-28 md:py-44">
      <div className="pointer-events-none absolute inset-0 digital-grid opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative mx-auto max-w-[1100px] px-5 md:px-10">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">Let&apos;s talk</span>
        <h2 className="mt-5 font-display text-[clamp(34px,6vw,90px)] uppercase leading-[0.95] tracking-[-0.03em]">
          Let&apos;s build
          <br />
          something that <span className="text-accent text-glow">compounds.</span>
        </h2>
        <p className="mt-7 max-w-[52ch] text-[clamp(15px,1.6vw,19px)] leading-relaxed text-white/60">
          Marketing strategy, AI workflows, creative systems and automation — connected into something
          that&apos;s easier to scale, measure and improve. If that sounds like your kind of problem, let&apos;s
          build it.
        </p>

        <div className="mt-10">
          <MagneticButton
            href={`mailto:${LINKS.email}`}
            className="accent-box inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-bold uppercase tracking-[0.06em] shadow-glow"
          >
            <Mail size={18} strokeWidth={2.5} /> {LINKS.email}
          </MagneticButton>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-accent/50 hover:text-white"
          >
            <LinkedInIcon className="text-accent" /> LinkedIn
          </a>
          <a
            href={LINKS.aizona}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-accent/50 hover:text-white"
          >
            <ArrowUpRight size={15} strokeWidth={2} className="text-accent" /> Aizona.cz
          </a>
          <a
            href={LINKS.advisio}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-accent/50 hover:text-white"
          >
            <ArrowUpRight size={15} strokeWidth={2} className="text-accent" /> Advisio.cz
          </a>
          <a
            href={LINKS.instagram}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[13px] font-medium uppercase tracking-[0.1em] text-white/70 transition-colors hover:border-accent/50 hover:text-white"
          >
            <InstagramIcon className="text-accent" /> Instagram
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-24 max-w-[1100px] border-t border-white/10 px-5 pt-8 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.18em] text-white/35">
          <span>© {year} Ondrej Zuscik — Marketing × AI</span>
          <button onClick={scrollToTop} className="transition-colors hover:text-accent">
            Back to top ↑
          </button>
        </div>
      </div>
    </section>
  )
}
