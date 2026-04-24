import "server-only"

import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { prisma } from "@/lib/prisma"
import { WebRoutes } from "@/lib/web.routes"
import { getSessionUserId } from "@/features/auth/lib/auth"
import { getStripeClient } from "@/features/billing/lib/stripe"
import {
  getBillingSubscriptionByUserId,
  updateSubscriptionFromStripe,
  upsertCustomerForUser,
} from "@/features/billing/repositories/billing.repository"
import { createCheckoutSessionSchema } from "@/features/billing/schemas/create-checkout-session.schema"
import { getStripePriceId } from "@/features/billing/utils/get-stripe-price-id.utils"

const BASE_URL = process.env.NEXT_PUBLIC_DOMAIN!

function getSubscriptionCurrentPeriodEnd(subscription: Stripe.Subscription) {
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end
  return currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null
}

export async function POST(request: Request) {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = createCheckoutSessionSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const stripe = getStripeClient()
  const existingBilling = await getBillingSubscriptionByUserId(userId)
  const customerId =
    existingBilling?.stripeCustomerId ??
    (
      await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId,
        },
      })
    ).id

  await upsertCustomerForUser({ userId, customerId })

  const priceId = getStripePriceId(parsed.data.product)
  const appBaseUrl = BASE_URL
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appBaseUrl}${WebRoutes.dashboard.path}?billing=success`,
    cancel_url: `${appBaseUrl}${WebRoutes.dashboard.path}?billing=failed`,
    client_reference_id: userId,
    metadata: {
      userId,
      billingProduct: parsed.data.product,
    },
  })

  if (session.subscription && typeof session.subscription === "string") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    await updateSubscriptionFromStripe({
      customerId,
      subscriptionId: subscription.id,
      priceId: subscription.items.data[0]?.price.id ?? null,
      subscriptionStatus: subscription.status,
      currentPeriodEnd: getSubscriptionCurrentPeriodEnd(subscription),
    })
  }

  if (!session.url) {
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }

  return NextResponse.json({ checkoutUrl: session.url })
}
