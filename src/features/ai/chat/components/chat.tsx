"use client"

import { useQueryClient } from "@tanstack/react-query"
import type { UIMessage } from "ai"
import { useEffect, useRef, useState } from "react"

import { ApiError } from "@/lib/http-client"
import { WebRoutes } from "@/lib/web.routes"
import { ChatSession } from "@/features/ai/chat/components/chat-session/chat-session"
import { ChatSessionSkeleton } from "@/features/ai/chat/components/chat-session/chat-session-skeleton"
import { chatQueryKeys } from "@/features/ai/chat/constants/chat-query-keys"
import { NEW_CHAT_EVENT_NAME } from "@/features/ai/chat/constants/new-chat-event.constants"
import { useFetchChatDetail } from "@/features/ai/chat/hooks/use-fetch-chat-detail"
import { useFetchChats } from "@/features/ai/chat/hooks/use-fetch-chats"
import { useChatNavigationStore } from "@/features/ai/chat/store/chat-navigation.store"
import type { ChatProps } from "@/features/ai/chat/types/chat.types"
import { authClient } from "@/features/auth/lib/auth-client"
import { PromptInputProvider } from "@/components/ai-elements/prompt-input"

export function Chat({ initialChatId = null }: ChatProps) {
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const isAuthenticated = Boolean(session?.user)
  const isGuestResolved = !isSessionPending && !isAuthenticated
  const queryClient = useQueryClient()
  const chatsQuery = useFetchChats()

  const [routingReady, setRoutingReady] = useState(false)
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId)
  const [sessionClientId, setSessionClientId] = useState("")
  const bootstrapModeRef = useRef<"guest" | "authenticated" | null>(null)
  const ignoredInitialChatIdRef = useRef(false)
  const hasRefetchedChatsForSessionRef = useRef(false)
  const setNavigationActiveChatId = useChatNavigationStore((state) => state.setActiveChatId)
  const chatDetailQuery = useFetchChatDetail(activeChatId)
  const replaceAddressBarPath = (path: string) => {
    if (window.location.pathname === path) {
      return
    }
    window.history.replaceState(window.history.state, "", path)
  }

  const hydratedFromServer = Boolean(activeChatId) && sessionClientId === activeChatId
  const initialMessages: UIMessage[] = hydratedFromServer && chatDetailQuery.data ? chatDetailQuery.data.messages : []

  useEffect(() => {
    if (isSessionPending) {
      return
    }

    if (isGuestResolved) {
      if (bootstrapModeRef.current === "guest") {
        return
      }
      bootstrapModeRef.current = "guest"
      setActiveChatId(null)
      setSessionClientId(crypto.randomUUID())
      setRoutingReady(true)
      return
    }

    if (
      chatsQuery.isPending ||
      chatsQuery.isError ||
      !chatsQuery.isSuccess ||
      bootstrapModeRef.current === "authenticated"
    ) {
      return
    }

    bootstrapModeRef.current = "authenticated"
    queueMicrotask(() => {
      if (initialChatId && !ignoredInitialChatIdRef.current) {
        setActiveChatId(initialChatId)
        setSessionClientId(initialChatId)
        setRoutingReady(true)
        return
      }

      setActiveChatId(null)
      setSessionClientId(crypto.randomUUID())
      setRoutingReady(true)
    })
  }, [
    chatsQuery.data,
    chatsQuery.isError,
    chatsQuery.isPending,
    chatsQuery.isSuccess,
    initialChatId,
    isGuestResolved,
    isSessionPending,
  ])

  useEffect(() => {
    if (!routingReady || isSessionPending) {
      return
    }

    if (initialChatId && !ignoredInitialChatIdRef.current && activeChatId !== initialChatId) {
      setActiveChatId(initialChatId)
      setSessionClientId(initialChatId)
    }
  }, [activeChatId, initialChatId, isSessionPending, routingReady])

  useEffect(() => {
    const handleNewChat = () => {
      setActiveChatId(null)
      setSessionClientId(crypto.randomUUID())
      replaceAddressBarPath(WebRoutes.dashboard.path)
    }

    window.addEventListener(NEW_CHAT_EVENT_NAME, handleNewChat)
    return () => {
      window.removeEventListener(NEW_CHAT_EVENT_NAME, handleNewChat)
    }
  }, [])

  useEffect(() => {
    if (!sessionClientId) {
      return
    }
    hasRefetchedChatsForSessionRef.current = false
  }, [sessionClientId])

  useEffect(() => {
    if (!activeChatId || !chatDetailQuery.isError) {
      return
    }
    const isNotFound = chatDetailQuery.error instanceof ApiError && chatDetailQuery.error.status === 404
    if (!isNotFound) {
      return
    }
    ignoredInitialChatIdRef.current = true
    setActiveChatId(null)
    setSessionClientId(crypto.randomUUID())
    replaceAddressBarPath(WebRoutes.dashboard.path)
  }, [activeChatId, chatDetailQuery.error, chatDetailQuery.isError])

  useEffect(() => {
    setNavigationActiveChatId(activeChatId)
  }, [activeChatId, setNavigationActiveChatId])

  if (chatsQuery.isError) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center p-6 text-sm text-destructive">
        Could not load chats.
      </div>
    )
  }

  if (isSessionPending || !routingReady || !sessionClientId) {
    return (
      <div className="flex h-[calc(100dvh-57px-4.5rem)] min-h-0 md:h-[calc(100dvh-57px)]">
        <main className="mx-auto flex min-h-0 max-w-3xl flex-1 flex-col">
          <ChatSessionSkeleton />
        </main>
      </div>
    )
  }

  const waitingForChatDetail =
    isAuthenticated && Boolean(activeChatId) && hydratedFromServer && chatDetailQuery.isPending

  return (
    <div className="flex h-[calc(100dvh-57px-4.5rem)] min-h-0 md:h-[calc(100dvh-57px)]">
      <main className="mx-auto flex min-h-0 max-w-3xl flex-1 flex-col">
        {waitingForChatDetail ? (
          <ChatSessionSkeleton />
        ) : (
          <PromptInputProvider>
            <ChatSession
              key={sessionClientId}
              sessionClientId={sessionClientId}
              isAuthenticated={isAuthenticated}
              initialDbChatId={activeChatId}
              initialMessages={initialMessages}
              onChatCreated={(id) => {
                setActiveChatId(id)
                replaceAddressBarPath(WebRoutes.chat(id))
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
      </main>
    </div>
  )
}
