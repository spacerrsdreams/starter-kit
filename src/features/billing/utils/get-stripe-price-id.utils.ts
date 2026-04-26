import "server-only"

import { ServerEnv } from "@/lib/env.server"
import type { CreateCheckoutSessionInput } from "@/features/billing/schemas/create-checkout-session.schema"

export function getStripePriceId(product: CreateCheckoutSessionInput["product"]): string {
  if (product === "yearly") {
    const yearlyPriceId = ServerEnv.STRIPE_PRICE_ID_PRO_YEARLY
    if (!yearlyPriceId) {
      throw new Error("Missing STRIPE_PRICE_ID_PRO_YEARLY")
    }
    return yearlyPriceId
  }

  const monthlyPriceId = ServerEnv.STRIPE_PRICE_ID_PRO_MONTHLY
  if (!monthlyPriceId) {
    throw new Error("Missing STRIPE_PRICE_ID_PRO_MONTHLY")
  }
  return monthlyPriceId
}
