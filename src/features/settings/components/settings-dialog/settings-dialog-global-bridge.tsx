"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { useSettingsDialogStore } from "@/features/settings/store/settings-dialog.store"

function resolveQuickActionSection(action: string | null) {
  if (action === "open-notifications") {
    return "notifications"
  }

  if (action === "open-settings") {
    return "profile"
  }

  return null
}

export function SettingsDialogGlobalBridge() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const open = useSettingsDialogStore((state) => state.open)
  const section = useSettingsDialogStore((state) => state.section)
  const openDialog = useSettingsDialogStore((state) => state.openDialog)
  const closeDialog = useSettingsDialogStore((state) => state.closeDialog)

  useEffect(() => {
    const quickAction = searchParams.get("quickAction")
    const targetSection = resolveQuickActionSection(quickAction)

    if (!targetSection) {
      return
    }

    openDialog(targetSection)
    router.replace(WebRoutes.dashboard.path)
  }, [openDialog, router, searchParams])

  return (
    <SettingsDialog
      open={open}
      onOpenChange={(isOpen) => (!isOpen ? closeDialog() : undefined)}
      defaultSection={section}
    />
  )
}
