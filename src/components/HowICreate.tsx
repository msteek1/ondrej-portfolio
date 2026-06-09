import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Fallback2D } from './howicreate/Fallback2D'

// three.js is heavy — only pull it in when this section is actually reached.
const CreateScene = lazy(() => import('./howicreate/CreateScene'))

function supportsWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

/** A blank section of the same height as the 3D scene, so layout/scroll stay
    stable before three.js has loaded. */
function Placeholder() {
  return <section id="create" className="bg-ink" style={{ height: '620vh' }} aria-hidden />
}

export function HowICreate() {
  // decide once on mount (client only)
  const [mode] = useState<'3d' | '2d'>(() => {
    if (typeof window === 'undefined') return '2d'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return reduced || !supportsWebGL() ? '2d' : '3d'
  })
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode !== '3d') return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: '800px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mode])

  if (mode === '2d') return <Fallback2D />

  return (
    <div ref={ref}>
      {show ? (
        <Suspense fallback={<Placeholder />}>
          <CreateScene />
        </Suspense>
      ) : (
        <Placeholder />
      )}
    </div>
  )
}
