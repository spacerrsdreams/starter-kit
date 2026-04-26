"use client"

import {
  BILLING_TRACKING_EVENT_NAME,
  type BillingTrackingEventType,
} from "@/features/billing/constants/billing-tracking.constants"

type TrackBillingEventPayload = {
  type: BillingTrackingEventType
  source: "sidebar_upgrade_cta"
  plan: "free" | "pro"
}

export function trackBillingEvent(payload: TrackBillingEventPayload) {
  window.dispatchEvent(
    new CustomEvent(BILLING_TRACKING_EVENT_NAME, {
      detail: {
        ...payload,
        at: new Date().toISOString(),
      },
    })
  )
}
