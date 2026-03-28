"use client"

import { User } from "better-auth"
import { LogOut, Settings } from "lucide-react"
import { useState, useTransition } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { SettingsDialog } from "@/features/settings/components/settings-dialog/settings-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type UserButtonProps = {
  user: User
}

function getInitial(email: string): string {
  const trimmed = email.trim()
  if (!trimmed) return "U"
  return trimmed[0]?.toUpperCase() ?? "U"
}

export function UserButton({ user }: UserButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut()
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="ghost" size="icon" aria-label="Open account menu">
            <Avatar>
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback>{getInitial(user.email)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} disabled={isPending}>
            <LogOut className="mr-2 h-4 w-4" />
            {isPending ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isSettingsOpen ? <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} /> : null}
    </>
  )
}
