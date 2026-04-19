"use client"

import { ChatStatus, FileUIPart } from "ai"
import { memo, useCallback } from "react"
import { toast } from "sonner"

import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments"
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input"

const MAX_ATTACHMENT_FILES = 3
const MAX_ATTACHMENT_FILE_BYTES = 5 * 1024 * 1024

interface AttachmentItemProps {
  attachment: {
    id: string
    type: "file"
    filename?: string
    mediaType: string
    url: string
  }
  onRemove: (id: string) => void
}

const AttachmentItem = memo(({ attachment, onRemove }: AttachmentItemProps) => {
  const handleRemove = useCallback(() => onRemove(attachment.id), [onRemove, attachment.id])
  return (
    <Attachment data={attachment} key={attachment.id} onRemove={handleRemove}>
      <AttachmentPreview />
      <AttachmentInfo />
      <AttachmentRemove />
    </Attachment>
  )
})

AttachmentItem.displayName = "AttachmentItem"

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments()

  const handleRemove = useCallback((id: string) => attachments.remove(id), [attachments])

  if (attachments.files.length === 0) {
    return null
  }

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <AttachmentItem attachment={attachment} key={attachment.id} onRemove={handleRemove} />
      ))}
    </Attachments>
  )
}

interface ChatInputFormProps {
  onSubmit: ({ text, files }: { text: string; files: FileUIPart[] }) => Promise<void>
  status: ChatStatus
}

export function ChatInputForm({ onSubmit, status }: ChatInputFormProps) {
  const handleAttachmentError = useCallback(
    (err: { code: "max_files" | "max_file_size" | "accept"; message: string }) => {
      if (err.code === "max_files") {
        toast.error(`You can attach up to ${MAX_ATTACHMENT_FILES} files.`)
        return
      }
      if (err.code === "max_file_size") {
        toast.error(`Each file must be ${MAX_ATTACHMENT_FILE_BYTES / (1024 * 1024)} MB or smaller.`)
        return
      }
      toast.error(err.message)
    },
    []
  )

  return (
    <PromptInputProvider>
      <PromptInput
        globalDrop
        maxFileSize={MAX_ATTACHMENT_FILE_BYTES}
        maxFiles={MAX_ATTACHMENT_FILES}
        multiple
        onError={handleAttachmentError}
        onSubmit={onSubmit}
        inputGroupClassName="rounded-xl bg-background"
      >
        <PromptInputAttachmentsDisplay />
        <PromptInputBody>
          <PromptInputTextarea />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger />
              <PromptInputActionMenuContent className="w-56">
                <PromptInputActionAddAttachments />
                <PromptInputActionAddScreenshot />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
          </PromptInputTools>
          <PromptInputSubmit status={status} />
        </PromptInputFooter>
      </PromptInput>
    </PromptInputProvider>
  )
}
