import { Bell, Palette, Settings, Shield, type LucideIcon } from "lucide-react"

import type { SettingsSectionId } from "@/features/settings/types/settings-dialog.types"

export type SettingsNavItem = {
  id: SettingsSectionId
  label: string
  icon: LucideIcon
}

export const settingsNavItems: SettingsNavItem[] = [
  { id: "account", label: "Account", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "legal", label: "Legal", icon: Shield },
]
