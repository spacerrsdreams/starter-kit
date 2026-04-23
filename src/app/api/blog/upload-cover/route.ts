import "server-only"

import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

import { getAdminOrModeratorSession } from "@/features/blog/utils/get-admin-or-moderator-session.server"

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-")
}

export async function POST(request: Request) {
  const session = await getAdminOrModeratorSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 })
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "Image must be 10MB or smaller" }, { status: 400 })
  }

  const uploaded = await put(`blog-covers/${Date.now()}-${sanitizeFilename(file.name)}`, file, {
    access: "public",
    addRandomSuffix: true,
  })

  return NextResponse.json({
    imageUrl: uploaded.url,
  })
}
