import { SectionHeading } from './ui/SectionHeading'
import { RevealText } from './ui/RevealText'
import { Marquee } from './ui/Marquee'
import { MANIFESTO, TOOLS } from '../data'

export function Manifesto() {
  return (
    <section id="manifesto" className="relative scroll-mt-24 overflow-hidden pt-20 pb-40 md:pt-24 md:pb-60">
      <div className="pointer-events-none absolute inset-0 digital-grid opacity-[0.25]" />
      <div className="relative mx-auto max-w-[1280px] px-5 md:px-10">
        <SectionHeading
          titleClassName="font-display text-[clamp(42px,6.4vw,98px)] uppercase leading-[1.0] tracking-[-0.03em]"
          title={
            <>
              Not a shortcut.
              <br />
              A multiplier.
            </>
          }
        />
        <RevealText className="mt-20 max-w-[24ch] text-[clamp(32px,5vw,72px)] font-medium leading-[1.28] tracking-[-0.01em] text-white">
          {MANIFESTO}
        </RevealText>
      </div>
      <div className="relative mt-20 border-y border-white/8 py-6">
        <Marquee items={TOOLS} />
      </div>
    </section>
  )
}
