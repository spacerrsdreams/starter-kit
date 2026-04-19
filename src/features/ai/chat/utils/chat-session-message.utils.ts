import type { FileUIPart, UIMessage } from "ai"

export function getMessageTextContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is Extract<UIMessage["parts"][number], { type: "text" }> => part.type === "text")
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join("\n\n")
}

export function getMessageFileParts(message: UIMessage): FileUIPart[] {
  return message.parts
    .filter((part): part is FileUIPart => part.type === "file")
    .map((part) => ({
      type: "file",
      filename: part.filename,
      mediaType: part.mediaType,
      url: part.url,
    }))
}

