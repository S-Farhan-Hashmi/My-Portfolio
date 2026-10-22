import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { chapterZ } from '@/three/layout'
import { GlowRing } from '@/three/GlowRing'
import { ShaderOrb } from '@/three/ShaderOrb'

/**
 * Chapter 05 — the send. A single knot of light waiting for a reply.
 */
export function ContactChapter() {
  const knot = useRef<THREE.Mesh>(null)
  const shell = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (knot.current) {
      knot.current.rotation.y += delta * 0.22
      knot.current.rotation.x = Math.sin(t * 0.3) * 0.35
    }
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.12
      shell.current.rotation.z = t * 0.08
    }
  })

  return (
    <group position={[0, 0, chapterZ(5)]}>
      <ShaderOrb
        radius={1.15}
        detail={24}
        noiseAmp={0.3}
        frequency={2.6}
        speed={1.4}
        rimPower={1.9}
        glow={2.2}
        colorDeep="#2a0a3d"
        colorMid="#ff4d8d"
        colorRim="#ffd166"
        spin={0.3}
      />

      <mesh ref={knot}>
        <torusKnotGeometry args={[2.35, 0.34, 220, 32, 2, 3]} />
        <meshBasicMaterial
          color="#c4b5fd"
          transparent
          opacity={0.34}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          wireframe
        />
      </mesh>

      <mesh ref={shell}>
        <icosahedronGeometry args={[3.6, 2]} />
        <meshBasicMaterial
          color="#ff85b3"
          wireframe
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <GlowRing radius={5} tube={0.012} color="#ff4d8d" tilt={[1.2, 0.4, 0.2]} speed={0.18} opacity={0.5} />
      <GlowRing radius={6.1} tube={0.008} color="#ffb547" tilt={[0.5, -0.8, 0.6]} speed={-0.13} opacity={0.34} />
    </group>
  )
}
