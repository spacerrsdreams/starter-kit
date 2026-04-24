"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { z } from "zod"

import {
  LOCALE_OPTIONS,
  LOCALES,
  type Locale,
} from "@/i18n/locales"
import { ApiError } from "@/lib/http-client"
import { WebRoutes } from "@/lib/web.routes"
import { BlogContentEditor } from "@/features/blog/components/blog-content-editor.client"
import { useMutateUpdateBlogPost } from "@/features/blog/hooks/use-mutate-update-blog-post"
import { useMutateUploadBlogCoverImage } from "@/features/blog/hooks/use-mutate-upload-blog-cover-image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const updateBlogPostFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  locale: z.enum(LOCALES),
  preview: z.string().trim().min(1, "Preview description is required"),
  seoKeywords: z.array(z.string().trim().min(1, "SEO keywords cannot be empty")).min(1, "At least one SEO keyword is required"),
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

type FormErrors = Partial<Record<"title" | "slug" | "locale" | "preview" | "seoKeywords" | "contentHtml", string>>

type EditBlogPostFormProps = {
  postId: string
  initialTitle: string
  initialSlug: string
  initialLocale: Locale
  initialPreview: string
  initialSeoKeywords: string[]
  initialContentHtml: string
  initialImageSrc: string
}

export function EditBlogPostForm({
  postId,
  initialTitle,
  initialSlug,
  initialLocale,
  initialPreview,
  initialSeoKeywords,
  initialContentHtml,
  initialImageSrc,
}: EditBlogPostFormProps) {
  const router = useRouter()
  const updatePostMutation = useMutateUpdateBlogPost()
  const uploadCoverImageMutation = useMutateUploadBlogCoverImage()

  const [title, setTitle] = useState(initialTitle)
  const [slug, setSlug] = useState(initialSlug)
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const [preview, setPreview] = useState(initialPreview)
  const [seoKeywordsInput, setSeoKeywordsInput] = useState(initialSeoKeywords.join(", "))
  const [contentHtml, setContentHtml] = useState(initialContentHtml)
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImagePreviewUrl, setCoverImagePreviewUrl] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const isSubmitting = updatePostMutation.isPending || uploadCoverImageMutation.isPending

  const seoKeywords = useMemo(
    () =>
      seoKeywordsInput
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    [seoKeywordsInput]
  )

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

    const parsed = updateBlogPostFormSchema.safeParse({
      title,
      slug,
      locale,
      preview,
      seoKeywords,
      contentHtml,
    })

    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors
      setErrors({
        title: flattened.title?.[0],
        slug: flattened.slug?.[0],
        locale: flattened.locale?.[0],
        preview: flattened.preview?.[0],
        seoKeywords: flattened.seoKeywords?.[0],
        contentHtml: flattened.contentHtml?.[0],
      })
      return
    }

    setErrors({})

    try {
      const imageSrc = coverImageFile
        ? (await uploadCoverImageMutation.mutateAsync(coverImageFile)).imageUrl
        : initialImageSrc

      await updatePostMutation.mutateAsync({
        postId,
        body: {
          title: parsed.data.title,
          slug: parsed.data.slug,
          locale: parsed.data.locale,
          preview: parsed.data.preview,
          seoKeywords: parsed.data.seoKeywords,
          imageSrc,
          content: { html: parsed.data.contentHtml },
        },
      })

      toast.success("Blog post updated.")
      router.push(WebRoutes.blogPost(parsed.data.slug))
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Failed to update blog post.")
      }
    }
  }

  const effectivePreviewImage = coverImagePreviewUrl ?? initialImageSrc

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
            className="h-10"
          />
          {errors.title ? <p className="text-sm text-destructive">{errors.title}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="blog-slug" className="text-sm font-medium text-foreground">
            Slug
          </label>
          <Input id="blog-slug" value={slug} onChange={(event) => setSlug(normalizeSlug(event.target.value))} className="h-10" />
          {errors.slug ? <p className="text-sm text-destructive">{errors.slug}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="blog-locale" className="text-sm font-medium text-foreground">
            Locale
          </label>
          <select
            id="blog-locale"
            value={locale}
            onChange={(event) => setLocale(z.enum(LOCALES).parse(event.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none"
          >
            {LOCALE_OPTIONS.map((localeOption) => (
              <option key={localeOption.value} value={localeOption.value}>
                {`${localeOption.flag} ${localeOption.label} (${localeOption.country})`}
              </option>
            ))}
          </select>
          {errors.locale ? <p className="text-sm text-destructive">{errors.locale}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="blog-preview" className="text-sm font-medium text-foreground">
            Preview Description
          </label>
          <Textarea id="blog-preview" value={preview} onChange={(event) => setPreview(event.target.value)} className="min-h-24" />
          {errors.preview ? <p className="text-sm text-destructive">{errors.preview}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="blog-seo-keywords" className="text-sm font-medium text-foreground">
            SEO Keywords
          </label>
          <Input id="blog-seo-keywords" value={seoKeywordsInput} onChange={(event) => setSeoKeywordsInput(event.target.value)} className="h-10" />
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
        </div>

        <BlogContentEditor value={contentHtml} onChange={setContentHtml} />
        {errors.contentHtml ? <p className="text-sm text-destructive">{errors.contentHtml}</p> : null}

        <Button type="submit" className="h-10 px-5" isLoading={isSubmitting}>
          Save Changes
        </Button>
      </form>

      <section className="space-y-4 rounded-xl border border-border bg-background p-6">
        <h2 className="text-2xl font-semibold text-foreground">Preview</h2>
        <article className="space-y-4">
          <img src={effectivePreviewImage} alt={title || "Blog preview cover"} className="h-56 w-full rounded-lg object-cover" />
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
