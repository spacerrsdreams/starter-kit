import { z } from "zod"

export const updateAdminUserSchema = z
  .object({
    email: z.email().optional(),
    role: z.enum(["user", "admin", "moderator"]).optional(),
  })
  .refine((value) => value.email !== undefined || value.role !== undefined, {
    message: "At least one editable field is required",
  })
