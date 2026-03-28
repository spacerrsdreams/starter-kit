"use client"

import dynamic from "next/dynamic"

const AiWidget = dynamic(
  () => import("@/features/ai/widget/components/ai-widget.client").then((module) => module.AiWidget),
  {
    ssr: false,
    loading: () => null,
  }
)

export function AiWidgetLazy() {
  return <AiWidget />
}
