import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { chapterZ } from '@/three/layout'
import { HoloPanel } from '@/three/HoloPanel'
import { GlowRing } from '@/three/GlowRing'

/**
 * Chapter 01 — readouts. Angled holographic panels orbiting a slow core,
 * the visual equivalent of someone talking about themselves.
 */
export function AboutChapter() {
  const root = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (root.current) {
      root.current.rotation.y += delta * 0.045
    }
  })

  return (
    <group position={[0, 0, chapterZ(1)]}>
      <group ref={root}>
        <HoloPanel
          position={[-7.6, 1.2, -1]}
          rotation={[0, 0.62, 0.08]}
          width={3.4}
          height={5.4}
          colorA="#081033"
          colorB="#3b2aa8"
          lineColor="#7de3ff"
          opacity={0.55}
        />
        <HoloPanel
          position={[7.9, -0.6, -2.5]}
          rotation={[0, -0.58, -0.1]}
          width={3.1}
          height={4.6}
          colorA="#0d0626"
          colorB="#6d3df5"
          lineColor="#c6a8ff"
          opacity={0.5}
        />
        <HoloPanel
          position={[3.4, 4.4, -8]}
          rotation={[0.1, -0.2, 0]}
          width={2.6}
          height={3.4}
          colorA="#04202b"
          colorB="#0e7490"
          lineColor="#5eead4"
          opacity={0.42}
        />
        <HoloPanel
          position={[-4.2, -4.6, -9]}
          rotation={[-0.08, 0.25, 0]}
          width={2.4}
          height={3.2}
          colorA="#2b0720"
          colorB="#9d174d"
          lineColor="#ff85b3"
          opacity={0.36}
        />
      </group>

      <GlowRing radius={3.1} tube={0.01} color="#7c5cff" tilt={[1.4, 0.3, 0]} speed={0.3} opacity={0.5} />
      <mesh>
        <icosahedronGeometry args={[1.05, 8]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.42}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
