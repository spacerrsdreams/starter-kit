"use client"

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { ApiError } from "@/lib/http-client"
import { WebRoutes } from "@/lib/web.routes"
import { useMutateDeleteBlogPost } from "@/features/blog/hooks/use-mutate-delete-blog-post"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type BlogPostActionsMenuProps = {
  editHref: Route
  postId: string
  canDelete: boolean
}

export function BlogPostActionsMenu({ editHref, postId, canDelete }: BlogPostActionsMenuProps) {
  const router = useRouter()
  const deletePostMutation = useMutateDeleteBlogPost()

  const handleDelete = async () => {
    if (!canDelete) {
      return
    }

    const confirmed = window.confirm("Delete this blog post?")
    if (!confirmed) {
      return
    }

    try {
      await deletePostMutation.mutateAsync(postId)
      toast.success("Blog post deleted.")
      router.push(WebRoutes.blog.path)
      router.refresh()
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message)
      } else {
        toast.error("Failed to delete blog post.")
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full border border-border bg-background/90 backdrop-blur-sm"
          aria-label="Blog post actions"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuItem asChild>
          <Link href={editHref} className="gap-2">
            <Pencil className="size-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        {canDelete ? (
          <DropdownMenuItem
            variant="destructive"
            className="gap-2"
            onSelect={(event) => {
              event.preventDefault()
              void handleDelete()
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
