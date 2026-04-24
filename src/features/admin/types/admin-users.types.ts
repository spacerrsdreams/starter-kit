import type { UserRole } from "@/generated/prisma/browser"

export type AdminUserSubscriptionStatus = "active" | "inactive" | "cancelled"
export type AdminUserRole = UserRole

export type AdminUserListItem = {
  id: string
  name: string
  image: string | null
  email: string
  role: AdminUserRole
  createdAt: string
  lastActiveAt: string | null
  deactivatedAt: string | null
  subscriptionStatus: AdminUserSubscriptionStatus
}

export type AdminUsersListResponse = {
  totalUsers: number
  users: AdminUserListItem[]
}

export type UpdateAdminUserRequest = {
  email?: string
  role?: AdminUserRole
}
