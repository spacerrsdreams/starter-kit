"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import { toast } from "sonner"

import { authClient } from "@/features/auth/lib/auth-client"
import { settingsProfileSchema } from "@/features/settings/schemas/settings-profile.schema"
import {
  getAvatarSizeError,
  getUserInitial,
  splitUserName,
  toDataUrl,
} from "@/features/settings/utils/settings-profile-section.utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SettingsProfileSection() {
  const { data: session } = authClient.useSession()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const user = session?.user
  const currentName = user?.name?.trim() ?? ""

  useEffect(() => {
    const splitName = splitUserName(user?.name)
    setFirstName(splitName.firstName)
    setLastName(splitName.lastName)
  }, [user?.name])

  const avatarPreview = useMemo(() => {
    if (!photoFile) {
      return null
    }

    return URL.createObjectURL(photoFile)
  }, [photoFile])

  const profileNameValidation = useMemo(
    () =>
      settingsProfileSchema.safeParse({
        firstName,
        lastName,
      }),
    [firstName, lastName]
  )

  const nextName = useMemo(() => {
    if (!profileNameValidation.success) {
      return ""
    }
    return [profileNameValidation.data.firstName, profileNameValidation.data.lastName].filter(Boolean).join(" ").trim()
  }, [profileNameValidation])

  const hasNameChange = nextName.length > 0 && nextName !== currentName
  const hasPhotoChange = Boolean(photoFile)
  const hasUnsavedChanges = hasNameChange || hasPhotoChange
  const canSave = hasUnsavedChanges && profileNameValidation.success && !isSaving

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setPhotoFile(null)
      setPhotoError(null)
      return
    }

    const fileError = getAvatarSizeError(file)
    if (fileError) {
      setPhotoFile(null)
      setPhotoError(fileError)
      return
    }

    setPhotoFile(file)
    setPhotoError(null)
  }

  const handleSave = async () => {
    if (!profileNameValidation.success) {
      const errorMessage = profileNameValidation.error.issues[0]?.message ?? "Invalid profile values."
      toast.error(errorMessage)
      return
    }

    if (photoFile) {
      const fileError = getAvatarSizeError(photoFile)
      if (fileError) {
        setPhotoError(fileError)
        return
      }
    }

    if (!hasNameChange && !hasPhotoChange) {
      toast.message("No profile changes to save.")
      return
    }

    try {
      setIsSaving(true)

      let image: string | undefined
      if (photoFile) {
        image = await toDataUrl(photoFile)
      }

      await authClient.updateUser({
        name: hasNameChange ? nextName : undefined,
        image,
      })

      setPhotoFile(null)
      setPhotoError(null)
      toast.success("Profile updated.")
    } catch {
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-3">
          <label htmlFor="settings-profile-photo" className="cursor-pointer">
            <span className="sr-only">Upload profile photo</span>
            <Avatar className="size-8 rounded-sm transition-opacity after:rounded-sm hover:opacity-85">
              <AvatarImage
                className="rounded-sm"
                src={avatarPreview ?? user?.image ?? undefined}
                alt={user?.name ?? "User"}
              />
              <AvatarFallback className="rounded-sm">{getUserInitial(user?.email)}</AvatarFallback>
            </Avatar>
          </label>
          <Input
            id="settings-profile-photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handlePhotoChange}
          />
          {photoError ? <p className="text-xs text-destructive">{photoError}</p> : null}
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm leading-none font-medium text-foreground">Your Avatar</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">
            This is your avatar. Click on the avatar to upload a custom one from your files. Max 2MB.
          </p>
        </div>
      </div>

      <div className="space-y-4 pl-11">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="settings-profile-first-name">First name</Label>
            <Input
              id="settings-profile-first-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="First name"
              className="h-9 rounded-xl"
              maxLength={50}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="settings-profile-last-name">Last name</Label>
            <Input
              id="settings-profile-last-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Last name"
              className="h-9 rounded-xl"
              maxLength={50}
            />
          </div>
        </div>

        <Button
          type="button"
          className="ml-auto flex w-fit rounded-xl"
          onClick={() => void handleSave()}
          disabled={!canSave}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </section>
  )
}
