import z from "zod"

import { deactivationFeedbackCategories } from "@/features/auth/account-deactivation/constants/deactivation-feedback-category.constants"

export const submitDeactivationFeedbackSchema = z.object({
  category: z.enum(deactivationFeedbackCategories),
  reason: z.string().trim().min(10, "Please share at least 10 characters.").max(2000, "Reason is too long."),
})

export type SubmitDeactivationFeedbackInput = z.infer<typeof submitDeactivationFeedbackSchema>
