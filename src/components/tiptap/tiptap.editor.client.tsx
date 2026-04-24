"use client"

import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { TiptapFloatingMenu } from "@/components/tiptap/tiptap-floating-menu.client"

type TiptapEditorProps = {
  id: string
  value: string
  onChange: (value: string) => void
}

export function TiptapEditor({ id, value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5],
        },
        link: {
          openOnClick: false,
        },
      }),
      TextStyle,
      Color,
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-64 rounded-lg border border-input bg-transparent px-3 py-3 focus-visible:outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML())
    },
  })

  return (
    <div className="tiptap-editor rounded-lg border border-border bg-background p-2">
      {editor ? <TiptapFloatingMenu editor={editor} /> : null}
      <EditorContent id={id} editor={editor} />
    </div>
  )
}
