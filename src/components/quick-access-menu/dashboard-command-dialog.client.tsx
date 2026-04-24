"use client"

import { Route } from "next"
import { useTheme } from "next-themes"
import { usePathname, useRouter } from "next/navigation"

import { authClient } from "@/lib/auth/auth-client"
import { isDashboardPath, WebRoutes } from "@/lib/web.routes"
import { useSettingsDialogStore } from "@/features/settings/store/settings-dialog.store"
import type { DashboardCommandActionId } from "@/components/quick-access-menu/dashboard-command-item.types"
import { dashboardCommandItems } from "@/components/quick-access-menu/dashboard-command-items.constants"
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
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const openSettingsDialog = useSettingsDialogStore((state) => state.openDialog)
  const viewerRole = session?.user?.role

  const handleAction = (actionId?: DashboardCommandActionId) => {
    if (!actionId) return

    if (actionId === "logout") {
      void authClient.signOut()
      return
    }

    if (isDashboardPath(pathname)) {
      if (actionId === "open-settings") {
        openSettingsDialog("account")
      }

      if (actionId === "open-notifications") {
        openSettingsDialog("notifications")
      }

      return
    }

    const quickActionRoute = `${WebRoutes.dashboard.path}?quickAction=${actionId}`
    router.push(quickActionRoute as Route)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {dashboardCommandItems
              .filter((item) => {
                if (item.requiresAuth && !session?.user) {
                  return false
                }

                if (!item.requiredRole) {
                  return true
                }
                return item.requiredRole === viewerRole
              })
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
