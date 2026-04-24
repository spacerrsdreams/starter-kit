import "server-only"

import type { BlogPost, Prisma } from "@/generated/prisma/client"
import { NextResponse } from "next/server"
import { z } from "zod"

import { LOCALES, DEFAULT_LOCALE } from "@/i18n/locales"
import { createBlogPost, listBlogPosts } from "@/features/blog/repositories/blog-posts.repository"
import { createBlogPostSchema } from "@/features/blog/schemas/create-blog-post.schema"
import { getAdminOrModeratorSession } from "@/features/blog/utils/get-admin-or-moderator-session.server"

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50
const blogPostLocaleSchema = z.enum(LOCALES)

type BlogPostRecord = Pick<
  BlogPost,
  "id" | "title" | "slug" | "locale" | "preview" | "seoKeywords" | "imageSrc" | "content" | "createdAt" | "updatedAt"
>

function toBlogPostResponse(post: BlogPostRecord) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    locale: post.locale,
    preview: post.preview,
    seoKeywords: post.seoKeywords,
    imageSrc: post.imageSrc,
    content: post.content,
    postedAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const parsedLimit = Number(searchParams.get("limit"))
  const parsedOffset = Number(searchParams.get("offset"))
  const localeCandidate = searchParams.get("locale") ?? DEFAULT_LOCALE
  const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(MAX_LIMIT, Math.floor(parsedLimit))) : DEFAULT_LIMIT
  const offset = Number.isFinite(parsedOffset) ? Math.max(0, Math.floor(parsedOffset)) : 0
  const localeParsed = blogPostLocaleSchema.safeParse(localeCandidate)
  if (!localeParsed.success) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 })
  }

  const rows = await listBlogPosts(limit, offset, localeParsed.data)
  const posts = rows.map(toBlogPostResponse)
  const nextOffset = rows.length < limit ? null : offset + rows.length

  return NextResponse.json({ posts, nextOffset })
}

export async function POST(request: Request) {
  const session = await getAdminOrModeratorSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = createBlogPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const created = await createBlogPost({
    title: parsed.data.title,
    slug: parsed.data.slug,
    locale: parsed.data.locale,
    preview: parsed.data.preview,
    seoKeywords: parsed.data.seoKeywords,
    imageSrc: parsed.data.imageSrc,
    content: parsed.data.content as Prisma.InputJsonValue,
    authorId: session.user.id,
  })

  return NextResponse.json(toBlogPostResponse(created), { status: 201 })
}
