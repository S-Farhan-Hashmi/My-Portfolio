import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export type GlowRingProps = {
  radius?: number
  tube?: number
  color?: string
  tilt?: [number, number, number]
  speed?: number
  opacity?: number
  position?: [number, number, number]
  segments?: number
}

/**
 * Thin additive ring. Cheap, and with bloom it reads as a light trail
 * rather than a piece of geometry.
 */
export function GlowRing({
  radius = 4.2,
  tube = 0.012,
  color = '#7c5cff',
  tilt = [0, 0, 0],
  speed = 0.25,
  opacity = 0.85,
  position = [0, 0, 0],
  segments = 128,
}: GlowRingProps) {
  const ref = useRef<THREE.Mesh>(null)

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color(color),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed
    }
  })

  return (
    <mesh ref={ref} position={position} rotation={tilt} material={material}>
      <torusGeometry args={[radius, tube, 8, segments]} />
    </mesh>
  )
}
