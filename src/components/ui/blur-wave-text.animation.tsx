"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export function BlurWaveTextAnimation({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("flex flex-wrap", className)}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{
            opacity: 0,
            filter: "blur(12px)",
            y: 8,
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
          }}
          transition={{
            delay: i * 0.04,
            duration: 0.4,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  )
}
