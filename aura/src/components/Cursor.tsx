import { useEffect, useRef } from 'react'

/**
 * Two-part cursor: a hard dot that tracks exactly, and a soft ring that lags
 * behind it. The ring reacts to whatever is under the pointer.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const eased = { x: pointer.x, y: pointer.y }
    let scale = 1
    let targetScale = 1
    let raf = 0

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
      }
    }

    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null
      const interactive = target?.closest?.('a, button, [data-cursor]')
      const custom = target?.closest?.('[data-cursor-label]')
      targetScale = interactive ? 2.35 : 1
      if (label.current) {
        label.current.textContent = custom?.getAttribute('data-cursor-label') ?? ''
      }
    }

    const onDown = () => {
      targetScale = 0.7
    }
    const onUp = () => {
      targetScale = 1
    }

    const tick = () => {
      eased.x += (pointer.x - eased.x) * 0.14
      eased.y += (pointer.y - eased.y) * 0.14
      scale += (targetScale - scale) * 0.14

      if (ring.current) {
        ring.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%) scale(${scale})`
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={dot}
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(34,211,238,0.85)]"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ring}
        className="absolute top-0 left-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/35 mix-blend-difference"
        style={{ willChange: 'transform' }}
      >
        <span
          ref={label}
          className="font-display text-[7px] font-semibold tracking-[0.2em] text-black uppercase"
        />
      </div>
    </div>
  )
}
