import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { GlowRing } from '@/three/GlowRing'
import { ShaderOrb } from '@/three/ShaderOrb'
import { chapterZ } from '@/three/layout'

/**
 * Chapter 00 — the monolith. One breathing mass of light, wrapped in orbital
 * rings and a counter-rotating wireframe shell.
 */
export function HeroChapter() {
  const shell = useRef<THREE.Mesh>(null)
  const core = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.08
      shell.current.rotation.z = t * 0.05
    }
    if (core.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.12
      core.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={[0, 0, chapterZ(0)]}>
      <ShaderOrb
        radius={2.85}
        detail={40}
        noiseAmp={0.62}
        frequency={1.5}
        speed={1}
        rimPower={2.2}
        glow={1.7}
        colorDeep="#0b0624"
        colorMid="#6d3df5"
        colorRim="#2ee6ff"
      >
        {/* Bright core bleeding through the surface. */}
        <mesh ref={core}>
          <icosahedronGeometry args={[1.15, 12]} />
          <meshBasicMaterial
            color="#c9b6ff"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Counter-rotating wireframe cage. */}
        <mesh ref={shell}>
          <icosahedronGeometry args={[3.55, 2]} />
          <meshBasicMaterial
            color="#5b8cff"
            wireframe
            transparent
            opacity={0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </ShaderOrb>

      <GlowRing radius={4.4} tube={0.014} color="#7c5cff" tilt={[1.15, 0.2, 0]} speed={0.16} />
      <GlowRing radius={5.2} tube={0.01} color="#22d3ee" tilt={[0.35, 1.1, 0.4]} speed={-0.11} opacity={0.6} />
      <GlowRing radius={3.6} tube={0.008} color="#ff4d8d" tilt={[2.1, -0.4, 0.9]} speed={0.22} opacity={0.4} />

      {/* Ground light pool under the orb. */}
      <mesh position={[0, -4.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7, 64]} />
        <meshBasicMaterial
          color="#4f46e5"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
