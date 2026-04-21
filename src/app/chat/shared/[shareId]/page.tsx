import { notFound } from "next/navigation"

import { SharedChatShell } from "@/features/ai/chat/components/shared-chat-shell.client"
import { SharedChatView } from "@/features/ai/chat/components/shared-chat-view"
import { getSharedChatWithMessages } from "@/features/ai/chat/repositories/chat.repository"

type Props = {
  params: Promise<{ shareId: string }>
}

export default async function SharedChatPage({ params }: Props) {
  const { shareId } = await params
  const chat = await getSharedChatWithMessages(shareId)
  if (!chat) {
    notFound()
  }

  return (
    <SharedChatShell title={chat.title?.trim() || "Shared chat"}>
      <SharedChatView title={chat.title} messages={chat.messages} />
    </SharedChatShell>
  )
}
