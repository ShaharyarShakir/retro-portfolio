import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import type { StackBreakdown } from './projectsData'
import { techIconUrl, techAccentColor } from './techIcons'

interface TechStackShowcaseProps {
  items:     StackBreakdown[]
  accent?:   string
}

export default function TechStackShowcase({ items, accent = '#c8f135' }: TechStackShowcaseProps) {
  const trackRef    = useRef<HTMLDivElement>(null)
  const tweenRef    = useRef<gsap.core.Tween | null>(null)
  const [paused, setPaused]       = useState(false)
  const [selected, setSelected]   = useState<string | null>(null)

  const doubled = [...items, ...items]

  const stopMotion = useCallback(() => {
    tweenRef.current?.pause()
    setPaused(true)
  }, [])

  const startMotion = useCallback(() => {
    if (selected) return
    tweenRef.current?.play()
    setPaused(false)
  }, [selected])

  useGSAP(() => {
    if (!trackRef.current) return

    const track = trackRef.current

    tweenRef.current = gsap.to(track, {
      xPercent: -50,
      duration: 22,
      ease: 'none',
      repeat: -1,
    })

    return () => {
      tweenRef.current?.kill()
    }
  }, { dependencies: [items] })

  const handleIconClick = (name: string) => {
    stopMotion()
    const next = selected === name ? null : name
    setSelected(next)

    const all = trackRef.current?.querySelectorAll<HTMLButtonElement>('[data-tech-icon]')
    if (next === null) {
      all?.forEach((btn) => {
        gsap.to(btn, { scale: 1, opacity: 1, duration: 0.3 })
        const glow = btn.querySelector('.tech-glow')
        if (glow) gsap.to(glow, { opacity: 0, scale: 0.8, duration: 0.3 })
      })
      tweenRef.current?.play()
      setPaused(false)
      return
    }

    all?.forEach((btn) => {
      const isTarget = btn.dataset.techName === next
      gsap.to(btn, {
        scale: isTarget ? 1.35 : 0.85,
        opacity: isTarget ? 1 : 0.35,
        duration: 0.35,
        ease: 'back.out(1.6)',
      })
      const glow = btn.querySelector('.tech-glow')
      if (glow) {
        gsap.to(glow, {
          opacity: isTarget ? 1 : 0,
          scale: isTarget ? 1.2 : 0.8,
          duration: 0.4,
        })
      }
    })
  }

  const handleIconEnter = (name: string) => {
    if (selected) return
    stopMotion()
    const btn = trackRef.current?.querySelector<HTMLButtonElement>(
      `[data-tech-name="${name}"]`,
    )
    if (!btn) return
    gsap.to(btn, { scale: 1.2, duration: 0.25, ease: 'power2.out' })
    const glow = btn.querySelector('.tech-glow')
    if (glow) gsap.to(glow, { opacity: 0.85, duration: 0.25 })
  }

  const handleIconLeave = (name: string) => {
    if (selected) return
    startMotion()
    const btn = trackRef.current?.querySelector<HTMLButtonElement>(
      `[data-tech-name="${name}"]`,
    )
    if (!btn) return
    gsap.to(btn, { scale: 1, duration: 0.25 })
    const glow = btn.querySelector('.tech-glow')
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.25 })
  }

  return (
    <div className="space-y-10">
      {/* Animated icon belt */}
      <div
        className="relative border border-[#1e1e1e] bg-[#080808] overflow-hidden"
        onMouseEnter={stopMotion}
        onMouseLeave={() => { if (!selected) startMotion() }}
      >
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

        <p className="px-5 pt-4 text-[9px] tracking-[2px] uppercase text-[#333] font-mono">
          {paused ? '// motion paused — click an icon' : '// stack in motion — hover or click'}
        </p>

        <div className="py-8 overflow-hidden">
          <div ref={trackRef} className="flex w-max items-center gap-10 px-6">
            {doubled.map((item, i) => {
              const color = techAccentColor(item.name)
              const isSel = selected === item.name

              return (
                <button
                  key={`${item.name}-${i}`}
                  type="button"
                  data-tech-icon
                  data-tech-name={item.name}
                  onClick={() => handleIconClick(item.name)}
                  onMouseEnter={() => handleIconEnter(item.name)}
                  onMouseLeave={() => handleIconLeave(item.name)}
                  className="relative flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer shrink-0"
                  aria-pressed={isSel}
                  aria-label={`${item.name}, ${item.percent}% of stack`}
                >
                  <span
                    className="tech-glow absolute inset-0 rounded-full opacity-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
                      filter: `blur(12px)`,
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 border border-[#1e1e1e] bg-[#0a0a0a] transition-colors duration-200"
                    style={{
                      boxShadow: isSel ? `0 0 24px ${color}66, 0 0 48px ${color}33` : undefined,
                      borderColor: isSel ? color : '#1e1e1e',
                    }}
                  >
                    <img
                      src={techIconUrl(item.name)}
                      alt=""
                      width={40}
                      height={40}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                      loading="lazy"
                    />
                  </span>
                  <span className="text-[9px] font-mono tracking-[1px] text-[#555] uppercase">
                    {item.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Percentile breakdown */}
      <div>
        <p className="text-[10px] tracking-[3px] text-[#333] uppercase font-mono mb-5">
          <span style={{ color: accent }}>//</span> Stack composition
        </p>
        <ul className="space-y-4">
          {items.map((item) => {
            const color = techAccentColor(item.name)
            const isSel = selected === item.name

            return (
              <li key={item.name}>
                <div className="flex items-center justify-between mb-1.5 gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={techIconUrl(item.name)}
                      alt=""
                      width={16}
                      height={16}
                      className="w-4 h-4 shrink-0 object-contain"
                    />
                    <span
                      className="text-[11px] font-mono truncate transition-colors duration-200"
                      style={{ color: isSel ? color : '#888' }}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    className="text-[11px] font-mono tabular-nums shrink-0 transition-colors duration-200"
                    style={{ color: isSel ? accent : '#555' }}
                  >
                    {item.percent}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#111] border border-[#1e1e1e] overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: isSel ? color : accent,
                      boxShadow: isSel ? `0 0 12px ${color}88` : undefined,
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
