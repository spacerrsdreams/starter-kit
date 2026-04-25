import { Suspense } from "react"

import { AiWidgetLazy } from "@/features/ai/widget/components/ai-widget-lazy.client"
import { PlanPickerDialogProvider } from "@/features/billing/components/plan-picker-dialog/plan-picker-dialog-provider.client"
import { SettingsDialogGlobalBridge } from "@/features/settings/components/settings-dialog/settings-dialog-global-bridge.client"
import { DashboardHeader } from "@/components/dashboard/dashboard-header.client"
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav.client"
import { Sidebar } from "@/components/dashboard/sidebar.client"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlanPickerDialogProvider>
      <SidebarProvider>
        <Suspense fallback={<div />}>
          <Sidebar />
        </Suspense>
        <SidebarInset className="pb-24 md:pb-0">
          <Suspense fallback={null}>
            <DashboardHeader />
            <MobileBottomNav />
            <SettingsDialogGlobalBridge />
            <AiWidgetLazy />
            {children}
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </PlanPickerDialogProvider>
  )
}
