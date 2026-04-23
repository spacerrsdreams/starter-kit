"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { ApiError } from "@/lib/http-client"
import { WebRoutes } from "@/lib/web.routes"
import { BlogContentEditor } from "@/features/blog/components/blog-content-editor.client"
import { useMutateCreateBlogPost } from "@/features/blog/hooks/use-mutate-create-blog-post"
import { useMutateUploadBlogCoverImage } from "@/features/blog/hooks/use-mutate-upload-blog-cover-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const createBlogPostFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  preview: z.string().trim().min(1, "Preview description is required"),
  seoKeywords: z
    .array(z.string().trim().min(1, "SEO keywords cannot be empty"))
    .min(1, "At least one SEO keyword is required"),
  contentHtml: z.string().trim().min(1, "Content is required"),
})

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

type FormErrors = Partial<Record<"title" | "slug" | "preview" | "seoKeywords" | "coverImage" | "contentHtml", string>>

export function CreateBlogPostForm() {
  const createPostMutation = useMutateCreateBlogPost()
  const uploadCoverImageMutation = useMutateUploadBlogCoverImage()

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [preview, setPreview] = useState("")
  const [seoKeywordsInput, setSeoKeywordsInput] = useState("")
  const [contentHtml, setContentHtml] = useState("")
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const isSubmitting = createPostMutation.isPending || uploadCoverImageMutation.isPending

  const seoKeywords = useMemo(
    () =>
      seoKeywordsInput
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    [seoKeywordsInput]
  )
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!coverImageFile) {
      setCoverImagePreviewUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(coverImageFile)
    setCoverImagePreviewUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [coverImageFile])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = createBlogPostFormSchema.safeParse({
      title,
      slug,
      preview,
      seoKeywords,
      contentHtml,
    })

    const nextErrors: FormErrors = {}
    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors
      nextErrors.title = flattened.title?.[0]
      nextErrors.slug = flattened.slug?.[0]
      nextErrors.preview = flattened.preview?.[0]
      nextErrors.seoKeywords = flattened.seoKeywords?.[0]
      nextErrors.contentHtml = flattened.contentHtml?.[0]
    }

    if (!coverImageFile) {
      nextErrors.coverImage = "Cover image is required"
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !parsed.success || !coverImageFile) {
      return
    }

    try {
      const uploadResponse = await uploadCoverImageMutation.mutateAsync(coverImageFile)
      const formData = parsed.data

      await createPostMutation.mutateAsync({
        title: formData.title,
        slug: formData.slug,
        preview: formData.preview,
        seoKeywords: formData.seoKeywords,
        imageSrc: uploadResponse.imageUrl,
        content: { html: formData.contentHtml },
      })

      toast.success("Blog post created.")
      window.location.assign(WebRoutes.blog.path)
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Failed to create blog post.")
      }
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6">
        <div className="space-y-2">
          <label htmlFor="blog-title" className="text-sm font-medium text-foreground">
            Title
          </label>
          <Input
            id="blog-title"
            value={title}
            onChange={(event) => {
              const nextTitle = event.target.value
              setTitle(nextTitle)
              if (!slug) {
                setSlug(normalizeSlug(nextTitle))
              }
            }}
            placeholder="How to ship faster with AI"
            className="h-10"
          />
          {errors.title ? <p className="text-sm text-destructive">{errors.title}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="blog-slug" className="text-sm font-medium text-foreground">
            Slug
          </label>
          <Input
            id="blog-slug"
            value={slug}
            onChange={(event) => setSlug(normalizeSlug(event.target.value))}
            placeholder="how-to-ship-faster-with-ai"
            className="h-10"
          />
          {errors.slug ? <p className="text-sm text-destructive">{errors.slug}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="blog-preview" className="text-sm font-medium text-foreground">
            Preview Description
          </label>
          <Textarea
            id="blog-preview"
            value={preview}
            onChange={(event) => setPreview(event.target.value)}
            placeholder="A short summary used in blog cards."
            className="min-h-24"
          />
          {errors.preview ? <p className="text-sm text-destructive">{errors.preview}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="blog-seo-keywords" className="text-sm font-medium text-foreground">
            SEO Keywords
          </label>
          <Input
            id="blog-seo-keywords"
            value={seoKeywordsInput}
            onChange={(event) => setSeoKeywordsInput(event.target.value)}
            placeholder="ai workflows, automation, startup"
            className="h-10"
          />
          {errors.seoKeywords ? <p className="text-sm text-destructive">{errors.seoKeywords}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="blog-cover-image" className="text-sm font-medium text-foreground">
            Cover Image Upload
          </label>
          <Input
            id="blog-cover-image"
            type="file"
            accept="image/*"
            onChange={(event) => setCoverImageFile(event.target.files?.[0] ?? null)}
            className="h-10"
          />
          {errors.coverImage ? <p className="text-sm text-destructive">{errors.coverImage}</p> : null}
        </div>

        <BlogContentEditor value={contentHtml} onChange={setContentHtml} />
        {errors.contentHtml ? <p className="text-sm text-destructive">{errors.contentHtml}</p> : null}

        <Button type="submit" className="h-10 px-5" isLoading={isSubmitting}>
          Create Post
        </Button>
      </form>

      <section className="space-y-4 rounded-xl border border-border bg-background p-6">
        <h2 className="text-2xl font-semibold text-foreground">Preview</h2>
        <article className="space-y-4">
          {coverImagePreviewUrl ? (
            <img src={coverImagePreviewUrl} alt={title || "Blog preview cover"} className="h-56 w-full rounded-lg object-cover" />
          ) : null}
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-foreground">{title || "Post title preview"}</h3>
            <p className="text-sm text-muted-foreground">{preview || "Post description preview"}</p>
          </div>
          {seoKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {seoKeywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                  {keyword}
                </span>
              ))}
            </div>
          ) : null}
          <div
            className="learn-rich-content rounded-lg border border-border bg-background p-4"
            dangerouslySetInnerHTML={{ __html: contentHtml || "<p>Post content preview...</p>" }}
          />
        </article>
      </section>
    </div>
  )
}
