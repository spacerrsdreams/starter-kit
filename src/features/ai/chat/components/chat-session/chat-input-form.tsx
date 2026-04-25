"use client"

import { ChatStatus, FileUIPart } from "ai"
import { memo, useCallback, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
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
import { InputGroupAddon } from "@/components/ui/input-group"

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
  onStop: () => void
  isInputLocked: boolean
  status: ChatStatus
}

export function ChatInputForm({ onSubmit, onStop, isInputLocked, status }: ChatInputFormProps) {
  const [isMultiline, setIsMultiline] = useState(false)

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

  const handleTextareaHeight = useCallback((textarea: HTMLTextAreaElement) => {
    setIsMultiline(textarea.scrollHeight > 44)
  }, [])

  return (
    <PromptInputProvider>
      <PromptInput
        globalDrop
        maxFileSize={MAX_ATTACHMENT_FILE_BYTES}
        maxFiles={MAX_ATTACHMENT_FILES}
        multiple
        onError={handleAttachmentError}
        onSubmit={async (message) => {
          if (isInputLocked) {
            throw new Error("Input is locked while response is streaming")
          }
          await onSubmit(message)
          setIsMultiline(false)
        }}
        inputGroupClassName="min-h-14 rounded-[1.75rem] border bg-background shadow-sm"
      >
        <PromptInputAttachmentsDisplay />
        <PromptInputBody className="min-w-0">
          <PromptInputTextarea
            className={cn("max-h-56 min-h-0 pr-4 pl-2 text-base leading-6", isMultiline && "pl-4")}
            onChange={(event) => handleTextareaHeight(event.currentTarget)}
            onInput={(event) => handleTextareaHeight(event.currentTarget)}
            placeholder="Ask anything"
          />
        </PromptInputBody>
        {isMultiline && (
          <PromptInputFooter className="justify-between px-2 pt-0 pb-2">
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent className="w-56">
                  <PromptInputActionAddAttachments />
                  <PromptInputActionAddScreenshot />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
            </PromptInputTools>
            <PromptInputSubmit onStop={onStop} status={status} />
          </PromptInputFooter>
        )}

        {!isMultiline && (
          <>
            <InputGroupAddon align="inline-start" className="items-end gap-1.5 pr-0 pl-2">
              <PromptInputTools>
                <PromptInputActionMenu>
                  <PromptInputActionMenuTrigger />
                  <PromptInputActionMenuContent className="w-56">
                    <PromptInputActionAddAttachments />
                    <PromptInputActionAddScreenshot />
                  </PromptInputActionMenuContent>
                </PromptInputActionMenu>
              </PromptInputTools>
            </InputGroupAddon>
            <InputGroupAddon align="inline-end" className="items-end gap-1.5 pr-4 pb-2">
              <PromptInputSubmit onStop={onStop} status={status} />
            </InputGroupAddon>
          </>
        )}
      </PromptInput>
    </PromptInputProvider>
  )
}
