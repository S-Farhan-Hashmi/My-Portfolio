import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type LoaderProps = {
  onComplete?: () => void
}

/**
 * Boot sequence. Counts to 100 while the first frames of the scene compile,
 * then wipes upward.
 */
export function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const frame = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const duration = 2000

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // Ease-out so it races then settles.
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * 100))

      if (t < 1) {
        frame.current = requestAnimationFrame(tick)
      } else {
        setDone(true)
        onComplete?.()
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.55]"
            style={{
              background:
                'radial-gradient(60% 45% at 50% 50%, rgba(124,92,255,0.16), transparent 70%)',
            }}
          />

          <div className="relative flex flex-col items-center gap-8">
            <motion.h1
              className="font-display text-[clamp(3rem,14vw,9rem)] leading-none font-bold tracking-[-0.06em]"
              initial={{ opacity: 0, y: 24, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-gradient">AURA</span>
            </motion.h1>

            <motion.p
              className="font-sans text-[11px] tracking-[0.55em] text-white/40 uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              Initialising renderer
            </motion.p>

            <div className="relative h-px w-[min(70vw,420px)] overflow-hidden bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet to-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex w-[min(70vw,420px)] items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/35">
              <span>WEBGL / REALTIME</span>
              <span className="tabular-nums text-white/70">
                {String(progress).padStart(3, '0')}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
