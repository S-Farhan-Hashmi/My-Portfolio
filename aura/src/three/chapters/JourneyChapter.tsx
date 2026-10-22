import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { TIMELINE } from '@/data/portfolio'
import { chapterZ } from '@/three/layout'

const NODE_COUNT = TIMELINE.length

/**
 * Chapter 04 — the ascent. A vertical helix of nodes climbing the corridor,
 * one node per role, wired into a single rising thread.
 */
export function JourneyChapter() {
  const root = useRef<THREE.Group>(null)

  const { points, nodes } = useMemo(() => {
    const pts: [number, number, number][] = []
    const ns: { position: [number, number, number]; color: string }[] = []
    const steps = 64

    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const angle = t * Math.PI * 3.4
      const radius = 3.4 + Math.sin(t * Math.PI) * 1.6
      const y = (t - 0.5) * 13
      pts.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.5])
    }

    for (let i = 0; i < NODE_COUNT; i++) {
      const t = (i + 0.5) / NODE_COUNT
      const angle = t * Math.PI * 3.4
      const radius = 3.4 + Math.sin(t * Math.PI) * 1.6
      const y = (t - 0.5) * 13
      ns.push({
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.5],
        color: ['#22d3ee', '#7c5cff', '#ffb547'][i % 3],
      })
    }

    return { points: pts, nodes: ns }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (root.current) {
      root.current.rotation.y = t * 0.09
      root.current.position.y = Math.sin(t * 0.5) * 0.35
    }
  })

  return (
    <group position={[0, 0, chapterZ(4)]}>
      <group ref={root}>
        <Line
          points={points}
          color="#7c5cff"
          lineWidth={1.2}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
        {nodes.map((node, i) => (
          <mesh key={i} position={node.position}>
            <icosahedronGeometry args={[0.52, 3]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.75}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Faint vertical shaft that the helix climbs. */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 16, 8]} />
        <meshBasicMaterial
          color="#4f46e5"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
