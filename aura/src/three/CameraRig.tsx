import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { CHAPTER_COUNT, CHAPTER_GAP } from '@/data/portfolio'
import { scrollState } from '@/lib/scroll'
import { CAMERA_OFFSET } from '@/three/layout'

/**
 * The camera flies down a corridor of chapters. Scroll position drives depth,
 * pointer position drives a small parallax offset, and scroll velocity adds a
 * touch of camera roll so fast flicks feel physical.
 */
export function CameraRig() {
  const target = useRef(new THREE.Vector3(0, 0, 0))
  const look = useRef(new THREE.Vector3(0, 0, 0))
  const smoothed = useRef(0)
  const intro = useRef(0)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const camera = state.camera as THREE.PerspectiveCamera
    const targetProgress = scrollState.progress
    smoothed.current += (targetProgress - smoothed.current) * Math.min(1, dt * 4.5)

    intro.current = Math.min(1, intro.current + dt * 0.85)

    const { x: px, y: py } = scrollState.pointer
    const time = performance.now() * 0.001

    const depth = CHAPTER_COUNT - 1
    const p = smoothed.current * depth
    const z = CAMERA_OFFSET - p * CHAPTER_GAP

    // Idle float so the frame is never completely static.
    const idleX = Math.sin(time * 0.22) * 0.9
    const idleY = Math.cos(time * 0.17) * 0.55

    target.current.set(px * 2.1 + idleX, -py * 1.35 + idleY, z)

    camera.position.lerp(target.current, Math.min(1, dt * 3.2))

    look.current.set(
      px * 0.9 + Math.sin(time * 0.13) * 0.4,
      -py * 0.55,
      camera.position.z - CAMERA_OFFSET,
    )
    camera.lookAt(look.current)

    const roll = THREE.MathUtils.clamp(scrollState.velocity * 0.00035, -0.09, 0.09)
    camera.rotation.z += roll

    // A gentle push-in on first load.
    camera.fov = THREE.MathUtils.lerp(camera.fov, 40 - intro.current * 2, dt * 2)
    camera.updateProjectionMatrix()
  })

  return null
}
