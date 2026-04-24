import type { LucideIcon } from "lucide-react"
import type { Route } from "next"

export type DashboardCommandItemKind = "route" | "theme" | "action"
export type DashboardCommandActionId = "open-settings" | "open-notifications" | "logout"
export type DashboardCommandItemRole = "admin"

export type DashboardCommandItem = {
  label: string
  icon: LucideIcon
  kind: DashboardCommandItemKind
  path?: Route
  theme?: "light" | "dark" | "system"
  actionId?: DashboardCommandActionId
  requiredRole?: DashboardCommandItemRole
  requiresAuth?: boolean
}
