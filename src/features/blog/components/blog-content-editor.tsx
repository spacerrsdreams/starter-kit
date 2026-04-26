"use client"

import { TiptapEditor } from "@/components/tiptap/tiptap.editor"

type BlogContentEditorProps = {
  value: string
  onChange: (value: string) => void
}

export function BlogContentEditor({ value, onChange }: BlogContentEditorProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="blog-content-editor" className="text-sm font-medium text-foreground">
        Content
      </label>
      <TiptapEditor id="blog-content-editor" value={value} onChange={onChange} />
    </div>
  )
}
