"use client"

import { useMutation } from "@tanstack/react-query"

import { deleteBlogPostApi } from "@/features/blog/api/blog-posts.api"

export function useMutateDeleteBlogPost() {
  return useMutation({
    mutationFn: deleteBlogPostApi,
  })
}
