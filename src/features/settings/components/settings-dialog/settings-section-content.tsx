"use client"

import type { SettingsSectionId } from "@/features/settings/types/settings.types"

import { SettingsAccountSection } from "../settings-account-section/settings-account-section"
import { SettingsAppearanceSection } from "../settings-appearance-section/settings-appearance-section"
import { SettingsLegalSection } from "../settings-legal-section/settings-legal-section"
import { SettingsNotificationsSection } from "../settings-notifications-section/settings-notifications-section"
import { SettingsProfileSection } from "../settings-profile-section/settings-profile-section"

type SettingsSectionContentProps = {
  section: SettingsSectionId
}

export function SettingsSectionContent({ section }: SettingsSectionContentProps) {
  return (
    <>
      {section === "profile" && <SettingsProfileSection />}
      {section === "account" && <SettingsAccountSection />}
      {section === "notifications" && <SettingsNotificationsSection />}
      {section === "appearance" && <SettingsAppearanceSection />}
      {section === "legal" && <SettingsLegalSection />}
    </>
  )
}
