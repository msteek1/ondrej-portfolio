import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/* ----------------------------------------------------------------------------
   "How I create" — pinned 3D fly-through (plain three, lazy-loaded).
   video → character boards → storyboard (camera stops) → dissolve to closing.
   Narration = reading-wave caption (words light cyan→white on scroll), anchored
   in a lower band so it never covers the panel. No text scaling.
---------------------------------------------------------------------------- */

const CY = 0x36e0ff
const PU = 0x9b7bff
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))

// reading-wave steps: [start, end, text]. Accent words wrapped in *...*
const NAR: [number, number, string][] = [
  [0.0, 0.2, "So here's what that looks like."],
  [0.2, 0.45, 'First, you design your characters and create a prompt for a *character* *board.*'],
  [0.45, 0.68, 'Then you design the story, each frame per beat, and prepare a *storyboard.*'],
  [0.68, 0.85, 'Now you have to *prompt* *it* *all* *together.*'],
]
const FADE_FROM = 0.85

export default function CreateScene() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const capRef = useRef<HTMLDivElement>(null)
  const stepNRef = useRef<HTMLSpanElement>(null)
  const barsRef = useRef<HTMLDivElement>(null)
  const playRef = useRef<HTMLButtonElement>(null)
  const closingRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const videoElRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const ss = (a: number, b: number, x: number) => {
      const t = clamp((x - a) / (b - a))
      return t * t * (3 - 2 * t)
    }
    const lerpN = (a: number, b: number, t: number) => Math.round(a + (b - a) * t)

    const canvas = canvasRef.current!
    const wrap = wrapRef.current!
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050608)
    scene.fog = new THREE.Fog(0x050608, 16, 56)
    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 200)

    scene.add(new THREE.AmbientLight(0x3a4a5a, 1.2))
    const l1 = new THREE.PointLight(CY, 80, 95); l1.position.set(-8, 5, 6); scene.add(l1)
    const l2 = new THREE.PointLight(PU, 80, 110); l2.position.set(8, 3, -18); scene.add(l2)
    const grid = new THREE.GridHelper(180, 180, CY, 0x112233)
    ;(grid.material as THREE.Material).transparent = true
    ;(grid.material as THREE.Material).opacity = 0.15
    grid.position.y = -2.8; scene.add(grid)

    const disposables: { dispose(): void }[] = []
    const loader = new THREE.TextureLoader()
    // Material that starts dark, then swaps in the loaded image once it arrives.
    const imageMat = (url: string) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0x0b1118 })
      loader.load(url, (tx) => {
        tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4
        mat.map = tx; mat.color.set(0xffffff); mat.needsUpdate = true
        disposables.push(tx)
      })
      return mat
    }
    const panel = (w: number, h: number, material: THREE.Material, accent: number) => {
      const g = new THREE.Group()
      const geo = new THREE.PlaneGeometry(w, h); disposables.push(geo)
      const face = new THREE.Mesh(geo, material); g.add(face)
      const eg = new THREE.EdgesGeometry(geo); disposables.push(eg)
      g.add(new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.9 })))
      const gg = new THREE.PlaneGeometry(w + 0.4, h + 0.4); disposables.push(gg)
      const glow = new THREE.Mesh(gg, new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false }))
      glow.position.z = -0.04; g.add(glow)
      ;(g.userData as { face: THREE.Mesh }).face = face
      return g
    }

    // step 1 — real video
    const vid = document.createElement('video')
    vid.src = '/proweb.mp4'; vid.muted = true; vid.loop = true; vid.playsInline = true; vid.autoplay = true
    vid.play().catch(() => {})
    videoElRef.current = vid
    const vtex = new THREE.VideoTexture(vid); vtex.colorSpace = THREE.SRGBColorSpace; disposables.push(vtex)
    const videoPanel = panel(6, 3.375, new THREE.MeshBasicMaterial({ map: vtex }), CY)
    videoPanel.position.set(0, 0.5, 0); scene.add(videoPanel)
    vid.addEventListener('loadedmetadata', () => {
      const a = vid.videoWidth / vid.videoHeight || 16 / 9
      const f = (videoPanel.userData as { face: THREE.Mesh }).face
      f.geometry.dispose(); f.geometry = new THREE.PlaneGeometry(6, 6 / a)
    })

    // step 2 — character boards (real sheets, ~3:4 portrait)
    const hero = panel(3, 4.2, imageMat('/boards/hero-board.png'), CY)
    hero.position.set(-2.55, 0.5, -11); hero.rotation.y = 0.16; scene.add(hero)
    const crt = panel(3, 4.2, imageMat('/boards/creature-board.png'), PU)
    crt.position.set(2.55, 0.5, -11); crt.rotation.y = -0.16; scene.add(crt)

    // step 3 — storyboard: two real sheets stacked (≈ a square block of all frames)
    const sbW = 5.6, sbH = (sbW * 9) / 16, gap = 0.45
    const sb = new THREE.Group(); sb.position.set(0, 0.7, -22)
    const sheet1 = panel(sbW, sbH, imageMat('/boards/storyboard-1.png'), CY)
    sheet1.position.set(0, (sbH + gap) / 2, 0); sb.add(sheet1)
    const sheet2 = panel(sbW, sbH, imageMat('/boards/storyboard-2.png'), PU)
    sheet2.position.set(0, -(sbH + gap) / 2, 0); sb.add(sheet2)
    scene.add(sb)

    // camera path — ends parked at the storyboard
    const pts = [
      [0, 0.9, 7], [0, 0.6, 4], [0, 0.55, -2], [0.25, 0.5, -9.5], [-0.15, 0.62, -13], [0, 0.7, -15],
    ].map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
    const STOPS: [number, number][] = [[0, 0], [0.16, 0.06], [0.4, 0.45], [0.62, 1], [1, 1]]
    const remap = (s: number) => {
      for (let i = 0; i < STOPS.length - 1; i++) {
        const [a0, a1] = STOPS[i], [b0, b1] = STOPS[i + 1]
        if (s <= b0) return a1 + (b1 - a1) * ((s - a0) / (b0 - a0 || 1))
      }
      return 1
    }

    // ---- caption (reading wave) ----
    const buildWords = (text: string) => {
      const cap = capRef.current!; cap.innerHTML = ''
      const words: HTMLSpanElement[] = []
      text.split(' ').forEach((tok) => {
        const ac = tok.startsWith('*') && tok.endsWith('*')
        const span = document.createElement('span')
        span.textContent = (ac ? tok.slice(1, -1) : tok) + ' '
        span.style.display = 'inline-block'; span.style.whiteSpace = 'pre'
        span.dataset.ac = ac ? '1' : '0'
        span.style.color = 'rgb(120,130,140)'; span.style.opacity = '0.18'
        cap.appendChild(span); words.push(span)
      })
      return words
    }
    let curStep = -1
    let words: HTMLSpanElement[] = []
    const updateCaption = (s: number) => {
      const inClose = s > FADE_FROM
      capRef.current!.style.opacity = inClose ? '0' : '1'
      if (inClose) return
      let i = 0; for (let k = 0; k < NAR.length; k++) if (s >= NAR[k][0]) i = k
      const [a, b, text] = NAR[i]
      const lt = clamp((s - a) / (b - a))
      if (i !== curStep) {
        curStep = i; words = buildWords(text)
        if (stepNRef.current) stepNRef.current.textContent = String(i + 1).padStart(2, '0')
        if (barsRef.current) [...barsRef.current.children].forEach((el, k) => el.classList.toggle('on', k <= i))
      }
      const N = words.length, READ_END = 0.6
      const f = (lt / READ_END) * N
      const fade = 1 - ss(0.86, 1, lt)
      for (let j = 0; j < N; j++) {
        const inten = clamp(f - j)
        const ac = words[j].dataset.ac === '1'
        const tg = ac ? [54, 224, 255] : [255, 255, 255]
        const col = `rgb(${lerpN(120, tg[0], inten)},${lerpN(130, tg[1], inten)},${lerpN(140, tg[2], inten)})`
        words[j].style.color = col
        words[j].style.opacity = String((0.18 + 0.82 * inten) * fade)
        const edge = f - j
        words[j].style.textShadow = edge > 0 && edge < 1.2 ? '0 0 18px rgba(54,224,255,.6)' : 'none'
      }
    }

    // ---- overlay (canvas fade, closing, play, scroll) ----
    const updateOverlay = (s: number) => {
      const inClose = s > FADE_FROM
      canvas.style.opacity = inClose ? String(Math.max(0, 1 - (s - FADE_FROM) / 0.08)) : '1'
      closingRef.current?.classList.toggle('in', s > 0.9)
      if (scrollRef.current) scrollRef.current.style.opacity = s > 0.95 ? '0' : '0.85'
      playRef.current?.classList.toggle('show', s < 0.12 && !inClose)
      if (inClose && stepNRef.current) {
        stepNRef.current.textContent = '04'
        if (barsRef.current) [...barsRef.current.children].forEach((el) => el.classList.add('on'))
      }
    }

    // ---- scroll → progress (relative to this section) ----
    let cur = 0
    const progress = () => {
      const total = wrap.offsetHeight - window.innerHeight
      return total > 0 ? clamp(-wrap.getBoundingClientRect().top / total) : 0
    }
    let mx = 0, my = 0
    const onMove = (e: PointerEvent) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5 }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('resize', onResize)

    const look = new THREE.Vector3()
    renderer.setAnimationLoop(() => {
      const target = progress()
      cur += (target - cur) * 0.06
      const u = remap(cur)
      curve.getPointAt(Math.min(u, 1), camera.position)
      camera.position.x += mx * 0.08; camera.position.y += -my * 0.04
      look.set(camera.position.x * 0.4 + mx * 0.1, 0.5, camera.position.z - 10)
      camera.up.set(0, 1, 0); camera.lookAt(look)
      updateCaption(cur); updateOverlay(cur)
      renderer.render(scene, camera)
    })

    const play = playRef.current
    const onPlay = () => { vid.muted = false; vid.currentTime = 0; vid.play(); play?.classList.remove('show') }
    play?.addEventListener('click', onPlay)

    return () => {
      renderer.setAnimationLoop(null)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      play?.removeEventListener('click', onPlay)
      vid.pause(); vid.src = ''
      disposables.forEach((d) => d.dispose())
      renderer.dispose()
    }
  }, [])

  return (
    <section ref={wrapRef} id="create" className="relative scroll-mt-24" style={{ height: '620vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full transition-opacity duration-200" />

        {/* brand + step indicator */}
        <div className="pointer-events-none absolute left-5 top-5 z-10 md:left-10">
          <div className="font-display text-[14px] tracking-[0.02em]">
            aiz<span className="bg-gradient-to-br from-accent to-[#9b7bff] bg-clip-text text-transparent">o</span>na
            <span className="text-[11px] text-white/45">.studio</span>
          </div>
          <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent">How I create</div>
        </div>
        <div className="pointer-events-none absolute right-5 top-5 z-10 flex items-center gap-2.5 font-display text-[13px] md:right-10">
          <span ref={stepNRef}>01</span><span className="text-white/40">/ 04</span>
          <div ref={barsRef} className="ml-2 flex gap-1.5">
            <i className="hic-bar on" /><i className="hic-bar" /><i className="hic-bar" /><i className="hic-bar" />
          </div>
        </div>

        {/* reading-wave caption (anchored lower band) */}
        <div
          ref={capRef}
          className="pointer-events-none absolute inset-x-0 bottom-[12vh] z-10 mx-auto max-w-[min(1000px,86vw)] px-6 text-center font-display text-[clamp(19px,2.5vw,34px)] uppercase leading-[1.22] tracking-[-0.01em] drop-legible"
        />

        {/* play with sound */}
        <button
          ref={playRef}
          className="play-cta absolute left-1/2 top-[42%] z-20 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-full border border-accent/60 bg-ink/45 px-5 py-3.5 text-[14px] font-bold tracking-[0.04em] opacity-0 shadow-glow backdrop-blur transition"
        >
          <span className="inline-block border-y-[8px] border-l-[13px] border-y-transparent border-l-accent" /> Play with sound
        </button>

        {/* closing (dissolve to site style) */}
        <div ref={closingRef} className="closing pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-[8vw] text-center">
          <div className="cl font-display text-[clamp(38px,7.5vw,112px)] uppercase leading-[1.04] tracking-[-0.02em]">
            That&apos;s <span className="text-accent text-glow">the work.</span>
          </div>
          <div className="cl cl2 mt-6 text-[clamp(17px,2.1vw,28px)] font-semibold text-white/65">AI just makes it real.</div>
        </div>

        {/* persistent scroll indicator */}
        <div ref={scrollRef} className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500">
          <span className="scroll-mouse relative block h-[38px] w-[24px] rounded-[14px] border-2 border-white/55" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/55">scroll</span>
        </div>
      </div>
    </section>
  )
}
