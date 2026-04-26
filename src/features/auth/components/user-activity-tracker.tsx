"use client"

import { useEffect, useMemo } from "react"

import { useMutateTrackUserActivity } from "@/features/auth/hooks/use-mutate-track-user-activity"
import { authClient } from "@/features/auth/lib/auth-client"
import { useUserActivityStore } from "@/features/auth/store/user-activity.store"

function getTodayDateKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function UserActivityTracker() {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const trackActivityMutation = useMutateTrackUserActivity()
  const userId = session?.user?.id
  const todayKey = useMemo(() => getTodayDateKey(), [])
  const lastTrackedDate = useUserActivityStore((state) =>
    userId ? state.lastTrackedDateByUserId[userId] : undefined
  )
  const markTracked = useUserActivityStore((state) => state.markTracked)

  useEffect(() => {
    if (isSessionPending || !userId || trackActivityMutation.isPending) {
      return
    }

    if (lastTrackedDate === todayKey) {
      return
    }

    trackActivityMutation.mutate(undefined, {
      onSuccess: () => {
        markTracked(userId, todayKey)
      },
    })
  }, [isSessionPending, userId, trackActivityMutation, lastTrackedDate, todayKey, markTracked])

  return null
}
