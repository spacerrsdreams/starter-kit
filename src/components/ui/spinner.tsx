import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

export const Spinner = ({
  className,
  centered = false,
  ...props
}: React.ComponentProps<"svg"> & { centered?: boolean }) => {
  const Component = <Loader2Icon role="status" className={cn("size-4 animate-spin", className)} {...props} />

  if (centered) {
    return <div className="flex size-full items-center justify-center">{Component}</div>
  }

  return <Loader2Icon role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
}

export const SpinnerWithBackdrop = ({ label }: { label: string }) => {
  return (
    <div className="fixed inset-0 isolate z-50 flex items-center justify-center bg-black/10 supports-backdrop-filter:backdrop-blur-xs">
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 shadow-lg">
        <Spinner className="size-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  )
}
