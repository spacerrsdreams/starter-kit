import "server-only"

import { randomUUID } from "crypto"

import { prisma } from "@/lib/prisma"
import type { SubmitDeactivationFeedbackInput } from "@/features/auth/account-deactivation/schemas/deactivation-feedback.schema"

type CreateDeactivationFeedbackInput = SubmitDeactivationFeedbackInput & {
  userId: string
}

export async function createDeactivationFeedback({ category, reason, userId }: CreateDeactivationFeedbackInput) {
  await prisma.deactivationFeedback.create({
    data: {
      id: randomUUID(),
      category,
      reason,
      userId,
    },
  })
}
