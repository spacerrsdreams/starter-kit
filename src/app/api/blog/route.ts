import "server-only"

import type { BlogPost, Prisma } from "@/generated/prisma/client"
import { NextResponse } from "next/server"

import { createBlogPost, listBlogPosts } from "@/features/blog/repositories/blog-posts.repository"
import { createBlogPostSchema } from "@/features/blog/schemas/create-blog-post.schema"
import { getAdminOrModeratorSession } from "@/features/blog/utils/get-admin-or-moderator-session.server"

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

type BlogPostRecord = Pick<
  BlogPost,
  "id" | "title" | "slug" | "preview" | "seoKeywords" | "imageSrc" | "content" | "createdAt" | "updatedAt"
>

function toBlogPostResponse(post: BlogPostRecord) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
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
  const limit = Number.isFinite(parsedLimit) ? Math.max(1, Math.min(MAX_LIMIT, Math.floor(parsedLimit))) : DEFAULT_LIMIT
  const offset = Number.isFinite(parsedOffset) ? Math.max(0, Math.floor(parsedOffset)) : 0

  const rows = await listBlogPosts(limit, offset)
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
    preview: parsed.data.preview,
    seoKeywords: parsed.data.seoKeywords,
    imageSrc: parsed.data.imageSrc,
    content: parsed.data.content as Prisma.InputJsonValue,
    authorId: session.user.id,
  })

  return NextResponse.json(toBlogPostResponse(created), { status: 201 })
}
