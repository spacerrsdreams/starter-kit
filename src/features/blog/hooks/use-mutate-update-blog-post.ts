"use client"

import { useMutation } from "@tanstack/react-query"

import { updateBlogPostApi } from "@/features/blog/api/blog-posts.api"
import type { CreateBlogPostRequest } from "@/features/blog/types/blog-post.types"

type UpdateBlogPostVariables = {
  postId: string
  body: CreateBlogPostRequest
}

export function useMutateUpdateBlogPost() {
  return useMutation({
    mutationFn: ({ postId, body }: UpdateBlogPostVariables) => updateBlogPostApi(postId, body),
  })
}
