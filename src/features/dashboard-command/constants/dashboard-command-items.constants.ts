import {
  BellIcon,
  BookOpenIcon,
  HomeIcon,
  MailIcon,
  MessageSquareIcon,
  MonitorIcon,
  MoonIcon,
  SettingsIcon,
  ShieldIcon,
  SparklesIcon,
  SunIcon,
  UserIcon,
} from "lucide-react"

import { WebRoutes } from "@/lib/web.routes"
import type { DashboardCommandItem } from "@/features/dashboard-command/types/dashboard-command-item.types"

export const dashboardCommandItems: DashboardCommandItem[] = [
  { label: "Home", icon: HomeIcon, kind: "route", path: WebRoutes.root.path },
  { label: "Blog", icon: BookOpenIcon, kind: "route", path: WebRoutes.blog.path },
  { label: "Pricing", icon: SparklesIcon, kind: "route", path: WebRoutes.pricing.path },
  { label: "Contact", icon: MailIcon, kind: "route", path: WebRoutes.contact.path },
  { label: "Feedback", icon: MessageSquareIcon, kind: "route", path: WebRoutes.feedback.path },
  { label: "Ask AI", icon: SparklesIcon, kind: "route", path: WebRoutes.dashboard.path },
  { label: "Admin", icon: ShieldIcon, kind: "route", path: WebRoutes.admin.path, requiredRole: "admin" },
  { label: "Settings", icon: SettingsIcon, kind: "action", actionId: "open-settings" },
  { label: "Profile", icon: UserIcon, kind: "action", actionId: "open-profile" },
  { label: "Notifications", icon: BellIcon, kind: "action", actionId: "open-notifications" },
  { label: "Dark mode", icon: MoonIcon, kind: "theme", theme: "dark" },
  { label: "Light mode", icon: SunIcon, kind: "theme", theme: "light" },
  { label: "System theme", icon: MonitorIcon, kind: "theme", theme: "system" },
]
