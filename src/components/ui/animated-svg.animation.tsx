"use client"

import { motion, useAnimate } from "motion/react"
import { useEffect, type ReactNode } from "react"

import { cn } from "@/lib/utils"

type AnimatedSvgProps = {
  children: ReactNode
  className?: string
  duration?: number
  repeatIn?: number
}

const SVG_SHAPES_SELECTOR = "path, line, polyline, polygon, rect, circle, ellipse"

export function AnimatedSvg({ children, className, duration = 1, repeatIn = 3 }: AnimatedSvgProps) {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    const container = scope.current as HTMLElement | null
    const svg = container?.querySelector("svg")

    if (!container || !svg) return

    const shapes = Array.from(container.querySelectorAll(SVG_SHAPES_SELECTOR))
    for (const shape of shapes) {
      if (!shape.closest("defs")) {
        const svgShape = shape as SVGElement
        svgShape.style.stroke = "currentColor"
        svgShape.style.strokeLinecap = "round"
        svgShape.style.strokeLinejoin = "round"
      }
    }

    const repeatDelay = Math.max(0, repeatIn - duration)
    const controls = animate(
      SVG_SHAPES_SELECTOR,
      { pathLength: [0, 1], pathOffset: [1, 0] },
      { duration, ease: "easeInOut", repeat: Infinity, repeatDelay }
    )

    return () => {
      controls.cancel()
    }
  }, [animate, duration, repeatIn, scope])

  return (
    <motion.span ref={scope} className={cn("inline-flex", className)}>
      {children}
    </motion.span>
  )
}
