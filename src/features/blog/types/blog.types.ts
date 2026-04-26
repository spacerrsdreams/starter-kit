import type { Locale } from "@/i18n/locales"

export type BlogPostResponse = {
  id: string
  title: string
  slug: string
  locale: Locale
  preview: string
  seoKeywords: string[]
  imageSrc: string
  content: Record<string, unknown>
  postedAt: string
  updatedAt: string
}

export type BlogPostsListResponse = {
  posts: BlogPostResponse[]
  nextOffset: number | null
}

export type CreateBlogPostRequest = {
  title: string
  slug: string
  locale: Locale
  preview: string
  seoKeywords: string[]
  imageSrc: string
  content: Record<string, unknown>
}
