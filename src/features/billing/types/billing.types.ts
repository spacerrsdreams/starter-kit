import type Stripe from "stripe"

export type BillingPlan = "free" | "pro"

export type BillingSubscriptionSnapshot = {
  plan: BillingPlan
  isPaid: boolean
  subscriptionStatus: Stripe.Subscription.Status | null
  currentPeriodEnd: string | null
  customerId: string | null
}
