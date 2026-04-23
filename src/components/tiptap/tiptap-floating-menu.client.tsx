"use client"

import type { Editor } from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import { Bold, Italic, Link2, List, Minus, Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type TiptapFloatingMenuProps = {
  editor: Editor
}

const headingLevels = [1, 2, 3, 4, 5] as const

const colorEntries = [
  { label: "Primary", color: "var(--primary)" },
  { label: "Background", color: "var(--background)" },
  { label: "Foreground", color: "var(--foreground)" },
  { label: "Accent 1", color: "var(--accent-1)" },
  { label: "Emerald 500", color: "#10b981" },
] as const

export function TiptapFloatingMenu({ editor }: TiptapFloatingMenuProps) {
  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Enter URL", previousUrl ?? "https://")
    if (url === null) {
      return
    }

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().setLink({ href: url.trim() }).run()
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor: currentEditor }) => currentEditor.isFocused && !currentEditor.state.selection.empty}
      options={{ placement: "top-start", strategy: "fixed" }}
      className="z-50 rounded-lg border border-border bg-popover p-1 shadow-md"
    >
      <div className="flex flex-wrap items-center gap-1">
        <Button
          type="button"
          variant={!editor.isActive("heading") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          P
        </Button>
        {headingLevels.map((level) => (
          <Button
            key={level}
            type="button"
            variant={editor.isActive("heading", { level }) ? "secondary" : "ghost"}
            size="sm"
            onClick={() => editor.chain().focus().setHeading({ level }).run()}
          >
            H{level}
          </Button>
        ))}
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="sm"
          onClick={() => {
            editor.chain().focus().toggleList("bulletList", "listItem").run()
          }}
        >
          <List className="size-3.5" />
          List
        </Button>
        <Button
          type="button"
          variant={editor.isActive("link") ? "secondary" : "ghost"}
          size="sm"
          onClick={handleSetLink}
        >
          <Link2 className="size-3.5" />
          Link
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-3.5" />
          Divider
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Palette className="size-3.5" />
              Colors
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-auto min-w-0">
            {colorEntries.map((entry) => (
              <DropdownMenuItem
                key={entry.label}
                onClick={() => {
                  editor.chain().focus().setColor(entry.color).run()
                }}
                className="gap-2"
              >
                <span
                  className="inline-block h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => {
                editor.chain().focus().unsetColor().run()
              }}
              className="gap-2"
            >
              Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </BubbleMenu>
  )
}
