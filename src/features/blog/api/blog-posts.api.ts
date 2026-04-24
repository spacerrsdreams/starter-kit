import { ApiRoutes } from "@/lib/api.routes"
import { apiRequest } from "@/lib/http-client"
import type { BlogPostsListResponse, CreateBlogPostRequest } from "@/features/blog/types/blog-post.types"
import type { Locale } from "@/i18n/locales"

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

export async function listBlogPostsApi(limit: number, offset: number, locale: Locale) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    locale,
  })

  return apiRequest<BlogPostsListResponse>(`${ApiRoutes.blog.list}?${params.toString()}`)
}

export async function updateBlogPostApi(postId: string, body: CreateBlogPostRequest) {
  return apiRequest(ApiRoutes.blog.byId(postId), {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
}

export async function deleteBlogPostApi(postId: string) {
  return apiRequest<void>(ApiRoutes.blog.byId(postId), {
    method: "DELETE",
  })
}
