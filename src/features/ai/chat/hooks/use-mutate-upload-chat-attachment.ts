"use client"

import { useMutation } from "@tanstack/react-query"
import type { FileUIPart } from "ai"

import { uploadChatAttachmentApi } from "@/features/ai/chat/api/chat-attachments.api"

export function useMutateUploadChatAttachment() {
  return useMutation({
    mutationFn: async (filePart: FileUIPart) => uploadChatAttachmentApi(filePart),
  })
}
