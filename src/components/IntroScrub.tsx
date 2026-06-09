import { useEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { ScrollTrigger } from '../lib/gsap'
import { scrollToId } from '../lib/useSmoothScroll'

const N1 = 122
const N2 = 139
const NT = N1 + N2

const pad3 = (n: number) => String(n).padStart(3, '0')
const heroSrc = (i: number) => `/frames/hero/frame${pad3(i)}.webp`
const frontierSrc = (i: number) => `/frames/frontier/framm${pad3(i)}.webp`

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const sm = (e0: number, e1: number, x: number) => {
  x = clamp((x - e0) / (e1 - e0), 0, 1)
  return x * x * (3 - 2 * x)
}

/* Per-beat placement. The text "drifts" through the world instead of sitting in
   one spot — each position is chosen to land over a dark / empty area of that
   specific frame and never cover the subject (see brainstorm placement map).
   drive() still only animates opacity + a small Y rise on top of these. */
const boxBase = 'pointer-events-none absolute z-10 flex flex-col px-[6vw]'
// Full-width bands with internal alignment — so off-center text never overflows
// the viewport. The text-width cap (on `beat`) keeps line length + mobile safety.
const posCenter = `${boxBase} inset-0 items-center justify-center text-center` // beat 1
const posLeft = `${boxBase} inset-0 items-start justify-center text-left` // beat 2
const posTop = `${boxBase} inset-x-0 top-[12vh] items-center text-center` // beat 3
const posRight = `${boxBase} inset-0 items-end justify-center text-right` // beats 4 & 6
const posLowerLeft = `${boxBase} inset-x-0 bottom-[14vh] items-start text-left` // beat 5
const beat = 'font-display text-[clamp(34px,5.2vw,90px)] uppercase leading-[1.0] tracking-[-0.03em] drop-legible'

export default function IntroScrub() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const nameLine2Ref = useRef<HTMLSpanElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)
  const end1Ref = useRef<HTMLDivElement>(null)
  const s2aRef = useRef<HTMLDivElement>(null)
  const s2bRef = useRef<HTMLDivElement>(null)
  const s2cRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const introVh = reduced ? 300 : 1150
    if (wrapRef.current) wrapRef.current.style.height = `${introVh}vh`

    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d', { alpha: false })!
    const s1: HTMLImageElement[] = []
    const s2: HTMLImageElement[] = []

    let raf = 0
    let st: ScrollTrigger | null = null
    let targetP = 0
    let loaderHidden = false
    const renderState: { arr: HTMLImageElement[] | null; fIndex: number } = { arr: null, fIndex: 0 }

    const isReady = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0

    const sizeCanvas = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * d)
      canvas.height = Math.floor(window.innerHeight * d)
    }

    // cover-fit draw of one image at a given alpha (for cross-frame blending)
    const drawCover = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width
      const ch = canvas.height
      const ir = img.width / img.height
      const cr = cw / ch
      let dw: number, dh: number, dx: number, dy: number
      if (ir > cr) {
        dh = ch
        dw = ch * ir
        dx = (cw - dw) / 2
        dy = 0
      } else {
        dw = cw
        dh = cw / ir
        dx = 0
        dy = (ch - dh) / 2
      }
      ctx.globalAlpha = alpha
      ctx.drawImage(img, dx, dy, dw, dh)
      ctx.globalAlpha = 1
    }

    // Render a *fractional* frame by blending the two nearest frames together.
    // This turns a ~12fps sequence into visually smooth motion.
    const renderFrame = (arr: HTMLImageElement[], fIndex: number) => {
      const i0 = Math.floor(fIndex)
      const i1 = Math.min(i0 + 1, arr.length - 1)
      const t = fIndex - i0
      const img0 = arr[i0]
      if (!isReady(img0)) return
      ctx.fillStyle = '#050608'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawCover(img0, 1)
      if (t > 0.02 && isReady(arr[i1])) drawCover(arr[i1], t)
      renderState.arr = arr
      renderState.fIndex = fIndex
    }
    const redraw = () => {
      if (renderState.arr) renderFrame(renderState.arr, renderState.fIndex)
    }

    const setStyle = (el: HTMLElement | null, opacity: number, ty: number) => {
      if (!el) return
      el.style.opacity = String(opacity)
      el.style.transform = `translate3d(0, ${ty}px, 0)`
    }

    const drive = (p: number) => {
      const a = clamp(p / 0.47, 0, 1) // scene 1 local
      const b = clamp((p - 0.5) / 0.5, 0, 1) // scene 2 local

      // Frame mapping with an end-hold per scene so the climactic frame
      // (vortex arrival / cyan mask) is reached *before* the scroll ends and
      // then holds while the final title + CTA are read.
      if (p < 0.49) {
        const aF = clamp(a / 0.9, 0, 1) // reach last hero frame at a=0.9, hold to 1.0
        renderFrame(s1, aF * (N1 - 1))
      } else {
        const bF = clamp(b / 0.82, 0, 1) // reach last frontier frame at b=0.82, hold to 1.0
        renderFrame(s2, bF * (N2 - 1))
      }

      if (flashRef.current)
        flashRef.current.style.opacity = String(sm(0.44, 0.5, p) * (1 - sm(0.5, 0.57, p)))
      if (scrimRef.current) scrimRef.current.style.opacity = String(1 - sm(0.55, 0.85, p) * 0.4)
      if (hintRef.current) hintRef.current.style.opacity = String((1 - sm(0.01, 0.05, p)) * 0.55)

      // ---- Scene 1 story titles ----
      const nameOut = sm(0.18, 0.28, a)
      setStyle(nameRef.current, (p < 0.49 ? 1 : 0) * (1 - nameOut), nameOut * -46)
      if (nameLine2Ref.current) nameLine2Ref.current.style.opacity = String(sm(0.08, 0.17, a))

      const tag = sm(0.3, 0.4, a) * (1 - sm(0.52, 0.62, a))
      setStyle(tagRef.current, p < 0.49 ? tag : 0, (1 - sm(0.3, 0.4, a)) * 40)

      const e1 = sm(0.66, 0.77, a) * (1 - sm(0.9, 0.985, a))
      setStyle(end1Ref.current, p < 0.49 ? e1 : 0, (1 - sm(0.66, 0.77, a)) * 40)

      // ---- Scene 2 beats (wide holds; the last one rides the held final frame) ----
      const aIn = sm(0.06, 0.16, b) * (1 - sm(0.3, 0.38, b))
      setStyle(s2aRef.current, p >= 0.49 ? aIn : 0, (1 - sm(0.06, 0.16, b)) * 40)

      const bIn = sm(0.42, 0.52, b) * (1 - sm(0.64, 0.72, b))
      setStyle(s2bRef.current, p >= 0.49 ? bIn : 0, (1 - sm(0.42, 0.52, b)) * 40)

      const cIn = sm(0.8, 0.9, b)
      setStyle(s2cRef.current, p >= 0.49 ? cIn : 0, (1 - sm(0.8, 0.9, b)) * 40)
      if (s2cRef.current) s2cRef.current.style.pointerEvents = cIn > 0.5 ? 'auto' : 'none'
    }

    // Smooth scroll (Lenis) already interpolates the scroll position, so we map
    // the canvas directly to it — every frame is drawn as we glide past it.
    const loop = () => {
      drive(targetP)
      raf = requestAnimationFrame(loop)
    }

    const onResize = () => {
      sizeCanvas()
      redraw()
    }

    const hideLoader = () => {
      if (loaderHidden || !loaderRef.current) return
      loaderHidden = true
      const lr = loaderRef.current
      lr.style.opacity = '0'
      window.setTimeout(() => {
        lr.style.display = 'none'
      }, 600)
    }

    sizeCanvas()
    window.addEventListener('resize', onResize)

    st = ScrollTrigger.create({
      trigger: wrapRef.current!,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        targetP = self.progress
      },
    })
    raf = requestAnimationFrame(loop)

    let loaded = 0
    const onOne = () => {
      loaded++
      const pct = Math.round((loaded / NT) * 100)
      if (pctRef.current) pctRef.current.textContent = String(pct)
      if (barRef.current) barRef.current.style.width = pct + '%'
      if (loaded >= N1) hideLoader()
    }
    const preload = (arr: HTMLImageElement[], n: number, src: (i: number) => string) => {
      for (let i = 0; i < n; i++) {
        const im = new Image()
        im.onload = onOne
        im.onerror = onOne
        im.src = src(i)
        arr.push(im)
      }
    }
    preload(s1, N1, heroSrc)
    preload(s2, N2, frontierSrc)

    const safety = window.setTimeout(hideLoader, 9000)
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(safety)
      window.removeEventListener('resize', onResize)
      st?.kill()
    }
  }, [])

  return (
    <section ref={wrapRef} id="top" className="relative" style={{ height: '1150vh' }}>
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

        <div
          ref={scrimRef}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, rgba(5,6,8,.92) 0%, rgba(5,6,8,.5) 22%, rgba(5,6,8,.12) 46%, transparent 70%), radial-gradient(95% 60% at 50% 82%, rgba(5,6,8,.45), transparent 76%)',
          }}
        />
        <div
          ref={flashRef}
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, #cffaff 0%, #36e0ff 35%, #0a3a4a 75%, #050608 100%)',
          }}
        />

        {/* Scene 1 — name (builds line by line) — BEAT 1: center */}
        <div ref={nameRef} className={posCenter}>
          <h1 className="title-name font-display text-[clamp(44px,7vw,120px)] uppercase leading-[0.92] tracking-[-0.035em] drop-legible">
            <span className="block">Hi, my name</span>
            <span ref={nameLine2Ref} className="block opacity-0">
              is <span className="border-b-[8px] border-accent pb-1">Ondrej</span>
            </span>
          </h1>
        </div>

        {/* Scene 1 — tagline (cyan) — BEAT 2: left (right side is a bright monitor) */}
        <div ref={tagRef} className={`${posLeft} opacity-0`}>
          <h2 className="font-display text-[clamp(30px,4.9vw,86px)] uppercase leading-[1.02] tracking-[-0.03em] text-accent text-glow drop-legible max-w-[54vw]">
            I connect marketing with the power of AI
          </h2>
        </div>

        {/* Scene 1 — finale — BEAT 3: top (keeps clear of the vortex below) */}
        <div ref={end1Ref} className={`${posTop} opacity-0`}>
          <h2 className={`${beat} max-w-[72vw]`}>
            And I love its <span className="text-accent text-glow">endless possibilities</span>
          </h2>
        </div>

        {/* Scene 2 — beats */}
        {/* BEAT 4: right (sun glows left, dark sandstorm right) */}
        <div ref={s2aRef} className={`${posRight} opacity-0`}>
          <h2 className={`${beat} max-w-[54vw]`}>
            So I set out to <span className="text-accent text-glow">explore them.</span>
          </h2>
        </div>
        {/* BEAT 5: lower-left (clean desert floor, opposite side from beat 4) */}
        <div ref={s2bRef} className={`${posLowerLeft} opacity-0`}>
          <h2 className={`${beat} max-w-[56vw]`}>
            A marketer, <span className="text-accent text-glow">reforged by AI.</span>
          </h2>
        </div>
        {/* BEAT 6: right + CTA (face is centered; clean right side, cyan visor echoes accent) */}
        <div ref={s2cRef} className={`${posRight} opacity-0`}>
          <h2 className={`${beat} max-w-[52vw]`}>
            This is how I <span className="text-accent text-glow">create now.</span>
          </h2>
          <button
            onClick={() => scrollToId('work')}
            className="accent-box mt-8 inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-bold uppercase tracking-[0.05em] shadow-glow transition hover:brightness-110"
          >
            See what I do <ArrowDown size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-[0.25em] text-white/50"
        >
          scroll ↓
        </div>

        {/* Loader */}
        <div
          ref={loaderRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-ink transition-opacity duration-500"
        >
          <div className="text-[11px] uppercase tracking-[0.25em] text-accent">
            Loading the world… <span ref={pctRef}>0</span>%
          </div>
          <div className="h-px w-64 overflow-hidden bg-white/10">
            <div ref={barRef} className="h-full bg-accent shadow-glow" style={{ width: '0%' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
