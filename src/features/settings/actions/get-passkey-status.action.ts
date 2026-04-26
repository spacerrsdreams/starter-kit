"use server"

import "server-only"

import { headers } from "next/headers"

import { auth } from "@/features/auth/lib/auth"
import { prisma } from "@/lib/prisma"

type GetPasskeyStatusActionResult =
  | { ok: true; hasPasskey: boolean }
  | { ok: false; code: "UNAUTHORIZED" }

export async function getPasskeyStatusAction(): Promise<GetPasskeyStatusActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return { ok: false, code: "UNAUTHORIZED" }
  }

  const passkeyCount = await prisma.passkey.count({
    where: {
      userId: session.user.id,
    },
  })

  return {
    ok: true,
    hasPasskey: passkeyCount > 0,
  }
}
