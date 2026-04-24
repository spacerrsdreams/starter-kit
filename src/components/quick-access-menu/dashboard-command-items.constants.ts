import {
  BellIcon,
  BookMarked,
  Gem,
  HomeIcon,
  MessageCircleCheck,
  MonitorIcon,
  MoonIcon,
  LogOut,
  Send,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
  SunIcon,
} from "lucide-react"

import { WebRoutes } from "@/lib/web.routes"
import type { DashboardCommandItem } from "@/components/quick-access-menu/dashboard-command-item.types"

export const dashboardCommandItems: DashboardCommandItem[] = [
  { label: "Dashboard", icon: HomeIcon, kind: "route", path: WebRoutes.dashboard.path },
  { label: "Marketing", icon: SparklesIcon, kind: "route", path: WebRoutes.root.path },
  { label: "Blog", icon: BookMarked, kind: "route", path: WebRoutes.blog.path },
  { label: "Pricing", icon: Gem, kind: "route", path: WebRoutes.pricing.path },
  { label: "Contact", icon: Send, kind: "route", path: WebRoutes.contact.path },
  { label: "Feedback", icon: MessageCircleCheck, kind: "route", path: WebRoutes.feedback.path },
  { label: "Admin", icon: ShieldIcon, kind: "route", path: WebRoutes.admin.path, requiredRole: "admin" },
  { label: "Settings", icon: SettingsIcon, kind: "action", actionId: "open-settings" },
  { label: "Notifications", icon: BellIcon, kind: "action", actionId: "open-notifications" },
  { label: "Log out", icon: LogOut, kind: "action", actionId: "logout", requiresAuth: true },
  { label: "Dark mode", icon: MoonIcon, kind: "theme", theme: "dark" },
  { label: "Light mode", icon: SunIcon, kind: "theme", theme: "light" },
  { label: "System theme", icon: MonitorIcon, kind: "theme", theme: "system" },
]
