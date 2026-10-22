import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { HOLO_FRAGMENT, HOLO_VERTEX } from '@/shaders/holo'

export type HoloPanelProps = {
  width?: number
  height?: number
  colorA?: string
  colorB?: string
  lineColor?: string
  opacity?: number
  grid?: number
  scan?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
}

/**
 * Holographic readout panel — gradient body, blueprint grid, sweeping
 * scanline and a bright border. Used as scenery behind the DOM content.
 */
export function HoloPanel({
  width = 4,
  height = 6,
  colorA = '#0b1030',
  colorB = '#5b3df5',
  lineColor = '#7de3ff',
  opacity = 0.5,
  grid = 0.35,
  scan = 0.5,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}: HoloPanelProps) {
  const material = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
      uLineColor: { value: new THREE.Color(lineColor) },
      uOpacity: { value: opacity },
      uGrid: { value: grid },
      uScan: { value: scan },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height, 1, 1]} />
      <shaderMaterial
        ref={material}
        vertexShader={HOLO_VERTEX}
        fragmentShader={HOLO_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
