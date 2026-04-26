import { Suspense } from "react"

import { AiWidgetLazy } from "@/features/ai/widget/components/ai-widget-lazy"
import { PlanPickerDialogProvider } from "@/features/billing/components/plan-picker-dialog/plan-picker-dialog-provider"
import { SettingsDialogGlobalBridge } from "@/features/settings/components/settings-dialog/settings-dialog-global-bridge"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav"
import { Sidebar } from "@/components/dashboard/sidebar"
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
