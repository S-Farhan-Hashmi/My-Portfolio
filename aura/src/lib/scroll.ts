import { useSyncExternalStore } from 'react'
import { CHAPTER_COUNT } from '@/data/portfolio'

export type ScrollState = {
  /** 0 → 1 across the whole document. */
  progress: number
  /** Raw pixel scroll offset. */
  scroll: number
  /** Smoothed pixels-per-second-ish velocity. */
  velocity: number
  /** -1 up, 1 down. */
  direction: number
  /** Index of the chapter currently in focus. */
  active: number
  /** Normalised pointer position, -1 → 1. */
  pointer: { x: number; y: number }
}

export const scrollState: ScrollState = {
  progress: 0,
  scroll: 0,
  velocity: 0,
  direction: 1,
  active: 0,
  pointer: { x: 0, y: 0 },
}

type Listener = () => void
const listeners = new Set<Listener>()
let frame = -1

function flush() {
  frame = -1
  for (const listener of listeners) listener()
}

function emit() {
  if (frame !== -1) return
  frame = requestAnimationFrame(flush)
}

export function setScrollState(patch: Partial<ScrollState>) {
  let changed = false
  for (const key of Object.keys(patch) as (keyof ScrollState)[]) {
    if (scrollState[key] !== patch[key]) {
      changed = true
      break
    }
  }
  if (!changed) return
  Object.assign(scrollState, patch)
  emit()
}

export function setPointer(x: number, y: number) {
  scrollState.pointer.x = x
  scrollState.pointer.y = y
}

type LenisLike = {
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void
}

export const lenisRef: { current: LenisLike | null } = { current: null }

/** Smooth-scroll to a section id, falling back to native scrolling. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el, { duration: 1.25 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * React binding for the focused chapter index. Renders only when the chapter
 * actually changes, so it is safe to use in hot render paths.
 */
export function useActiveChapter() {
  return useSyncExternalStore(
    subscribe,
    () => scrollState.active,
    () => 0,
  )
}

/** Fine-grained progress binding for DOM chrome (nav, rail, readouts). */
export function useScrollProgress() {
  return useSyncExternalStore(
    subscribe,
    () => scrollState.progress,
    () => 0,
  )
}

export function chapterFromProgress(progress: number) {
  return Math.min(CHAPTER_COUNT - 1, Math.max(0, Math.round(progress * (CHAPTER_COUNT - 1))))
}
