import type Stripe from "stripe"

import type { BillingSubscriptionStatus } from "@/features/billing/types/billing.types"

export type StripeSubscriptionStatus = Stripe.Subscription.Status

export type BillingSnapshotInput = {
  customerId: string | null
  stripePriceId?: string | null
  subscriptionStatus?: BillingSubscriptionStatus | null
  currentPeriodEnd?: Date | null
}

export type UpdateSubscriptionFromStripeParams = {
  customerId: string
  subscriptionId: string | null
  priceId: string | null
  subscriptionStatus: BillingSubscriptionStatus | null
  currentPeriodEnd: Date | null
}
