import "server-only"

import type { CreateCheckoutSessionInput } from "@/features/billing/schemas/create-checkout-session.schema"

export function getStripePriceId(interval: CreateCheckoutSessionInput["interval"]): string {
  if (interval === "yearly") {
    const yearlyPriceId = process.env.STRIPE_PRICE_ID_PRO_YEARLY ?? process.env.STRIPE_PRICE_ID_PRO_YEARLY
    if (!yearlyPriceId) {
      throw new Error("Missing STRIPE_PRICE_ID_PRO_YEARLY")
    }
    return yearlyPriceId
  }

  const monthlyPriceId = process.env.STRIPE_PRICE_ID_PRO_MONTHLY
  if (!monthlyPriceId) {
    throw new Error("Missing STRIPE_PRICE_ID_PRO_MONTHLY")
  }
  return monthlyPriceId
}
