import { z } from "zod"

import { LOCALES } from "@/i18n/locales"

export const updateBlogPostSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    locale: z.enum(LOCALES).optional(),
    preview: z.string().trim().min(1).optional(),
    seoKeywords: z.array(z.string().trim().min(1)).optional(),
    imageSrc: z.string().trim().min(1).optional(),
    content: z.record(z.string(), z.unknown()).optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.slug !== undefined ||
      value.locale !== undefined ||
      value.preview !== undefined ||
      value.seoKeywords !== undefined ||
      value.imageSrc !== undefined ||
      value.content !== undefined,
    {
      message: "At least one field is required",
    }
  )
