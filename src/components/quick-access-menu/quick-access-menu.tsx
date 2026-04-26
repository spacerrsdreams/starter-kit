"use client"

import { Search } from "lucide-react"

import { DashboardCommandMenu } from "@/components/quick-access-menu/dashboard-command-menu"
import { Button } from "@/components/ui/button"

type QuickAccessMenuProps = {
  renderInlineTrigger?: boolean
}

export function QuickAccessMenu({ renderInlineTrigger = true }: QuickAccessMenuProps) {
  return (
    <DashboardCommandMenu
      renderTrigger={(open) =>
        renderInlineTrigger ? (
          <Button
            variant="outline"
            className="text-chat-surface-foreground placeholder:text-chat-muted w-full justify-between border bg-muted text-xs outline-none dark:bg-transparent"
            onClick={open}
          >
            <div className="flex items-center gap-2">
              <Search className="size-3!" />
              <span>Search anything...</span>
            </div>
          </Button>
        ) : null
      }
    />
  )
}
