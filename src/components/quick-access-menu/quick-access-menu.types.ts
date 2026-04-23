import type { ReactNode } from "react"

export type QuickAccessMenuTriggerProps = {
  renderTrigger?: (open: () => void) => ReactNode
}
