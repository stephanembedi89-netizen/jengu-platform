'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'blue' | 'cyan' | 'amber'
  hover?: boolean
}

const glowMap = {
  blue:  'hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:border-blue-500/40',
  cyan:  'hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:border-cyan-500/40',
  amber: 'hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] hover:border-amber-400/40',
}

export default function GlassCard({
  children,
  className = '',
  glowColor = 'blue',
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.25 }}
      className={`glass p-6 transition-all duration-300 ${hover ? glowMap[glowColor] : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
