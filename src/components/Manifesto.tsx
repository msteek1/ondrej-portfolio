import { SectionHeading } from './ui/SectionHeading'
import { RevealText } from './ui/RevealText'
import { Marquee } from './ui/Marquee'
import { MANIFESTO, TOOLS } from '../data'

export function Manifesto() {
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 digital-grid opacity-[0.25]" />
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-10">
        <SectionHeading
          kicker="Manifesto"
          titleClassName="font-display text-[clamp(36px,5.6vw,82px)] uppercase leading-[1.0] tracking-[-0.03em]"
          title={
            <>
              Not a shortcut.
              <br />
              A multiplier.
            </>
          }
        />
        <RevealText className="mt-16 max-w-[26ch] text-[clamp(22px,3.1vw,42px)] font-medium leading-[1.32] tracking-[-0.01em] text-white">
          {MANIFESTO}
        </RevealText>
      </div>
      <div className="relative mt-20 border-y border-white/8 py-6">
        <Marquee items={TOOLS} />
      </div>
    </section>
  )
}
