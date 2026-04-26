import { ApiRoutes } from "@/lib/api.routes"
import { apiRequest } from "@/lib/http-client"
import type {
  AdminUserRole,
  AdminUsersListResponse,
  UpdateAdminUserRequest,
} from "@/features/admin/types/admin.types"

export async function listAdminUsersApi() {
  return apiRequest<AdminUsersListResponse>(ApiRoutes.admin.users.list)
}

export async function updateAdminUserApi(userId: string, body: UpdateAdminUserRequest) {
  return apiRequest<{ user: { id: string; email: string; role: AdminUserRole } }>(
    ApiRoutes.admin.users.update(userId),
    {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
}

export async function deleteAdminUserApi(userId: string) {
  return apiRequest<void>(ApiRoutes.admin.users.delete(userId), {
    method: "DELETE",
  })
}
