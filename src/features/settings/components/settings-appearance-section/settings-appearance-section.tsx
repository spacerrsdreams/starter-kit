"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsAppearanceSection() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const value = theme ?? "system"

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
          {resolvedTheme === "dark" ? (
            <Moon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm leading-none font-medium text-foreground">Theme</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">Choose how the app looks for your account.</p>
        </div>
      </div>
      <div className="pl-11">
        <Select value={value} onValueChange={setTheme}>
          <SelectTrigger className="w-full max-w-xs rounded-xl" aria-label="Select theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light" className="rounded-lg">
              <Sun className="mr-2 inline-block size-4 text-muted-foreground" aria-hidden />
              Light
            </SelectItem>
            <SelectItem value="dark" className="rounded-lg">
              <Moon className="mr-2 inline-block size-4 text-muted-foreground" aria-hidden />
              Dark
            </SelectItem>
            <SelectItem value="system" className="rounded-lg">
              <Monitor className="mr-2 inline-block size-4 text-muted-foreground" aria-hidden />
              System
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
