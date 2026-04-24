import type Stripe from "stripe"

export type BillingPlan = "free" | "pro"
export type BillingProduct = "monthly" | "yearly"

export type BillingSubscriptionSnapshot = {
  plan: BillingPlan
  isPaid: boolean
  currentProduct: BillingProduct | null
  subscriptionStatus: Stripe.Subscription.Status | null
  currentPeriodEnd: string | null
  customerId: string | null
}
