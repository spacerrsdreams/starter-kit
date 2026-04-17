import type { BillingSubscriptionSnapshot } from "@/features/billing/types/billing.types"

export type BillingSubscriptionResponse = {
  subscription: BillingSubscriptionSnapshot
}

export type CreateCheckoutSessionRequest = {
  interval: "monthly" | "yearly"
}

export type CreateCheckoutSessionResponse = {
  checkoutUrl: string
}

export type CreatePortalSessionResponse = {
  portalUrl: string
}
