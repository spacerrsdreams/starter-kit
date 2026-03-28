"use client"

import { useState } from "react"

import { SettingsDialog as FeatureSettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { Button } from "@/components/ui/button"

export function SettingsDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        Open Settings
      </Button>
      <FeatureSettingsDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
