import "server-only"

import { getStripeClient } from "@/lib/stripe/stripe"

function getRequiredEnv(
  name: "STRIPE_PRICE_ID_PRO_MONTHLY" | "STRIPE_PRICE_ID_PRO_YEARLY"
) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}`)
  }
  return value
}

export async function getBillingProductsSnapshot() {
  const stripe = getStripeClient()
  const monthlyPriceId = getRequiredEnv("STRIPE_PRICE_ID_PRO_MONTHLY")
  const yearlyPriceId = getRequiredEnv("STRIPE_PRICE_ID_PRO_YEARLY")

  const [monthlyPrice, yearlyPrice] = await Promise.all([
    stripe.prices.retrieve(monthlyPriceId),
    stripe.prices.retrieve(yearlyPriceId),
  ])

  if (monthlyPrice.unit_amount === null || yearlyPrice.unit_amount === null) {
    throw new Error("Stripe price is missing unit_amount")
  }

  return {
    monthly: {
      unitAmount: monthlyPrice.unit_amount,
      currency: monthlyPrice.currency,
    },
    yearly: {
      unitAmount: yearlyPrice.unit_amount,
      currency: yearlyPrice.currency,
    },
  }
}
