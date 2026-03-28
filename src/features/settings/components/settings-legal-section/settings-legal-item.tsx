"use client"

import { ChevronRight } from "lucide-react"
import { type Route } from "next"
import Link from "next/link"

type SettingsLegalItemProps = {
  href: Route
  label: string
  description: string
}

export function SettingsLegalItem({ href, label, description }: SettingsLegalItemProps) {
  return (
    <Link
      href={{ pathname: href }}
      className="flex h-auto w-full items-start justify-between gap-4 rounded-lg px-1 py-1 transition-colors hover:bg-muted"
    >
      <div className="space-y-0.5 text-left">
        <p className="text-sm leading-none font-medium text-foreground">{label}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  )
}
