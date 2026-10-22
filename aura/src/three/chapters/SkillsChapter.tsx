import { Html, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { SKILLS } from '@/data/portfolio'
import { chapterZ } from '@/three/layout'
import { ShaderOrb } from '@/three/ShaderOrb'

const CATEGORY_COLOR = {
  Engine: '#22d3ee',
  Craft: '#7c5cff',
  Ship: '#ffb547',
} as const

const LAYOUT = SKILLS.map((_, i) => {
  const t = i / SKILLS.length
  const angle = t * Math.PI * 2 * 2.4
  const radius = 7.4 + Math.sin(t * Math.PI * 3) * 1.6
  return {
    x: Math.cos(angle) * radius,
    y: (i / SKILLS.length - 0.5) * 9.5 + Math.sin(angle * 1.3) * 0.9,
    z: Math.sin(angle) * radius * 0.55,
  }
})

/**
 * Chapter 02 — the constellation. Twelve skills as a slowly turning double
 * spiral, wired together by a light filament.
 */
export function SkillsChapter() {
  const root = useRef<THREE.Group>(null)

  const points = useMemo(
    () =>
      LAYOUT.map((p) => [p.x, p.y, p.z] as [number, number, number]).concat([
        [LAYOUT[0].x, LAYOUT[0].y, LAYOUT[0].z],
      ]),
    [],
  )

  useFrame((_, delta) => {
    if (root.current) {
      root.current.rotation.y += delta * 0.06
    }
  })

  return (
    <group position={[0, 0, chapterZ(2)]}>
      <group ref={root}>
        {SKILLS.map((skill, i) => {
          const p = LAYOUT[i]
          const color = CATEGORY_COLOR[skill.category]
          return (
            <group key={skill.name} position={[p.x, p.y, p.z]}>
              <ShaderOrb
                radius={0.42 + (skill.level / 100) * 0.34}
                detail={6}
                noiseAmp={0.22}
                frequency={3.4}
                speed={1.6}
                rimPower={1.7}
                glow={2.4}
                colorDeep="#05060f"
                colorMid={color}
                colorRim="#ffffff"
                spin={0.4}
              />
              <Html
                center
                distanceFactor={11}
                zIndexRange={[5, 0]}
                style={{ pointerEvents: 'none' }}
              >
                <div className="whitespace-nowrap rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-sans text-[10px] font-medium tracking-[0.16em] text-white/85 uppercase backdrop-blur-md">
                  {skill.name}
                </div>
              </Html>
            </group>
          )
        })}
      </group>

      <Line
        points={points}
        color="#6d8cff"
        lineWidth={1}
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </group>
  )
}
