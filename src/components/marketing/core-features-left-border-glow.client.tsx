"use client"

import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { useRef, useState, type PointerEventHandler } from "react"

export function CoreFeaturesLeftBorderGlow() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouseProgress, setMouseProgress] = useState<number | null>(null)

  // ✅ correct scroll behavior
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // smooth physics
  const smooth = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 25,
    mass: 0.5,
  })

  // ✅ trail lags behind (creates falling effect)
  const trailY = useTransform(smooth, [0, 1], ["-20%", "80%"])

  // mouse override
  const clampedMouse = Math.max(0, Math.min(1, mouseProgress ?? 0))
  const mouseTrail = `calc(${clampedMouse * 100}% - 80px)`

  const isMouse = mouseProgress !== null

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return

    const progress = (e.clientY - bounds.top) / bounds.height
    setMouseProgress(progress)
  }

  const handlePointerLeave = () => {
    setMouseProgress(null)
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="inset-y-0 -left-2 hidden w-4 lg:absolute"
    >
      {/* base line */}
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border/15" />

      {/* 🔥 glow trail (directional, falling) */}
      <motion.div
        className="absolute left-1/2 w-[4px] -translate-x-1/2"
        style={{
          top: isMouse ? mouseTrail : trailY,
          height: "140px",
          background: `
            linear-gradient(
              to bottom,
              var(--accent-1) 0%,
              rgba(255, 80, 120, 0.7) 25%,
              rgba(255, 80, 120, 0.3) 55%,
              transparent 100%
            )
          `,
          filter: "blur(8px)",
          opacity: 0.9,
        }}
      />

      {/* core sharp line */}
      <motion.div
        className="absolute left-1/2 w-[1.5px] -translate-x-1/2"
        style={{
          top: isMouse ? mouseTrail : trailY,
          height: "140px",
          background: "var(--accent-1)",
        }}
      />
    </div>
  )
}
