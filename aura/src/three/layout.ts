import { CHAPTER_GAP } from '@/data/portfolio'

/** How far in front of a chapter the camera sits. */
export const CAMERA_OFFSET = 16

/** World-space Z of chapter `index`. The camera flies this corridor. */
export function chapterZ(index: number) {
  return -index * CHAPTER_GAP
}
