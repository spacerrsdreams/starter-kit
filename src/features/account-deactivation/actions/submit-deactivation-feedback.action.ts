"use server"

import "server-only"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth/auth"
import { prisma } from "@/lib/prisma"
import { WebRoutes } from "@/lib/web.routes"
import { createDeactivationFeedback } from "@/features/account-deactivation/repositories/deactivation-feedback.repository"
import { submitDeactivationFeedbackSchema } from "@/features/account-deactivation/schemas/deactivation-feedback.schema"

export async function submitDeactivationFeedbackAction(formData: FormData) {
  const rawCategory = formData.get("category")
  const rawReason = formData.get("reason")
  const parsed = submitDeactivationFeedbackSchema.safeParse({
    category: typeof rawCategory === "string" ? rawCategory : "",
    reason: typeof rawReason === "string" ? rawReason : "",
  })

  if (!parsed.success) {
    redirect(`${WebRoutes.feedback.path}?error=invalid-feedback`)
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    redirect(WebRoutes.signIn.path)
  }

  await createDeactivationFeedback({
    category: parsed.data.category,
    reason: parsed.data.reason,
    userId: session.user.id,
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { deactivatedAt: new Date() },
  })

  await prisma.session.deleteMany({
    where: { userId: session.user.id },
  })

  redirect(`${WebRoutes.signIn.path}?deactivation=feedback-submitted`)
}
