import "server-only"

import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { getStripeClient } from "@/lib/stripe/stripe"
import {
  getBillingSubscriptionByCustomerId,
  updateSubscriptionFromStripe,
  upsertCustomerForUser,
} from "@/features/billing/repositories/billing.repository"

function toDateFromUnixTimestamp(timestamp: number | null | undefined) {
  if (!timestamp) {
    return null
  }
  return new Date(timestamp * 1000)
}

function getSubscriptionCurrentPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end
  return toDateFromUnixTimestamp(currentPeriodEnd)
}

async function syncStripeSubscription(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id
  const existing = await getBillingSubscriptionByCustomerId(customerId)
  if (!existing) {
    return
  }

  await updateSubscriptionFromStripe({
    customerId,
    subscriptionId: subscription.id,
    priceId: subscription.items.data[0]?.price.id ?? null,
    subscriptionStatus: subscription.status,
    currentPeriodEnd: getSubscriptionCurrentPeriodEnd(subscription),
  })
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id
  if (!customerId) {
    return
  }

  if (session.client_reference_id) {
    await upsertCustomerForUser({
      userId: session.client_reference_id,
      customerId,
    })
  }

  if (!session.subscription) {
    return
  }

  const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id
  const stripe = getStripeClient()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  await syncStripeSubscription(subscription)
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe-Signature header" }, { status: 400 })
  }

  const payload = await request.text()
  const stripe = getStripeClient()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown signature verification error"
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncStripeSubscription(event.data.object as Stripe.Subscription)
        break
      }
      default:
        break
    }
  } catch (error) {
    console.error("Stripe webhook processing failed", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
