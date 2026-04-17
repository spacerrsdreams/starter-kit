import { Suspense } from "react"

import { Chat } from "@/features/ai/chat/components/chat"
import { ChatSessionSkeleton } from "@/features/ai/chat/components/chat-session/chat-session-skeleton"

type Props = {
  params: Promise<{ chatId: string }>
}

export default function AiChatPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100dvh-57px-4.5rem)] min-h-0 md:h-[calc(100dvh-57px)]">
          <main className="mx-auto flex min-h-0 max-w-3xl flex-1 flex-col">
            <ChatSessionSkeleton />
          </main>
        </div>
      }
    >
      <AiChatContent params={params} />
    </Suspense>
  )
}

async function AiChatContent({ params }: Props) {
  const { chatId } = await params

  return <Chat initialChatId={chatId} />
}
