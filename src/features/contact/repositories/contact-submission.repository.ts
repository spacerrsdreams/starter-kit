import "server-only"

import { randomUUID } from "crypto"

import type { SubmitContactFormInput } from "@/features/contact/schemas/contact-submission.schema"
import { prisma } from "@/lib/prisma"

export async function createContactSubmission(input: SubmitContactFormInput) {
  await prisma.contactSubmission.create({
    data: {
      id: randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      subject: input.subject,
      message: input.message,
    },
  })
}
