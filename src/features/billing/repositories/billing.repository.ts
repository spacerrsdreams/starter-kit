import "server-only"

import { z } from "zod"

import { prisma } from "@/lib/prisma"
import type { BillingProduct, BillingSubscriptionSnapshot } from "@/features/billing/types/billing.types"
import type {
  BillingSnapshotInput,
  StripeSubscriptionStatus,
  UpdateSubscriptionFromStripeParams,
} from "@/features/billing/types/billing.server.types"

const PaidStripeStatuses = new Set<StripeSubscriptionStatus>(["active", "trialing"])
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

function parseStripeSubscriptionStatus(value: string | null): StripeSubscriptionStatus | null {
  return stripeSubscriptionStatusSchema.safeParse(value).data ?? null
}

function parseBillingProduct(stripePriceId: string | null | undefined): BillingProduct | null {
  if (!stripePriceId) return null

  const yearlyPriceId = process.env.STRIPE_PRICE_ID_PRO_YEARLY
  const monthlyPriceId = process.env.STRIPE_PRICE_ID_PRO_MONTHLY

  if (stripePriceId === yearlyPriceId) return "yearly"
  if (stripePriceId === monthlyPriceId) return "monthly"

  return null
}

function toSnapshot(params: BillingSnapshotInput): BillingSubscriptionSnapshot {
  const subscriptionStatus = params.subscriptionStatus ?? null
  const isPaid = subscriptionStatus ? PaidStripeStatuses.has(subscriptionStatus) : false
  const currentProduct = isPaid ? parseBillingProduct(params.stripePriceId) : null

  return {
    plan: isPaid ? "pro" : "free",
    isPaid,
    currentProduct,
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
      stripePriceId: true,
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
    stripePriceId: existing.stripePriceId,
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

export async function updateSubscriptionFromStripe(params: UpdateSubscriptionFromStripeParams) {
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
