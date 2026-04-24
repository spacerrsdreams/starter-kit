"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash2, UserRoundCheck } from "lucide-react"

import type { AdminUserListItem, AdminUserSubscriptionStatus } from "@/features/admin/types/admin-users.types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type AdminUsersColumnActions = {
  currentUserId: string
  isPendingAction: boolean
  onEditUser: (user: AdminUserListItem) => void
  onDeleteUser: (userId: string) => void
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

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt)
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short",
  }).format(date)
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
      cell: ({ row }) => <span className="capitalize">{row.original.role}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => formatCreatedAt(row.original.createdAt),
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
