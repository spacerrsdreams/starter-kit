export type AdminUserSubscriptionStatus = "active" | "inactive" | "cancelled"

export type AdminUserListItem = {
  id: string
  email: string
  role: "user" | "admin"
  subscriptionStatus: AdminUserSubscriptionStatus
}

export type AdminUsersListResponse = {
  totalUsers: number
  users: AdminUserListItem[]
}

export type UpdateAdminUserRequest = {
  email?: string
  role?: "user" | "admin"
}
