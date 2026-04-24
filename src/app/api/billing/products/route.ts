import "server-only"

import { NextResponse } from "next/server"

import { getBillingProductsSnapshot } from "@/features/billing/repositories/billing-products.repository"

export async function GET() {
  const products = await getBillingProductsSnapshot()
  return NextResponse.json({ products })
}
