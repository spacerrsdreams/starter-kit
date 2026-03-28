import { z } from "zod"

export const sendEmailVerificationInputSchema = z.object({
  callbackURL: z.string().url(),
})

export type SendEmailVerificationInput = z.infer<typeof sendEmailVerificationInputSchema>
