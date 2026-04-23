import type { UserRole } from "@/generated/prisma/browser"

export type AdminUserSubscriptionStatus = "active" | "inactive" | "cancelled"
export type AdminUserRole = UserRole

export type AdminUserListItem = {
  id: string
  email: string
  role: AdminUserRole
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
