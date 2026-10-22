import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Bloom is what turns "3D shapes" into "light". Everything else here is
 * subtle grain and lens character on top.
 */
export function Effects() {
  const aberration = useMemo(() => new THREE.Vector2(0.00055, 0.0009), [])

  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        intensity={1.35}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.55}
        mipmapBlur
        radius={0.72}
      />
      <ChromaticAberration
        offset={aberration}
        radialModulation
        modulationOffset={0.35}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.42} />
      <Vignette eskil={false} offset={0.22} darkness={0.85} />
    </EffectComposer>
  )
}
