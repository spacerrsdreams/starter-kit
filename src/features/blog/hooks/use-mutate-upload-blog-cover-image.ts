"use client"

import { useMutation } from "@tanstack/react-query"

import { uploadBlogCoverImageApi } from "@/features/blog/api/blog-posts.api"

export function useMutateUploadBlogCoverImage() {
  return useMutation({
    mutationFn: uploadBlogCoverImageApi,
  })
}
