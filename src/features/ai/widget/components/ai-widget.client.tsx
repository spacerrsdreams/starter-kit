"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { UIMessage } from "ai"
import { PlusIcon, XIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import { ChatSession } from "@/features/ai/chat/components/chat-session/chat-session"
import { CHAT_EXAMPLE_PROMPTS } from "@/features/ai/chat/constants/chat-example-prompts.constants"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"
import { useFetchChatDetail } from "@/features/ai/chat/hooks/use-fetch-chat-detail"
import { useFetchChats } from "@/features/ai/chat/hooks/use-fetch-chats"
import { useMutateDeleteChat } from "@/features/ai/chat/hooks/use-mutate-delete-chat"
import type { ChatListItem } from "@/features/ai/chat/types/chat.types"
import { AiWidgetHistoryDropdown } from "@/features/ai/widget/components/ai-widget-history-dropdown"
import { authClient } from "@/features/auth/lib/auth-client"
import { PromptInputProvider } from "@/components/ai-elements/prompt-input"
import { Button } from "@/components/ui/button"
import { LogoSvg } from "@/components/ui/icons/logo.icon"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"

type AiWidgetProps = {
  defaultOpen?: boolean
}

export function AiWidget({ defaultOpen = false }: AiWidgetProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(defaultOpen)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [sessionClientId, setSessionClientId] = useState("")
  const hasRefetchedChatsForSessionRef = useRef(false)
  const allowCloseRef = useRef(false)

  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)
  const isGuestResolved = !isSessionPending && !isAuthenticated

  const chatsQuery = useFetchChats()
  const chatDetailQuery = useFetchChatDetail(activeChatId)
  const deleteChatMutation = useMutateDeleteChat()
  const chats = useMemo<ChatListItem[]>(
    () => chatsQuery.data?.pages.flatMap((page) => page.chats) ?? [],
    [chatsQuery.data?.pages]
  )

  const hydratedFromServer = Boolean(activeChatId) && sessionClientId === activeChatId
  const initialMessages: UIMessage[] = hydratedFromServer && chatDetailQuery.data ? chatDetailQuery.data.messages : []
  const waitingForChatDetail =
    isAuthenticated && Boolean(activeChatId) && hydratedFromServer && chatDetailQuery.isPending
  const isWidgetLoading = isSessionPending || !sessionClientId || waitingForChatDetail

  useEffect(() => {
    if (!sessionClientId) {
      return
    }
    hasRefetchedChatsForSessionRef.current = false
  }, [sessionClientId])

  useEffect(() => {
    if (isSessionPending) {
      return
    }

    if (isGuestResolved) {
      if (activeChatId !== null) {
        setActiveChatId(null)
      }
      if (!sessionClientId) {
        setSessionClientId(crypto.randomUUID())
      }
      return
    }

    if (!chatsQuery.isSuccess || sessionClientId) {
      return
    }

    setSessionClientId(crypto.randomUUID())
  }, [activeChatId, chatsQuery.isSuccess, isGuestResolved, isSessionPending, sessionClientId])

  const handleNewChat = () => {
    setActiveChatId(null)
    setSessionClientId(crypto.randomUUID())
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setOpen(true)
          return
        }
        if (allowCloseRef.current) {
          setOpen(false)
        }
        allowCloseRef.current = false
      }}
      modal={false}
    >
      <SheetTrigger asChild>
        <Button
          type="button"
          size="icon"
          className="fixed right-4 bottom-4 z-40 size-12 rounded-full shadow-lg md:right-6 md:bottom-6"
          aria-label="Open AI widget"
        >
          <LogoSvg iconSize={28} className="text-white!" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="max-h-dvh"
        onInteractOutside={(event) => {
          event.preventDefault()
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault()
        }}
      >
        <SheetTitle className="sr-only">AI Assistant Widget</SheetTitle>
        <SheetDescription className="sr-only">
          Chat with AI, browse conversation history, and start a new chat.
        </SheetDescription>
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex h-[57px] shrink-0 items-center justify-between border-none px-2 py-2.5">
            <AiWidgetHistoryDropdown
              chats={chats}
              activeChatId={activeChatId}
              isDeleting={deleteChatMutation.isPending}
              onSelectChat={(chatId) => {
                setActiveChatId(chatId)
                setSessionClientId(chatId)
              }}
              onDeleteChat={(chatId) => {
                void (async () => {
                  try {
                    await deleteChatMutation.mutateAsync(chatId)
                    if (activeChatId === chatId) {
                      handleNewChat()
                    }
                  } catch {
                    return
                  }
                })()
              }}
            />
            <div className="flex items-center gap-1">
              <Button type="button" variant="ghost" size="icon" aria-label="New chat" onClick={handleNewChat}>
                <PlusIcon className="size-5" strokeWidth={1.8} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close AI widget"
                onClick={() => {
                  allowCloseRef.current = true
                  setOpen(false)
                }}
              >
                <XIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {isWidgetLoading ? (
              <div className="flex min-h-0 flex-1 items-center justify-center">
                <Spinner className="size-7" />
              </div>
            ) : (
              <PromptInputProvider>
                <ChatSession
                  key={sessionClientId}
                  sessionClientId={sessionClientId}
                  isAuthenticated={isAuthenticated}
                  initialDbChatId={activeChatId}
                  initialMessages={initialMessages}
                  examplePrompts={CHAT_EXAMPLE_PROMPTS}
                  examplePromptsLayout="single-column"
                  compactMode
                  onChatCreated={(id) => {
                    setActiveChatId(id)
                  }}
                  onConversationUpdated={() => {
                    if (!hasRefetchedChatsForSessionRef.current) {
                      hasRefetchedChatsForSessionRef.current = true
                      void queryClient.invalidateQueries({ queryKey: chatQueryKeys.chats() })
                    }
                  }}
                />
              </PromptInputProvider>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
