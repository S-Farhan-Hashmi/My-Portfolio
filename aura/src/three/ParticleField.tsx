import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PARTICLE_FRAGMENT, PARTICLE_VERTEX } from '@/shaders/particles'

type ParticleFieldProps = {
  count?: number
  /** Z range the field spans — the camera flies through this corridor. */
  zFrom?: number
  zTo?: number
  radius?: number
  size?: number
  spread?: number
  colorA?: string
  colorB?: string
  opacity?: number
  depthWrite?: boolean
}

/** Deterministic PRNG so the field never reshuffles between renders. */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function ParticleField({
  count = 2800,
  zFrom = 40,
  zTo = -240,
  radius = 78,
  size = 2.4,
  spread = 0.9,
  colorA = '#7c5cff',
  colorB = '#22d3ee',
  opacity = 0.9,
  depthWrite = false,
}: ParticleFieldProps) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const points = useRef<THREE.Points>(null)
  const { viewport } = useThree()

  const { positions, seeds, scales } = useMemo(() => {
    const rand = mulberry32(1337)
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const scales = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // sqrt keeps the disc evenly filled rather than clumped in the middle.
      const angle = rand() * Math.PI * 2
      const r = Math.sqrt(rand()) * radius
      positions[i * 3 + 0] = Math.cos(angle) * r
      positions[i * 3 + 1] = Math.sin(angle) * r * 0.62
      positions[i * 3 + 2] = zFrom + rand() * (zTo - zFrom)
      seeds[i] = rand()
      scales[i] = 0.35 + rand() * 1.25
    }

    return { positions, seeds, scales }
  }, [count, radius, zFrom, zTo])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: size },
      uSpread: { value: spread },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uOpacity: { value: opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state) => {
    if (!material.current) return
    material.current.uniforms.uTime.value = state.clock.elapsedTime
    material.current.uniforms.uPixelRatio.value = Math.min(viewport.dpr, 2)
  })

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={PARTICLE_VERTEX}
        fragmentShader={PARTICLE_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={depthWrite}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
