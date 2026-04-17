"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function ChatSessionSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 pt-4">
        <div className="flex justify-start">
          <div className="w-full max-w-xl space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="w-full max-w-lg space-y-2">
            <Skeleton className="ml-auto h-4 w-2/3" />
            <Skeleton className="ml-auto h-4 w-1/2" />
          </div>
        </div>
        <div className="flex justify-start">
          <div className="w-full max-w-2xl space-y-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
        <div className="flex justify-end">
          <div className="w-full max-w-[24rem] space-y-2">
            <Skeleton className="ml-auto h-4 w-3/4" />
            <Skeleton className="ml-auto h-4 w-1/3" />
          </div>
        </div>
      </div>

      <div className="shrink-0 bg-background px-4 pt-3 pb-1 md:pb-4">
        <div className="rounded-2xl border border-input p-3">
          <Skeleton className="h-5 w-1/3" />
          <div className="mt-8 flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
