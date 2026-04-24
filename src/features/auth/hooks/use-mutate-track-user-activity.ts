"use client"

import { useMutation } from "@tanstack/react-query"

import { trackUserActivityApi } from "@/features/auth/api/track-user-activity.api"

export function useMutateTrackUserActivity() {
  return useMutation({
    mutationFn: trackUserActivityApi,
  })
}
