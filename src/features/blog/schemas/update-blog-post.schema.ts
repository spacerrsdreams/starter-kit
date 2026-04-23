import { z } from "zod"

export const updateBlogPostSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    imageSrc: z.string().trim().min(1).optional(),
    content: z.record(z.string(), z.unknown()).optional(),
  })
  .refine((value) => value.title !== undefined || value.imageSrc !== undefined || value.content !== undefined, {
    message: "At least one field is required",
  })
