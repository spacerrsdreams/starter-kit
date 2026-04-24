"use client"

import { animate, motionValue, useInView } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

type CountUpNumberAnimationProps = {
  to: number
  from?: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function CountUpNumberAnimation({
  to,
  from = 0,
  duration = 3,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: CountUpNumberAnimationProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!isInView) return

    const mv = motionValue(from)
    const unsubscribe = mv.on("change", (latest) => {
      setValue(latest)
    })

    const controls = animate(mv, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })

    return () => {
      controls.stop()
      unsubscribe()
    }
  }, [duration, from, isInView, to])

  const formattedValue = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }, [decimals, value])

  return (
    <span ref={ref} className={cn(className)}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
