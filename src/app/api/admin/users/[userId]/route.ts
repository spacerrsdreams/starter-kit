import "server-only"

import { UserRole } from "@/generated/prisma/client"
import { NextResponse } from "next/server"

import { deleteAdminUser, updateAdminUser } from "@/features/admin/repositories/admin-users.repository"
import { updateAdminUserSchema } from "@/features/admin/schemas/update-admin-user.schema"
import { getAdminSession } from "@/features/admin/utils/get-admin-session.server"

const noIndexHeaders = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
}

type AdminUserRouteContext = {
  params: Promise<{
    userId: string
  }>
}

export async function PATCH(request: Request, context: AdminUserRouteContext) {
  const session = await getAdminSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noIndexHeaders })
  }

  const { userId } = await context.params
  if (session.user.id === userId) {
    return NextResponse.json(
      { error: "You cannot edit your own account from admin." },
      { status: 400, headers: noIndexHeaders }
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = updateAdminUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400, headers: noIndexHeaders })
  }

  let normalizedRole: UserRole | undefined
  if (parsed.data.role === "admin") {
    normalizedRole = UserRole.admin
  } else if (parsed.data.role === "user") {
    normalizedRole = UserRole.user
  }

  const updatedUser = await updateAdminUser(userId, {
    email: parsed.data.email,
    role: normalizedRole,
  }).catch(() => null)
  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404, headers: noIndexHeaders })
  }

  return NextResponse.json({ user: updatedUser }, { headers: noIndexHeaders })
}

export async function DELETE(_: Request, context: AdminUserRouteContext) {
  const session = await getAdminSession()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noIndexHeaders })
  }

  const { userId } = await context.params
  if (session.user.id === userId) {
    return NextResponse.json(
      { error: "You cannot delete your own account from admin." },
      { status: 400, headers: noIndexHeaders }
    )
  }

  const deletedUser = await deleteAdminUser(userId).catch(() => null)
  if (!deletedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404, headers: noIndexHeaders })
  }

  return new NextResponse(null, { status: 204, headers: noIndexHeaders })
}
