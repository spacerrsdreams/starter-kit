"use client"

import dynamic from "next/dynamic"

const QuickAccessMenu = dynamic(
  () => import("@/components/quick-access-menu/quick-access-menu").then((module) => module.QuickAccessMenu),
  {
    ssr: false,
  }
)

type QuickAccessMenuLazyProps = {
  renderInlineTrigger?: boolean
}

export function QuickAccessMenuLazy({ renderInlineTrigger = true }: QuickAccessMenuLazyProps) {
  return <QuickAccessMenu renderInlineTrigger={renderInlineTrigger} />
}
