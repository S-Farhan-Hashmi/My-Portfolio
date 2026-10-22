import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { PROJECTS } from '@/data/portfolio'
import { chapterZ } from '@/three/layout'
import { HoloPanel } from '@/three/HoloPanel'

/**
 * Chapter 03 — the archive. One holographic slab per project, tinted with
 * that project's accent, floating in a shallow arc behind the cards.
 */
export function WorkChapter() {
  const root = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (root.current) {
      root.current.rotation.y = Math.sin(t * 0.12) * 0.08
    }
  })

  return (
    <group position={[0, 0, chapterZ(3)]}>
      <group ref={root}>
        {PROJECTS.map((project, i) => {
          const t = PROJECTS.length === 1 ? 0 : i / (PROJECTS.length - 1) - 0.5
          const x = t * 22
          const z = -Math.abs(t) * 5.5
          return (
            <group key={project.title} position={[x, 0, z]}>
              <HoloPanel
                position={[0, 0, 0]}
                rotation={[0, -t * 0.5, 0]}
                width={4.4}
                height={6.4}
                colorA="#050818"
                colorB={project.accent}
                lineColor={project.accent}
                opacity={0.42}
                grid={0.3}
                scan={0.45}
              />
              <mesh position={[0, -3.6, 0.2]}>
                <planeGeometry args={[4.4, 0.02]} />
                <meshBasicMaterial
                  color={project.accent}
                  transparent
                  opacity={0.7}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>
            </group>
          )
        })}
      </group>

      {/* Horizon beam running behind the panels. */}
      <mesh position={[0, 0, -8]} rotation={[0, 0, 0]}>
        <planeGeometry args={[40, 0.015]} />
        <meshBasicMaterial
          color="#7c5cff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
