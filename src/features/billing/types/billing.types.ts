export type BillingPlan = "free" | "pro"
export type BillingProduct = "monthly" | "yearly"
export type BillingSubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "trialing"
  | "unpaid"

export type BillingSubscriptionSnapshot = {
  plan: BillingPlan
  isPaid: boolean
  currentProduct: BillingProduct | null
  subscriptionStatus: BillingSubscriptionStatus | null
  currentPeriodEnd: string | null
  customerId: string | null
}

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
  product: BillingProduct
}

export type CreateCheckoutSessionResponse = {
  checkoutUrl: string
}

export type CreatePortalSessionResponse = {
  portalUrl: string
}
