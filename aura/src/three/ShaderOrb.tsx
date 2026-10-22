import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ORB_FRAGMENT, ORB_VERTEX } from '@/shaders/orb'

export type OrbUniforms = {
  uTime: { value: number }
  uNoiseAmp: { value: number }
  uFrequency: { value: number }
  uSpeed: { value: number }
  uColorDeep: { value: THREE.Color }
  uColorMid: { value: THREE.Color }
  uColorRim: { value: THREE.Color }
  uRimPower: { value: number }
  uGlow: { value: number }
  uOpacity: { value: number }
}

export type ShaderOrbProps = {
  radius?: number
  detail?: number
  noiseAmp?: number
  frequency?: number
  speed?: number
  rimPower?: number
  glow?: number
  opacity?: number
  colorDeep?: string
  colorMid?: string
  colorRim?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  spin?: number
  children?: React.ReactNode
}

/**
 * A noise-displaced sphere with fresnel rim light and iridescent sheen.
 * The displacement is what makes it read as a living, breathing mass rather
 * than a flat primitive.
 */
export function ShaderOrb({
  radius = 2.6,
  detail = 32,
  noiseAmp = 0.55,
  frequency = 1.6,
  speed = 1,
  rimPower = 2.4,
  glow = 1.5,
  opacity = 1,
  colorDeep = '#120a33',
  colorMid = '#5b3df5',
  colorRim = '#22d3ee',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  spin = 0.06,
  children,
}: ShaderOrbProps) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const group = useRef<THREE.Group>(null)

  const uniforms = useMemo<OrbUniforms>(
    () => ({
      uTime: { value: 0 },
      uNoiseAmp: { value: noiseAmp },
      uFrequency: { value: frequency },
      uSpeed: { value: speed },
      uColorDeep: { value: new THREE.Color(colorDeep) },
      uColorMid: { value: new THREE.Color(colorMid) },
      uColorRim: { value: new THREE.Color(colorRim) },
      uRimPower: { value: rimPower },
      uGlow: { value: glow },
      uOpacity: { value: opacity },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (material.current) {
      material.current.uniforms.uTime.value = t
    }
    if (group.current) {
      group.current.rotation.y += delta * spin
      group.current.rotation.x = Math.sin(t * 0.21) * 0.12 + rotation[0]
    }
  })

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh>
        <icosahedronGeometry args={[radius, detail]} />
        <shaderMaterial
          ref={material}
          vertexShader={ORB_VERTEX}
          fragmentShader={ORB_FRAGMENT}
          uniforms={uniforms}
          transparent={opacity < 1}
        />
      </mesh>
      {children}
    </group>
  )
}
