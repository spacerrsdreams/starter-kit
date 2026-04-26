"use client"

import { AlertCircle } from "lucide-react"

type SettingsItemIndicatorProps = {
  title: string
}

export function SettingsItemIndicator({ title }: SettingsItemIndicatorProps) {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white [&>svg]:h-3 [&>svg]:w-3"
      title={title}
      aria-hidden
    >
      <AlertCircle />
    </span>
  )
}
