"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function SidebarFooterSkeleton() {
  return (
    <div className="flex h-12 w-full items-center gap-2 px-2">
      <Skeleton className="size-8 rounded-full" />
      <div className="grid flex-1 gap-1">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="size-4 rounded-sm" />
    </div>
  )
}
