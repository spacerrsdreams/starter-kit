import type { Message as MessageRow } from "@/generated/prisma/client"

export function toStorageMessageId(chatId: string, clientMessageId: string): string {
  return `${chatId}:${clientMessageId}`
}

export function toClientMessageId(row: MessageRow): string {
  const index = row.id.indexOf(":")
  if (index < 0) {
    return row.id
  }
  return row.id.slice(index + 1)
}
