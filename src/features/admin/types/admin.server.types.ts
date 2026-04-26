import type { UserRole } from "@/generated/prisma/client"

export type UpdateAdminUserData = {
  email?: string
  role?: UserRole
}
