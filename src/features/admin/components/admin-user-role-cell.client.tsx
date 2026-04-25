"use client"

import type { AdminUserRole } from "@/features/admin/types/admin-users.types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AdminUserRoleCellProps = {
  role: AdminUserRole
  disabled: boolean
  onChangeRole: (role: AdminUserRole) => void
}

const ADMIN_USER_ROLES: AdminUserRole[] = ["user", "moderator", "admin"]

function isAdminUserRole(value: string): value is AdminUserRole {
  return ADMIN_USER_ROLES.includes(value as AdminUserRole)
}

export function AdminUserRoleCell({ role, disabled, onChangeRole }: AdminUserRoleCellProps) {
  return (
    <Select
      value={role}
      disabled={disabled}
      onValueChange={(value) => {
        if (!isAdminUserRole(value)) {
          return
        }

        onChangeRole(value)
      }}
    >
      <SelectTrigger className="h-8 w-[140px] capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user" className="capitalize">
          user
        </SelectItem>
        <SelectItem value="moderator" className="capitalize">
          moderator
        </SelectItem>
        <SelectItem value="admin" className="capitalize">
          admin
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
