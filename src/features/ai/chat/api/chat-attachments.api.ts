import type { FileUIPart } from "ai"

import { ApiRoutes } from "@/lib/api.routes"
import { apiRequest } from "@/lib/http-client"
import type { UploadChatAttachmentResponse } from "@/features/ai/chat/types/chat-attachments.types"

async function filePartToBlob(filePart: FileUIPart): Promise<Blob> {
  const response = await fetch(filePart.url)
  if (!response.ok) {
    throw new Error("Failed to read attachment for upload")
  }

  return response.blob()
}

export async function uploadChatAttachmentApi(filePart: FileUIPart): Promise<UploadChatAttachmentResponse> {
  const blob = await filePartToBlob(filePart)
  const filename = filePart.filename?.trim() || "attachment"
  const contentType = filePart.mediaType?.trim() || blob.type || "application/octet-stream"
  const file = new File([blob], filename, {
    type: contentType,
  })

  const formData = new FormData()
  formData.append("file", file)

  return apiRequest<UploadChatAttachmentResponse>(ApiRoutes.chatAttachments.upload, {
    method: "POST",
    body: formData,
  })
}
