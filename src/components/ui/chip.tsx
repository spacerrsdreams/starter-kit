import type { ComponentType, SVGProps } from "react"

interface ChipProps {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
}

export function Chip({ Icon, title }: ChipProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium shadow-md">
      <Icon className="size-3.5" />
      {title}
    </div>
  )
}
