export function Marquee({
  items,
  speed = 32,
  className = '',
}: {
  items: string[]
  speed?: number
  className?: string
}) {
  const mask = 'linear-gradient(90deg, transparent, #fff 10%, #fff 90%, transparent)'
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-4 font-display text-[clamp(16px,2.2vw,30px)] uppercase tracking-tight text-white/40"
          >
            {t}
            <span className="text-accent/70">/</span>
          </span>
        ))}
      </div>
    </div>
  )
}
