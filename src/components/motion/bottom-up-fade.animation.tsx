"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type BottomUpFadeAnimationProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
}

export function BottomUpFadeAnimation({
  children,
  className,
  delay = 0,
  duration = 0.45,
  distance = 24,
}: BottomUpFadeAnimationProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
