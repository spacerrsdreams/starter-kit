"use client"

import dynamic from "next/dynamic"
import { SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"

import type { DashboardCommandMenuProps } from "@/features/dashboard-command/types/dashboard-command-menu.types"
import { Button } from "@/components/ui/button"

const DashboardCommandDialogClient = dynamic(
  () =>
    import("@/features/dashboard-command/components/dashboard-command-dialog.client").then(
      (module) => module.DashboardCommandDialogClient
    ),
  { ssr: false }
)

export function DashboardCommandMenu({ renderTrigger }: DashboardCommandMenuProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (typeof event.key !== "string") {
        return
      }

      const isShortcut = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)
      if (!isShortcut) {
        return
      }

      event.preventDefault()
      setOpen((currentOpen) => !currentOpen)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return (
    <>
      {renderTrigger ? (
        renderTrigger(() => setOpen(true))
      ) : (
        <Button onClick={() => setOpen(true)} variant="outline" className="w-fit">
          <SearchIcon />
          Open Menu
        </Button>
      )}

      {open ? <DashboardCommandDialogClient open={open} onOpenChange={setOpen} /> : null}
    </>
  )
}
