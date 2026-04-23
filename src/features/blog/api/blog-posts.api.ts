import { ApiRoutes } from "@/lib/api.routes"
import { apiRequest } from "@/lib/http-client"
import type { BlogPostsListResponse, CreateBlogPostRequest } from "@/features/blog/types/blog-post.types"

export async function createBlogPostApi(body: CreateBlogPostRequest) {
  return apiRequest(ApiRoutes.blog.create, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function uploadBlogCoverImageApi(file: File) {
  const formData = new FormData()
  formData.set("file", file)

  return apiRequest<{ imageUrl: string }>(ApiRoutes.blog.uploadCover, {
    method: "POST",
    body: formData,
  })
}

export async function listBlogPostsApi(limit: number, offset: number) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  return apiRequest<BlogPostsListResponse>(`${ApiRoutes.blog.list}?${params.toString()}`)
}
