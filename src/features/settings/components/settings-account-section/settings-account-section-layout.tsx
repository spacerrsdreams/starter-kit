"use client"

import type { SettingsAccountSectionLayoutProps } from "@/features/settings/types/settings-section-stack.types"

export function SettingsAccountSectionLayout({
  icon: Icon,
  title,
  description,
  hasWarning,
  children,
}: SettingsAccountSectionLayoutProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {hasWarning && <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />}
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm leading-none font-semibold text-foreground">{title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="pl-11">{children}</div>
    </section>
  )
}
