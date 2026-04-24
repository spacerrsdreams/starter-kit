export type SettingsSectionId = "profile" | "account" | "notifications" | "appearance" | "legal"

export type SettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultSection?: SettingsSectionId
}

export type SettingsMobileView = "list" | "section"
