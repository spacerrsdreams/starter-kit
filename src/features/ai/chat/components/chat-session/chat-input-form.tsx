"use client"

import { ChatStatus, FileUIPart } from "ai"
import { memo, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useChatDraftStore } from "@/features/ai/chat/store/chat-draft.store"
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

interface PromptInputAttachmentsDisplayProps {
  onHasAttachmentsChange: (hasAttachments: boolean) => void
}

const PromptInputAttachmentsDisplay = ({ onHasAttachmentsChange }: PromptInputAttachmentsDisplayProps) => {
  const attachments = usePromptInputAttachments()

  const handleRemove = useCallback((id: string) => attachments.remove(id), [attachments])
  const hasAttachments = attachments.files.length > 0

  useEffect(() => {
    onHasAttachmentsChange(hasAttachments)
  }, [hasAttachments, onHasAttachmentsChange])

  if (!hasAttachments) {
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
  multilineByDefault?: boolean
}

export function ChatInputForm({
  onSubmit,
  onStop,
  isInputLocked,
  status,
  multilineByDefault = false,
}: ChatInputFormProps) {
  const [isMultilineByContent, setIsMultilineByContent] = useState(multilineByDefault)
  const [hasAttachments, setHasAttachments] = useState(false)
  const { draft, setDraft, clearDraft } = useChatDraftStore((state) => state)
  const shouldRenderMultiline = multilineByDefault || hasAttachments || isMultilineByContent
  const handleHasAttachmentsChange = useCallback((nextHasAttachments: boolean) => {
    setHasAttachments(nextHasAttachments)
  }, [])

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
    setIsMultilineByContent(textarea.scrollHeight > 44)
  }, [])

  return (
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
        clearDraft()
        setIsMultilineByContent(multilineByDefault)
      }}
      inputGroupClassName="min-h-14 rounded-xl md:rounded-[1.75rem] border bg-background shadow-sm"
    >
      <PromptInputAttachmentsDisplay onHasAttachmentsChange={handleHasAttachmentsChange} />
      <PromptInputBody className="min-w-0">
        <PromptInputTextarea
          className={cn("max-h-56 min-h-0 pr-4 pl-2 text-base leading-6", shouldRenderMultiline && "pl-4")}
          value={draft}
          onChange={(event) => {
            setDraft(event.currentTarget.value)
            if (!multilineByDefault) {
              handleTextareaHeight(event.currentTarget)
            }
          }}
          onInput={(event) => {
            if (!multilineByDefault) {
              handleTextareaHeight(event.currentTarget)
            }
          }}
          placeholder="Ask anything"
        />
      </PromptInputBody>
      {shouldRenderMultiline && (
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

      {!shouldRenderMultiline && (
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
  )
}
