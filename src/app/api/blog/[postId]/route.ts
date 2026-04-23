import "server-only"

import type { BlogPost, Prisma } from "@/generated/prisma/client"
import { NextResponse } from "next/server"

import { deleteBlogPost, getBlogPostById, updateBlogPost } from "@/features/blog/repositories/blog-posts.repository"
import { updateBlogPostSchema } from "@/features/blog/schemas/update-blog-post.schema"
import { getAdminOrModeratorSession } from "@/features/blog/utils/get-admin-or-moderator-session.server"

type BlogPostRouteContext = {
  params: Promise<{
    postId: string
  }>
}

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

export async function GET(_: Request, context: BlogPostRouteContext) {
  const { postId } = await context.params
  const post = await getBlogPostById(postId)
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(toBlogPostResponse(post))
}

export async function PATCH(request: Request, context: BlogPostRouteContext) {
  const session = await getAdminOrModeratorSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = updateBlogPostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const { postId } = await context.params
  const updateResult = await updateBlogPost(postId, {
    title: parsed.data.title,
    slug: parsed.data.slug,
    preview: parsed.data.preview,
    seoKeywords: parsed.data.seoKeywords,
    imageSrc: parsed.data.imageSrc,
    content: parsed.data.content as Prisma.InputJsonValue | undefined,
  })

  if (updateResult.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const updated = await getBlogPostById(postId)
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(toBlogPostResponse(updated))
}

export async function DELETE(_: Request, context: BlogPostRouteContext) {
  const session = await getAdminOrModeratorSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { postId } = await context.params
  const deleteResult = await deleteBlogPost(postId)
  if (deleteResult.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return new NextResponse(null, { status: 204 })
}
