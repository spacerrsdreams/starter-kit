"use client"

import { Bell, Megaphone } from "lucide-react"

import { useFetchNotificationPreferences } from "@/features/settings/hooks/use-fetch-notification-preferences"
import { useMutateNotificationPreferences } from "@/features/settings/hooks/use-mutate-notification-preferences"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

import { SettingsNotificationSubsection } from "./settings-notification-subsection"
import { SettingsNotificationsSectionSkeleton } from "./settings-notifications-section-skeleton"

export function SettingsNotificationsSection() {
  const preferencesQuery = useFetchNotificationPreferences()
  const preferencesMutation = useMutateNotificationPreferences()

  if (preferencesQuery.isLoading) {
    return <SettingsNotificationsSectionSkeleton />
  }

  if (preferencesQuery.isError || !preferencesQuery.data) {
    return <SettingsNotificationsSectionSkeleton />
  }

  const handlePersonalizedChange = (checked: boolean) => {
    preferencesMutation.mutate({
      notificationsEmailPersonalized: checked,
    })
  }

  const handleMarketingChange = (checked: boolean) => {
    preferencesMutation.mutate({
      notificationsEmailMarketing: checked,
    })
  }

  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsNotificationSubsection
        icon={Bell}
        title="Personalized emails"
        description="Receive product reminders and service updates by email."
        toggle={
          <Switch
            checked={preferencesQuery.data.notificationsEmailPersonalized}
            onCheckedChange={handlePersonalizedChange}
            disabled={preferencesMutation.isPending}
          />
        }
      />

      <Separator />

      <SettingsNotificationSubsection
        icon={Megaphone}
        title="Marketing emails"
        description="Receive promotions and feature announcements."
        toggle={
          <Switch
            checked={preferencesQuery.data.notificationsEmailMarketing}
            onCheckedChange={handleMarketingChange}
            disabled={preferencesMutation.isPending}
          />
        }
      />
    </div>
  )
}
