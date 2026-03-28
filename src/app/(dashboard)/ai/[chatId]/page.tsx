import { Chat } from "@/features/ai/chat/components/chat"

type Props = {
  params: Promise<{ chatId: string }>
}

export default async function AiChatPage({ params }: Props) {
  const { chatId } = await params

  return <Chat initialChatId={chatId} />
}
