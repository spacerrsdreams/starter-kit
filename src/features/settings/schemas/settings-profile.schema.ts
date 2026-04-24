import { z } from "zod"

export const settingsProfileSchema = z.object({
  firstName: z.string().trim().max(50, "First name must be 50 characters or less."),
  lastName: z.string().trim().max(50, "Last name must be 50 characters or less."),
})

export type SettingsProfileInput = z.infer<typeof settingsProfileSchema>
