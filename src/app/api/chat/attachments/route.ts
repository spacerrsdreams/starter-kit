import { get, put } from "@vercel/blob"
import { NextResponse } from "next/server"

import { sanitizeFilename } from "@/features/ai/chat/utils/chat-attachment-path.utils"
import { getSessionUserId } from "@/features/auth/lib/auth"

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const CHAT_ATTACHMENT_PREFIX = "chat-attachments"
const CHAT_ATTACHMENTS_API_PATH = "/api/chat/attachments"

function buildAttachmentPathname(userId: string, filename: string): string {
  return `${CHAT_ATTACHMENT_PREFIX}/${userId}/${Date.now()}-${sanitizeFilename(filename)}`
}

function isOwnAttachmentPathname(userId: string, pathname: string): boolean {
  return pathname.startsWith(`${CHAT_ATTACHMENT_PREFIX}/${userId}/`)
}

function buildReadAttachmentPath(pathname: string): string {
  return `${CHAT_ATTACHMENTS_API_PATH}?pathname=${encodeURIComponent(pathname)}`
}

export async function POST(request: Request) {
  const userId = await getSessionUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File must be 5MB or smaller" }, { status: 400 })
  }

  const pathname = buildAttachmentPathname(userId, file.name)
  await put(pathname, file, {
    access: "private",
    addRandomSuffix: true,
    contentType: file.type || "application/octet-stream",
  })

  return NextResponse.json({
    pathname,
    url: buildReadAttachmentPath(pathname),
  })
}

export async function GET(request: Request) {
  const userId = await getSessionUserId()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const pathname = searchParams.get("pathname")?.trim()

  if (!pathname) {
    return NextResponse.json({ error: "pathname is required" }, { status: 400 })
  }

  if (!isOwnAttachmentPathname(userId, pathname)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const blobResult = await get(pathname, {
    access: "private",
  })

  if (!blobResult || blobResult.statusCode !== 200 || !blobResult.blob) {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 })
  }

  return new Response(blobResult.stream, {
    status: 200,
    headers: {
      "Cache-Control": "private, max-age=60",
      "Content-Disposition": blobResult.blob.contentDisposition ?? "inline",
      "Content-Length": String(blobResult.blob.size),
      "Content-Type": blobResult.blob.contentType || "application/octet-stream",
      ETag: blobResult.blob.etag,
    },
  })
}
