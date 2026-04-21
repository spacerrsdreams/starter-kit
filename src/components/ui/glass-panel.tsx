import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type GlassPanelProps = {
  children: ReactNode
  className?: string
  innerClassName?: string
  size?: "sm" | "default" | "lg"
}

const sizeClassNameBySize: Record<NonNullable<GlassPanelProps["size"]>, string> = {
  sm: "p-4",
  default: "p-6",
  lg: "p-8",
}

export function GlassPanel({ children, className, innerClassName, size = "default" }: GlassPanelProps) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-secondary/90", sizeClassNameBySize[size], className)}>
      <div className={cn("rounded-xl border border-border/70 bg-card/85", sizeClassNameBySize[size], innerClassName)}>
        {children}
      </div>
    </div>
  )
}
