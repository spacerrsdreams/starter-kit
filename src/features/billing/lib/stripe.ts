import "server-only"

import Stripe from "stripe"
import { ServerEnv } from "@/lib/env.server"

export function getStripeClient() {
  const stripeSecretKey = ServerEnv.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY")
  }

  return new Stripe(stripeSecretKey)
}
