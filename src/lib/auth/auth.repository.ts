import "server-only"

import { verifyPassword } from "better-auth/crypto"

import { prisma } from "@/lib/prisma"

export type ReactivateDeactivatedAccountOutcome = "success" | "not_found" | "not_deactivated" | "invalid_credentials"

export async function reactivateDeactivatedAccountWithDetail(
  email: string,
  password: string
): Promise<ReactivateDeactivatedAccountOutcome> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, deactivatedAt: true },
  })

  if (!user) {
    return "not_found"
  }

  if (!user.deactivatedAt) {
    return "not_deactivated"
  }

  const account = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
    select: { password: true },
  })

  if (!account?.password) {
    return "invalid_credentials"
  }

  const valid = await verifyPassword({ hash: account.password, password })

  if (!valid) {
    return "invalid_credentials"
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { deactivatedAt: null },
  })

  return "success"
}
