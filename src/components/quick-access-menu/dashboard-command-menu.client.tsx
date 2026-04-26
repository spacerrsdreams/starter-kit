"use client"

import { SearchIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

const DashboardCommandDialogClient = dynamic(
  () =>
    import("@/components/quick-access-menu/dashboard-command-dialog.client").then(
      (module) => module.DashboardCommandDialogClient
    ),
  { ssr: false }
)

type QuickAccessMenuTriggerProps = {
  renderTrigger?: (open: () => void) => ReactNode
}

export function DashboardCommandMenu({ renderTrigger }: QuickAccessMenuTriggerProps) {
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
