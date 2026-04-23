import "server-only"

import type { Prisma } from "@/generated/prisma/client"

import { prisma } from "@/lib/prisma"

type BlogPostCreateData = Pick<Prisma.BlogPostUncheckedCreateInput, "title" | "imageSrc" | "content" | "authorId">
type BlogPostUpdateData = Pick<Prisma.BlogPostUpdateManyMutationInput, "title" | "imageSrc" | "content">

export async function listBlogPosts(limit: number, offset: number) {
  return prisma.blogPost.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
    select: {
      id: true,
      title: true,
      imageSrc: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function getBlogPostById(postId: string) {
  return prisma.blogPost.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      title: true,
      imageSrc: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function createBlogPost(data: BlogPostCreateData) {
  return prisma.blogPost.create({
    data,
    select: {
      id: true,
      title: true,
      imageSrc: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function updateBlogPost(postId: string, data: BlogPostUpdateData) {
  return prisma.blogPost.updateMany({
    where: {
      id: postId,
    },
    data,
  })
}

export async function deleteBlogPost(postId: string) {
  return prisma.blogPost.deleteMany({
    where: {
      id: postId,
    },
  })
}
