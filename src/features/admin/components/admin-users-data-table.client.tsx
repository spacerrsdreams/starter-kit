"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import * as React from "react"

import type { AdminUserListItem } from "@/features/admin/types/admin-users.types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type AdminUsersDataTableProps = {
  columns: ColumnDef<AdminUserListItem>[]
  data: AdminUserListItem[]
}

export function AdminUsersDataTable({ columns, data }: AdminUsersDataTableProps) {
  const [timeRange, setTimeRange] = React.useState<"7d" | "30d" | "3m" | "full">("full")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const filteredByTimeRange = React.useMemo(() => {
    if (timeRange === "full") {
      return data
    }

    const now = Date.now()
    const dayMs = 24 * 60 * 60 * 1000
    let rangeMs = 90 * dayMs
    if (timeRange === "7d") {
      rangeMs = 7 * dayMs
    } else if (timeRange === "30d") {
      rangeMs = 30 * dayMs
    }

    return data.filter((user) => {
      const createdAt = new Date(user.createdAt).getTime()
      if (Number.isNaN(createdAt)) {
        return false
      }

      return now - createdAt <= rangeMs
    })
  }, [data, timeRange])

  const stats = React.useMemo(() => {
    const now = Date.now()
    const activeUsers = filteredByTimeRange.filter((user) => {
      if (!user.lastActiveAt) {
        return false
      }

      const lastSeenAt = new Date(user.lastActiveAt).getTime()
      if (Number.isNaN(lastSeenAt)) {
        return false
      }

      return now - lastSeenAt <= 30 * 24 * 60 * 60 * 1000
    }).length

    const subscribedUsers = filteredByTimeRange.filter((user) => user.subscriptionStatus === "active").length
    const deactivatedUsers = filteredByTimeRange.filter((user) => user.deactivatedAt !== null).length

    return {
      totalUsers: filteredByTimeRange.length,
      activeUsers,
      subscribedUsers,
      deactivatedUsers,
    }
  }, [filteredByTimeRange])

  const table = useReactTable({
    data: filteredByTimeRange,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const formatColumnLabel = (columnId: string) =>
    columnId
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim()

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Total users</p>
          <p className="text-2xl font-semibold">{stats.totalUsers}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Active users (seen in 30 days)</p>
          <p className="text-2xl font-semibold">{stats.activeUsers}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Subscribed users</p>
          <p className="text-2xl font-semibold">{stats.subscribedUsers}</p>
        </div>
        <div className="rounded-md border p-3">
          <p className="text-xs text-muted-foreground">Deactivated accounts</p>
          <p className="text-2xl font-semibold">{stats.deactivatedUsers}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("email")?.setFilterValue(event.target.value)}
          className="w-full max-w-sm sm:w-72"
        />
        <Select value={timeRange} onValueChange={(value: "7d" | "30d" | "3m" | "full") => setTimeRange(value)}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter range..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Range: Last 7 days</SelectItem>
            <SelectItem value="30d">Range: Last 30 days</SelectItem>
            <SelectItem value="3m">Range: Last 3 months</SelectItem>
            <SelectItem value="full">Range: Full</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={String(table.getColumn("lastActiveAt")?.getFilterValue() ?? "all")}
          onValueChange={(value) => table.getColumn("lastActiveAt")?.setFilterValue(value)}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter last seen..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Last seen: All</SelectItem>
            <SelectItem value="today">Last seen: Today</SelectItem>
            <SelectItem value="week">Last seen: Last 7 days</SelectItem>
            <SelectItem value="month">Last seen: Last 30 days</SelectItem>
            <SelectItem value="never">Last seen: Never</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={String(table.getColumn("deactivatedAt")?.getFilterValue() ?? "all")}
          onValueChange={(value) => table.getColumn("deactivatedAt")?.setFilterValue(value)}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter deactivated..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Deactivated: All</SelectItem>
            <SelectItem value="active">Deactivated: No</SelectItem>
            <SelectItem value="deactivated">Deactivated: Yes</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Columns</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto min-w-52">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  className="whitespace-nowrap"
                >
                  {formatColumnLabel(column.id)}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
