"use client"

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

type SettingsLegalSectionLayoutProps = {
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
}

export function SettingsLegalSectionLayout({
  icon: Icon,
  title,
  description,
  children,
}: SettingsLegalSectionLayoutProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm leading-none font-medium text-foreground">{title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="pl-11">{children}</div>
    </section>
  )
}
