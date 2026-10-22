import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'

const PROFILE_NAME = 'Syed Farhan Hashmi'

type PortraitProps = {
  src?: string
  alt?: string
  className?: string
}

/**
 * Holographic portrait frame: rotating conic glow, scanlines, corner
 * brackets and a pointer-tracked tilt so the photo sits inside the 3D world
 * rather than on top of it.
 */
export function Portrait({ src = '/farhan.jpg', alt, className = '' }: PortraitProps) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const spring = { stiffness: 160, damping: 20, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [9, -9]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-11, 11]), spring)
  const glareX = useTransform(px, (v) => `${v * 100}%`)
  const glareY = useTransform(py, (v) => `${v * 100}%`)
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(340px circle at ${x} ${y}, rgba(255,255,255,0.18), transparent 60%)`,
  )

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }

  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div
      ref={ref}
      className={`group relative select-none [perspective:1200px] ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor-label="Hi"
    >
      <motion.div
        className="relative aspect-[4/5] w-full [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Rotating conic glow behind the frame. */}
        <div className="absolute -inset-3 animate-spin-slow rounded-[2rem] opacity-70 blur-xl [background:conic-gradient(from_0deg,transparent_0deg,rgba(34,211,238,0.55)_80deg,transparent_160deg,rgba(124,92,255,0.6)_260deg,transparent_340deg)]" />

        <div className="glass relative h-full overflow-hidden rounded-[1.6rem] p-[3px]">
          <div className="relative h-full w-full overflow-hidden rounded-[1.4rem] bg-void">
            <img
              src={src}
              alt={alt ?? `${PROFILE_NAME}, portrait`}
              className="h-full w-full object-cover object-center scale-[1.02] saturate-[0.85] transition-all duration-700 group-hover:scale-[1.07] group-hover:saturate-100"
              draggable={false}
            />

            {/* Colour wash so the photo belongs to the palette. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-violet/35 via-transparent to-cyan/25 mix-blend-overlay" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/10 to-transparent" />

            {/* Scanlines. */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(to bottom, rgba(255,255,255,0.5) 0 1px, transparent 1px 4px)',
              }}
            />

            {/* Pointer glare. */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: glare }}
            />

            {/* Corner brackets. */}
            <span className="absolute top-3 left-3 h-5 w-5 border-t border-l border-cyan/70" />
            <span className="absolute top-3 right-3 h-5 w-5 border-t border-r border-cyan/70" />
            <span className="absolute bottom-3 left-3 h-5 w-5 border-b border-l border-violet/70" />
            <span className="absolute right-3 bottom-3 h-5 w-5 border-r border-b border-violet/70" />

            {/* Bottom identity strip. */}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex flex-col">
                <span className="font-display text-[11px] font-bold tracking-[0.22em] text-white uppercase">
                  Syed Farhan Hashmi
                </span>
                <span className="font-mono text-[9px] tracking-[0.16em] text-cyan-200/60">
                  RVCE · CSE · 2nd Sem
                </span>
              </div>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
            </div>
          </div>
        </div>

        {/* HUD readout floating off the frame. */}
        <motion.div
          className="glass absolute -right-3 -bottom-5 rounded-xl px-3 py-2 font-mono text-[9px] tracking-[0.14em] text-white/60 sm:-right-6"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div>CGPA <span className="text-cyan-300">9.85</span> / 10</div>
          <div className="mt-0.5 text-white/35">BENGALURU · IN</div>
        </motion.div>
      </motion.div>
    </div>
  )
}
