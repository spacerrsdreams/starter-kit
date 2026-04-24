import { z } from "zod"

import { LOCALES } from "@/i18n/locales"

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  locale: z.enum(LOCALES),
  preview: z.string().trim().min(1),
  seoKeywords: z.array(z.string().trim().min(1)),
  imageSrc: z.string().trim().min(1),
  content: z.record(z.string(), z.unknown()),
})
