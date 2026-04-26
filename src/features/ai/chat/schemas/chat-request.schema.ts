import { z } from "zod"

export const chatRequestSchema = z.object({
  chatId: z.string().min(1),
  message: z.unknown().optional(),
})
