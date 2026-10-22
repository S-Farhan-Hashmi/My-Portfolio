import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

type TiltCardProps = {
  children: ReactNode
  className?: string
  /** Max rotation in degrees. */
  intensity?: number
  /** Lift toward the viewer in px. */
  lift?: number
  glare?: boolean
}

/**
 * Pointer-tracked 3D tilt. On touch devices it degrades to a plain hover
 * state, so nothing breaks on a phone.
 */
export function TiltCard({
  children,
  className = '',
  intensity = 8,
  lift = 18,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const spring = { stiffness: 180, damping: 22, mass: 0.6 }
  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), spring)
  const translateZ = useSpring(useMotionValue(0), spring)
  const glareX = useTransform(px, (v) => `${v * 100}%`)
  const glareY = useTransform(py, (v) => `${v * 100}%`)
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x} ${y}, rgba(255,255,255,0.13), transparent 62%)`,
  )

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
    translateZ.set(lift)
  }

  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    translateZ.set(0)
  }

  return (
    <div ref={ref} className="perspective-[1400px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div
        className={`relative h-full ${className}`}
        style={{ rotateX, rotateY, translateZ, transformStyle: 'preserve-3d' }}
      >
        {children}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: glareBackground }}
          />
        )}
      </motion.div>
    </div>
  )
}
