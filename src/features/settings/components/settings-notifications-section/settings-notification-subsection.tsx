"use client"

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type SettingsNotificationSubsectionProps = {
  icon: LucideIcon
  title: string
  description: string
  toggle?: ReactNode
}

export function SettingsNotificationSubsection({
  icon: Icon,
  title,
  description,
  toggle,
}: SettingsNotificationSubsectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-sm leading-none font-medium text-foreground">{title}</h3>
            {toggle}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </section>
  )
}
