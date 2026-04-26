import { Bell, Palette, Settings, Shield, UserRound } from "lucide-react"

import type { SettingsNavItem } from "@/features/settings/types/settings.types"

export const settingsNavItems: SettingsNavItem[] = [
  { id: "profile", label: "Profile", icon: UserRound, requiresAuth: true },
  { id: "account", label: "Account", icon: Settings, requiresAuth: true },
  { id: "notifications", label: "Notifications", icon: Bell, requiresAuth: true },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "legal", label: "Legal", icon: Shield },
]

export function getVisibleSettingsNavItems(isAuthenticated: boolean): SettingsNavItem[] {
  return settingsNavItems.filter((item) => !item.requiresAuth || isAuthenticated)
}
