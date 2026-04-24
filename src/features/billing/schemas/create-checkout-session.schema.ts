import { z } from "zod"

export const createCheckoutSessionSchema = z.object({
  product: z.enum(["monthly", "yearly"]).default("monthly"),
})

export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>
