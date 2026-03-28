"use client"

import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { useSettingsDialogStore } from "@/features/settings/store/settings-dialog.store"

export function SettingsDialogGlobalBridge() {
  const open = useSettingsDialogStore((state) => state.open)
  const section = useSettingsDialogStore((state) => state.section)
  const closeDialog = useSettingsDialogStore((state) => state.closeDialog)

  return <SettingsDialog open={open} onOpenChange={(isOpen) => (!isOpen ? closeDialog() : undefined)} defaultSection={section} />
}
