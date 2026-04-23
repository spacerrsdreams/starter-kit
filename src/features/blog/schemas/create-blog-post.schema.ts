import { z } from "zod"

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  preview: z.string().trim().min(1),
  seoKeywords: z.array(z.string().trim().min(1)),
  imageSrc: z.string().trim().min(1),
  content: z.record(z.string(), z.unknown()),
})
