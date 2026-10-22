import Lenis from 'lenis'
import { useEffect } from 'react'
import { chapterFromProgress, lenisRef, setScrollState } from '@/lib/scroll'

const REDUCED = '(prefers-reduced-motion: reduce)'

/**
 * Boots Lenis, keeps it in sync with native scrollbars (so the scrollbar
 * still works and anchors still jump), and publishes progress to the store.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia(REDUCED).matches

    const lenis = new Lenis({
      duration: reduced ? 0 : 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      syncTouch: false,
      touchMultiplier: 1.8,
      wheelMultiplier: 1,
      lerp: reduced ? 1 : 0.12,
    })

    const onScroll = (e: Lenis) => {
      setScrollState({
        progress: e.progress,
        scroll: e.scroll,
        velocity: e.velocity,
        direction: e.direction,
        active: chapterFromProgress(e.progress),
      })
    }

    lenis.on('scroll', onScroll)
    onScroll(lenis)
    lenisRef.current = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.off('scroll', onScroll)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return null
}
