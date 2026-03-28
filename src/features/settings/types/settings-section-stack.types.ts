import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export type SettingsAccountSectionLayoutProps = {
  icon: LucideIcon
  title: string
  description: string
  hasWarning?: boolean
  children: ReactNode
}

export type SettingsNotificationSubsectionProps = {
  icon: LucideIcon
  title: string
  description: string
  toggle?: ReactNode
}

export type SettingsLegalSectionLayoutProps = {
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
}
