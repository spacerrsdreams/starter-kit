"use client"

import { Scale } from "lucide-react"

import { SettingsLegalItem } from "./settings-legal-item"
import { SettingsLegalSectionLayout } from "./settings-legal-section-layout"

export function SettingsLegalSection() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      <SettingsLegalSectionLayout
        icon={Scale}
        title="Legal"
        description="Review our legal terms and privacy commitments."
      >
        <div className="space-y-1">
          <SettingsLegalItem
            href="/privacy-policy"
            label="Privacy policy"
            description="How we collect, use, and protect your data."
          />
          <SettingsLegalItem
            href="/terms-of-service"
            label="Terms of service"
            description="Rules and conditions for using this product."
          />
        </div>
      </SettingsLegalSectionLayout>
    </div>
  )
}
