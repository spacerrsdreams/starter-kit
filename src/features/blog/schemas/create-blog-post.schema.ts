import { z } from "zod"

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(1),
  imageSrc: z.string().trim().min(1),
  content: z.record(z.string(), z.unknown()),
})
