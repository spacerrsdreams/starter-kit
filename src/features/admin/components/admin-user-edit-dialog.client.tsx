"use client"

import { useEffect, useState } from "react"

import type { AdminUserListItem } from "@/features/admin/types/admin-users.types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type AdminUserEditDialogProps = {
  open: boolean
  user: AdminUserListItem | null
  isPending: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: { userId: string; email: string; role: "user" | "admin" }) => Promise<void>
}

export function AdminUserEditDialog({ open, user, isPending, onOpenChange, onSubmit }: AdminUserEditDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"user" | "admin">("user")

  useEffect(() => {
    if (!user) {
      return
    }

    setEmail(user.email)
    setRole(user.role)
  }, [user])

  const handleSubmit = async () => {
    if (!user) {
      return
    }

    await onSubmit({
      userId: user.id,
      email: email.trim(),
      role,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>Update safe fields only: email and role.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="admin-user-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="admin-user-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="admin-user-role" className="text-sm font-medium">
              Role
            </label>
            <Select value={role} onValueChange={(value) => setRole(value as "user" | "admin")} disabled={isPending}>
              <SelectTrigger id="admin-user-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">user</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={isPending || !user}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
