import type { BillingSubscriptionSnapshot } from "@/features/billing/types/billing.types"

export type BillingSubscriptionResponse = {
  subscription: BillingSubscriptionSnapshot
}

export type BillingProductsResponse = {
  products: {
    monthly: {
      unitAmount: number
      currency: string
    }
    yearly: {
      unitAmount: number
      currency: string
    }
  }
}

export type CreateCheckoutSessionRequest = {
  product: "monthly" | "yearly"
}

export type CreateCheckoutSessionResponse = {
  checkoutUrl: string
}

export type CreatePortalSessionResponse = {
  portalUrl: string
}
