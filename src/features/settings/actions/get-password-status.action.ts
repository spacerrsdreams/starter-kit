"use server"

import "server-only"

import { headers } from "next/headers"

import { auth } from "@/features/auth/lib/auth"
import { prisma } from "@/lib/prisma"

type GetPasswordStatusActionResult =
  | { ok: true; hasPassword: boolean }
  | { ok: false; code: "UNAUTHORIZED" }

export async function getPasswordStatusAction(): Promise<GetPasswordStatusActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return { ok: false, code: "UNAUTHORIZED" }
  }

  const credentialAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "credential",
      password: {
        not: null,
      },
    },
    select: {
      id: true,
    },
  })

  return {
    ok: true,
    hasPassword: Boolean(credentialAccount),
  }
}
