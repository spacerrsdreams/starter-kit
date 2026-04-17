import "server-only"

import { NextResponse } from "next/server"

import { getSessionUserId } from "@/lib/auth/auth"
import { getStripeClient } from "@/lib/stripe/stripe"
import { getBillingSubscriptionByUserId } from "@/features/billing/repositories/billing.repository"

function getAppBaseUrl() {
  return process.env.NEXT_PUBLIC_DOMAIN?.replace(/\/$/, "") ?? "http://localhost:3000"
}

export async function POST() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const billing = await getBillingSubscriptionByUserId(userId)
  if (!billing?.stripeCustomerId) {
    return NextResponse.json({ error: "Stripe customer not found" }, { status: 404 })
  }

  const stripe = getStripeClient()
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: billing.stripeCustomerId,
    return_url: `${getAppBaseUrl()}/ai`,
  })

  return NextResponse.json({ portalUrl: portalSession.url })
}
