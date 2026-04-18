import { SparklesIcon } from "lucide-react"

export function LogoIcon({ size = 16 }: { size?: number }) {
  const containerSize = size * 2
  const iconSize = size

  return (
    <div
      className="flex aspect-square items-center justify-center rounded-md bg-foreground text-background"
      style={{ height: containerSize, width: containerSize }}
    >
      <SparklesIcon style={{ height: iconSize, width: iconSize }} strokeWidth={1.75} />
    </div>
  )
}
