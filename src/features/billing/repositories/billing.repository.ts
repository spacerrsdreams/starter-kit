import "server-only"

import type Stripe from "stripe"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import type { BillingSubscriptionSnapshot } from "@/features/billing/types/billing.types"

const PaidStripeStatuses = new Set<Stripe.Subscription.Status>(["active", "trialing"])
const stripeSubscriptionStatusSchema = z.enum([
  "active",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "past_due",
  "paused",
  "trialing",
  "unpaid",
])

function parseStripeSubscriptionStatus(value: string | null): Stripe.Subscription.Status | null {
  return stripeSubscriptionStatusSchema.safeParse(value).data ?? null
}

function toSnapshot(params: {
  customerId: string | null
  subscriptionStatus?: Stripe.Subscription.Status | null
  currentPeriodEnd?: Date | null
}): BillingSubscriptionSnapshot {
  const subscriptionStatus = params.subscriptionStatus ?? null
  const isPaid = subscriptionStatus ? PaidStripeStatuses.has(subscriptionStatus) : false

  return {
    plan: isPaid ? "pro" : "free",
    isPaid,
    subscriptionStatus,
    currentPeriodEnd: params.currentPeriodEnd?.toISOString() ?? null,
    customerId: params.customerId,
  }
}

export async function getBillingSubscriptionSnapshot(userId: string): Promise<BillingSubscriptionSnapshot> {
  const existing = await prisma.billingSubscription.findUnique({
    where: { userId },
    select: {
      stripeCustomerId: true,
      stripeStatus: true,
      currentPeriodEnd: true,
    },
  })

  if (!existing) {
    return toSnapshot({
      customerId: null,
    })
  }

  return toSnapshot({
    customerId: existing.stripeCustomerId,
    subscriptionStatus: parseStripeSubscriptionStatus(existing.stripeStatus),
    currentPeriodEnd: existing.currentPeriodEnd,
  })
}

export async function upsertCustomerForUser(params: { userId: string; customerId: string }) {
  return prisma.billingSubscription.upsert({
    where: { userId: params.userId },
    create: {
      userId: params.userId,
      stripeCustomerId: params.customerId,
    },
    update: {
      stripeCustomerId: params.customerId,
    },
  })
}

export async function getBillingSubscriptionByUserId(userId: string) {
  return prisma.billingSubscription.findUnique({
    where: { userId },
  })
}

export async function getBillingSubscriptionByCustomerId(customerId: string) {
  return prisma.billingSubscription.findUnique({
    where: { stripeCustomerId: customerId },
  })
}

export async function updateSubscriptionFromStripe(params: {
  customerId: string
  subscriptionId: string | null
  priceId: string | null
  subscriptionStatus: Stripe.Subscription.Status | null
  currentPeriodEnd: Date | null
}) {
  return prisma.billingSubscription.update({
    where: { stripeCustomerId: params.customerId },
    data: {
      stripeSubscriptionId: params.subscriptionId,
      stripePriceId: params.priceId,
      stripeStatus: params.subscriptionStatus,
      currentPeriodEnd: params.currentPeriodEnd,
    },
  })
}
