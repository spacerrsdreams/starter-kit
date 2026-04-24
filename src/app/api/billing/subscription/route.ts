import "server-only"

import { NextResponse } from "next/server"

import { getSessionUserId } from "@/features/auth/lib/auth"
import { getBillingSubscriptionSnapshot } from "@/features/billing/repositories/billing.repository"

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subscription = await getBillingSubscriptionSnapshot(userId)
  return NextResponse.json({ subscription })
}
