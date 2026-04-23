"use client"

import { useMutation } from "@tanstack/react-query"

import { createBlogPostApi } from "@/features/blog/api/blog-posts.api"

export function useMutateCreateBlogPost() {
  return useMutation({
    mutationFn: createBlogPostApi,
  })
}
