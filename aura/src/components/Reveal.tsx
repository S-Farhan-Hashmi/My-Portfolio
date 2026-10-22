import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  blur?: number
  className?: string
  once?: boolean
  amount?: number
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  blur = 8,
  className,
  once = true,
  amount = 0.25,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
