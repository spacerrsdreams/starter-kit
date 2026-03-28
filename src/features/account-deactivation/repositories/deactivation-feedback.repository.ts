import "server-only"

import { randomUUID } from "crypto"

import type { SubmitDeactivationFeedbackInput } from "@/features/account-deactivation/schemas/deactivation-feedback.schema"
import { prisma } from "@/lib/prisma"

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
