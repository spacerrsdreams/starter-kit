import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, centered = false, ...props }: React.ComponentProps<"svg"> & { centered?: boolean }) {
  const Component = <Loader2Icon role="status" className={cn("size-4 animate-spin", className)} {...props} />

  if (centered) {
    return <div className="flex size-full items-center justify-center">{Component}</div>
  }

  return <Loader2Icon role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />
}

export { Spinner }
