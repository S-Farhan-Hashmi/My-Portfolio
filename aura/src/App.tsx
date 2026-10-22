import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { Cursor } from '@/components/Cursor'
import { Loader } from '@/components/Loader'
import { Nav } from '@/components/Nav'
import { ScrollRail } from '@/components/ScrollRail'
import { SmoothScroll } from '@/lib/SmoothScroll'
import { setPointer } from '@/lib/scroll'
import { About } from '@/sections/About'
import { Contact } from '@/sections/Contact'
import { Hero } from '@/sections/Hero'
import { Journey } from '@/sections/Journey'
import { Skills } from '@/sections/Skills'
import { Work } from '@/sections/Work'

// three.js + R3F + postprocessing are the bulk of the bundle, so they load
// behind the preloader rather than blocking first paint.
const Canvas3D = lazy(() =>
  import('@/three/Canvas3D').then((m) => ({ default: m.Canvas3D })),
)

export default function App() {
  const [ready, setReady] = useState(false)
  const handleComplete = useCallback(() => setReady(true), [])

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      setPointer(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      )
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <div className="relative min-h-screen bg-void text-white">
      <Loader onComplete={handleComplete} />
      <SmoothScroll />
      <Cursor />

      {/* Fixed WebGL stage sits underneath everything. */}
      <Suspense fallback={null}>
        <Canvas3D />
      </Suspense>

      {/* Ambient colour fields so the page never reads flat black. */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-[70vh] w-[70vh] animate-drift rounded-full bg-violet/12 blur-[140px]" />
        <div className="absolute -right-1/4 bottom-0 h-[60vh] w-[60vh] animate-drift rounded-full bg-cyan/10 blur-[140px] [animation-delay:-8s]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_35%,rgba(4,5,10,0.72)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.055] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <Nav />
      <ScrollRail />

      <main
        className="relative z-10"
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.7s ease 0.15s' }}
      >
        <Hero />
        <About />
        <Skills />
        <Work />
        <Journey />
        <Contact />
      </main>
    </div>
  )
}
