import { useRef } from 'react'
import type { ReactNode, MouseEvent as ReactMouseEvent } from 'react'

type Props = {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  strength?: number
  ariaLabel?: string
}

/** Button/link that magnetically follows the cursor on hover. */
export function MagneticButton({ children, href, onClick, className = '', strength = 0.35, ariaLabel }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const move = (e: ReactMouseEvent) => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const leave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }

  const style = { transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)' }

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        ref={ref as any}
        href={href}
        aria-label={ariaLabel}
        onMouseMove={move}
        onMouseLeave={leave}
        className={className}
        style={style}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref as any}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={leave}
      className={className}
      style={style}
    >
      {children}
    </button>
  )
}
