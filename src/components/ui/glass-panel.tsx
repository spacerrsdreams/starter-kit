import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type GlassPanelProps = {
  children: ReactNode
  className?: string
  innerClassName?: string
}

export function GlassPanel({ children, className, innerClassName }: GlassPanelProps) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-secondary/90 p-6", className)}>
      <div className={cn("rounded-xl border border-border/70 bg-card/85 p-6 md:p-8", innerClassName)}>{children}</div>
    </div>
  )
}
