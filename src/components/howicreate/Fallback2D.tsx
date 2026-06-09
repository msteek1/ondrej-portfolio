import { SectionHeading } from '../ui/SectionHeading'

/* Accessible / no-WebGL version of "How I create": the same narrative as the 3D
   fly-through, laid out as a normal scrollable section in the site's style. */

export function Fallback2D() {
  return (
    <section id="create" className="relative scroll-mt-24 overflow-hidden border-t border-white/5 py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 digital-grid opacity-[0.18]" />
      <div className="relative mx-auto max-w-[1100px] px-5 md:px-10">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/45">
          with{' '}
          <span className="bg-gradient-to-br from-accent to-[#9b7bff] bg-clip-text font-bold text-transparent">aizona.studio</span>
        </div>
        <SectionHeading
          kicker="How I create"
          title={
            <>
              So here&apos;s what
              <br />
              that looks like.
            </>
          }
        />

        {/* the finished video */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-accent/40 shadow-glow">
          <video
            src="/proweb.mp4"
            controls
            muted
            loop
            playsInline
            preload="metadata"
            className="block aspect-video w-full bg-ink-2 object-cover"
          />
        </div>

        {/* step — characters */}
        <p className="mt-24 max-w-[24ch] font-display text-[clamp(22px,3vw,40px)] uppercase leading-[1.15] tracking-[-0.02em]">
          First, you design your characters and create a prompt for a{' '}
          <span className="text-accent text-glow">character board.</span>
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <img src="/boards/hero-board.png" alt="DREW — hero character board" loading="lazy" className="w-full rounded-2xl border border-accent/40 bg-ink-2 shadow-glow" />
          <img src="/boards/creature-board.png" alt="ZURG — creature board" loading="lazy" className="w-full rounded-2xl border border-[#9b7bff]/40 bg-ink-2" />
        </div>

        {/* step — storyboard */}
        <p className="mt-24 max-w-[26ch] font-display text-[clamp(22px,3vw,40px)] uppercase leading-[1.15] tracking-[-0.02em]">
          Then you design the story, each frame per beat, and prepare a{' '}
          <span className="text-accent text-glow">storyboard.</span>
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4">
          <img src="/boards/storyboard-1.png" alt="Storyboard — sheet 1" loading="lazy" className="w-full rounded-xl border border-white/12 bg-ink-2" />
          <img src="/boards/storyboard-2.png" alt="Storyboard — sheet 2" loading="lazy" className="w-full rounded-xl border border-white/12 bg-ink-2" />
        </div>

        {/* closing */}
        <p className="mt-24 max-w-[22ch] font-display text-[clamp(22px,3vw,40px)] uppercase leading-[1.15] tracking-[-0.02em]">
          Now you have to <span className="text-accent text-glow">prompt it all together.</span>
        </p>
        <h3 className="mt-10 font-display text-[clamp(34px,6vw,84px)] uppercase leading-[1.0] tracking-[-0.03em]">
          That&apos;s <span className="text-accent text-glow">the work.</span>
        </h3>
        <p className="mt-4 text-[clamp(16px,2vw,24px)] font-semibold text-white/65">AI just makes it real.</p>
      </div>
    </section>
  )
}
