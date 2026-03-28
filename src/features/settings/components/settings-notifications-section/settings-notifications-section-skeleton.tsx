"use client"

import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export function SettingsNotificationsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <Skeleton className="h-4 w-72" />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </section>
    </div>
  )
}
