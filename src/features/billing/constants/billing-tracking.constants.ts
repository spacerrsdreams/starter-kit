export const BILLING_TRACKING_EVENT_NAME = "billing:interaction"

export const BILLING_TRACKING_EVENTS = {
  ctaClicked: "cta_clicked",
  checkoutRedirected: "checkout_redirected",
  portalRedirected: "portal_redirected",
  ctaFailed: "cta_failed",
} as const

export type BillingTrackingEventType = (typeof BILLING_TRACKING_EVENTS)[keyof typeof BILLING_TRACKING_EVENTS]
