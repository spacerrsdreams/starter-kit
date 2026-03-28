"use client"

import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

import { dashboardCommandItems } from "@/features/dashboard-command/constants/dashboard-command-items.constants"
import type { DashboardCommandActionId } from "@/features/dashboard-command/types/dashboard-command-item.types"
import { useSettingsDialogStore } from "@/features/settings/store/settings-dialog.store"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

type DashboardCommandDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DashboardCommandDialogClient({ open, onOpenChange }: DashboardCommandDialogProps) {
  const { setTheme } = useTheme()
  const router = useRouter()
  const openSettingsDialog = useSettingsDialogStore((state) => state.openDialog)

  const handleAction = (actionId?: DashboardCommandActionId) => {
    if (!actionId) return

    if (actionId === "open-settings" || actionId === "open-profile") {
      openSettingsDialog("account")
    }

    if (actionId === "open-notifications") {
      openSettingsDialog("notifications")
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {dashboardCommandItems
              .filter((item) => item.kind === "route" || item.kind === "action")
              .map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => {
                    if (item.kind === "route" && item.path) {
                      router.push(item.path)
                    }

                    if (item.kind === "action") {
                      handleAction(item.actionId)
                    }

                    onOpenChange(false)
                  }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Appearance">
            {dashboardCommandItems
              .filter((item) => item.kind === "theme")
              .map((item) => (
                <CommandItem
                  key={item.label}
                  onSelect={() => {
                    if (item.theme) {
                      setTheme(item.theme)
                    }
                    onOpenChange(false)
                  }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
