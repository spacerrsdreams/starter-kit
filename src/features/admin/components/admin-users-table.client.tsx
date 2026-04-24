"use client"

import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { useState } from "react"
import { toast } from "sonner"

import { AdminUserEditDialog } from "@/features/admin/components/admin-user-edit-dialog.client"
import { getAdminUsersColumns } from "@/features/admin/components/admin-users-columns"
import { AdminUsersDataTable } from "@/features/admin/components/admin-users-data-table.client"
import { AdminUsersTableSkeleton } from "@/features/admin/components/admin-users-table-skeleton"
import { useFetchAdminUsers } from "@/features/admin/hooks/use-fetch-admin-users"
import { useMutateDeleteAdminUser } from "@/features/admin/hooks/use-mutate-delete-admin-user"
import { useMutateImpersonateAdminUser } from "@/features/admin/hooks/use-mutate-impersonate-admin-user"
import { useMutateUpdateAdminUser } from "@/features/admin/hooks/use-mutate-update-admin-user"
import type { AdminUserListItem, AdminUserRole } from "@/features/admin/types/admin-users.types"
import { WebRoutes } from "@/lib/web.routes"

type AdminUsersTableProps = {
  currentUserId: string
}

export function AdminUsersTable({ currentUserId }: AdminUsersTableProps) {
  const router = useRouter()
  const locale = useLocale()
  const [editingUser, setEditingUser] = useState<AdminUserListItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const usersQuery = useFetchAdminUsers()
  const updateUserMutation = useMutateUpdateAdminUser()
  const deleteUserMutation = useMutateDeleteAdminUser()
  const impersonateUserMutation = useMutateImpersonateAdminUser()

  const handleEditUserSubmit = async (payload: { userId: string; email: string; role: AdminUserRole }) => {
    try {
      await updateUserMutation.mutateAsync(payload)
      toast.success("User updated.")
      setIsEditDialogOpen(false)
      setEditingUser(null)
    } catch {
      toast.error("Failed to update user.")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const confirmed = window.confirm("Delete this user?")
    if (!confirmed) {
      return
    }

    try {
      await deleteUserMutation.mutateAsync(userId)
      toast.success("User deleted.")
    } catch {
      toast.error("Failed to delete user.")
    }
  }

  const handleImpersonateUser = async (user: AdminUserListItem) => {
    const confirmed = window.confirm(`You are about to impersonate ${user.email}. Continue?`)
    if (!confirmed) {
      return
    }

    try {
      await impersonateUserMutation.mutateAsync(user.id)
      toast.success("Impersonation started.")
      router.push(WebRoutes.dashboard.path)
    } catch {
      toast.error("Failed to impersonate user.")
    }
  }

  if (usersQuery.isPending || (usersQuery.isFetching && !usersQuery.data)) {
    return <AdminUsersTableSkeleton />
  }

  if (usersQuery.isError && !usersQuery.data) {
    return <p className="text-sm text-destructive">Failed to load users.</p>
  }

  if (!usersQuery.data) {
    return <AdminUsersTableSkeleton />
  }

  const isPendingAction =
    updateUserMutation.isPending || deleteUserMutation.isPending || impersonateUserMutation.isPending
  const columns = getAdminUsersColumns({
    currentUserId,
    locale,
    isPendingAction,
    onEditUser: (user) => {
      setEditingUser(user)
      setIsEditDialogOpen(true)
    },
    onDeleteUser: (userId) => {
      void handleDeleteUser(userId)
    },
    onImpersonateUser: (user) => {
      void handleImpersonateUser(user)
    },
  })

  return (
    <>
      <AdminUsersDataTable columns={columns} data={usersQuery.data.users} />
      <AdminUserEditDialog
        open={isEditDialogOpen}
        user={editingUser}
        isPending={updateUserMutation.isPending}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) {
            setEditingUser(null)
          }
        }}
        onSubmit={handleEditUserSubmit}
      />
    </>
  )
}
