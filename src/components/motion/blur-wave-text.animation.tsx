"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

export function BlurWaveTextAnimation({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ")
  const wordStartIndexes = words.map((_, wordIndex) =>
    words.slice(0, wordIndex).reduce((total, word) => total + word.length, 0)
  )

  return (
    <div className={cn("flex flex-wrap", className)}>
      {words.map((word, wordIndex) => {
        const wordStartIndex = wordStartIndexes[wordIndex]

        return (
          <span
            key={`${word}-${wordIndex}`}
            className={cn("inline-flex whitespace-nowrap", wordIndex < words.length - 1 && "mr-[0.3em]")}
          >
            {word.split("").map((char, charIndex) => (
              <motion.span
                key={`${word}-${char}-${charIndex}`}
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
                  delay: (wordStartIndex + charIndex) * 0.04,
                  duration: 0.4,
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        )
      })}
    </div>
  )
}
