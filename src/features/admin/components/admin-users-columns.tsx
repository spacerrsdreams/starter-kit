"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2, UserRoundCheck } from "lucide-react"

import type { AdminUserListItem, AdminUserSubscriptionStatus } from "@/features/admin/types/admin-users.types"
import { AdminUserRoleCell } from "@/features/admin/components/admin-user-role-cell.client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type AdminUsersColumnActions = {
  currentUserId: string
  locale: string
  isPendingAction: boolean
  onEditUser: (user: AdminUserListItem) => void
  onDeleteUser: (userId: string) => void
  onChangeRole: (user: AdminUserListItem, nextRole: AdminUserListItem["role"]) => void
  onImpersonateUser: (user: AdminUserListItem) => void
}

function getSubscriptionBadgeVariant(subscriptionStatus: AdminUserSubscriptionStatus) {
  if (subscriptionStatus === "active") {
    return "success"
  }

  if (subscriptionStatus === "cancelled") {
    return "destructive"
  }

  return "secondary"
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function formatCreatedAt(createdAt: string, locale: string) {
  const date = new Date(createdAt)
  const formatted = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
  return formatted.replace(/^(\d{2}\s\w{3})\s(\d{4})$/, "$1, $2")
}

function formatLastSeen(lastActiveAt: string | null, locale: string) {
  if (!lastActiveAt) {
    return "Never"
  }

  return formatCreatedAt(lastActiveAt, locale)
}

export function getAdminUsersColumns(actions: AdminUsersColumnActions): ColumnDef<AdminUserListItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.image ?? undefined} alt={row.original.name} />
            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3">
          Email
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.email,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original
        const isSelf = user.id === actions.currentUserId
        return (
          <AdminUserRoleCell
            role={user.role}
            disabled={actions.isPendingAction || isSelf}
            onChangeRole={(nextRole) => actions.onChangeRole(user, nextRole)}
          />
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => formatCreatedAt(row.original.createdAt, actions.locale),
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last Seen At",
      filterFn: (row, columnId, filterValue) => {
        const value = row.getValue(columnId) as string | null
        const filter = String(filterValue ?? "all")

        if (filter === "all") {
          return true
        }

        if (filter === "never") {
          return value === null
        }

        if (!value) {
          return false
        }

        const seenAt = new Date(value).getTime()
        if (Number.isNaN(seenAt)) {
          return false
        }

        const now = Date.now()
        const oneDayMs = 24 * 60 * 60 * 1000

        if (filter === "today") {
          return now - seenAt <= oneDayMs
        }

        if (filter === "week") {
          return now - seenAt <= 7 * oneDayMs
        }

        if (filter === "month") {
          return now - seenAt <= 30 * oneDayMs
        }

        return true
      },
      cell: ({ row }) => formatLastSeen(row.original.lastActiveAt, actions.locale),
    },
    {
      accessorKey: "deactivatedAt",
      header: "Account Status",
      cell: ({ row }) =>
        row.original.deactivatedAt ? (
          <Badge variant="destructive">Deactivated</Badge>
        ) : (
          <Badge variant="secondary">Active</Badge>
        ),
    },
    {
      accessorKey: "subscriptionStatus",
      header: "Subscription Status",
      cell: ({ row }) => (
        <Badge variant={getSubscriptionBadgeVariant(row.original.subscriptionStatus)} className="capitalize">
          {row.original.subscriptionStatus}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original
        const isSelf = user.id === actions.currentUserId
        const isDisabled = isSelf || actions.isPendingAction

        return (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => actions.onEditUser(user)} disabled={isDisabled}>
                  <Pencil className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit user</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={() => actions.onDeleteUser(user.id)} disabled={isDisabled}>
                  <Trash2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete user</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => actions.onImpersonateUser(user)}
                  disabled={isDisabled}
                >
                  <UserRoundCheck className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Impersonate user</TooltipContent>
            </Tooltip>
          </div>
        )
      },
    },
  ]
}
