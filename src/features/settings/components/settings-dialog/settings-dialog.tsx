"use client"

import { ChevronLeft, Menu, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { authClient } from "@/lib/auth/auth-client"
import { getVisibleSettingsNavItems } from "@/features/settings/constants/settings-nav.constants"
import type {
  SettingsDialogProps,
  SettingsMobileView,
  SettingsSectionId,
} from "@/features/settings/types/settings-dialog.types"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

import { SettingsItemIndicator } from "./settings-item-indicator"
import { SettingsSectionContent } from "./settings-section-content"

export function SettingsDialog({ open, onOpenChange, defaultSection = "account" }: SettingsDialogProps) {
  const isMobile = useIsMobile()
  const [section, setSection] = useState<SettingsSectionId>(defaultSection)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileView, setMobileView] = useState<SettingsMobileView>("list")

  const { data: session } = authClient.useSession()
  const accountHasWarning = session?.user?.emailVerified !== true
  const isAuthenticated = Boolean(session?.user)
  const visibleNavItems = useMemo(() => getVisibleSettingsNavItems(isAuthenticated), [isAuthenticated])
  const activeSectionLabel = visibleNavItems.find((item) => item.id === section)?.label ?? "Settings"

  useEffect(() => {
    if (!open) return

    const requestedSection = visibleNavItems.find((item) => item.id === defaultSection)?.id
    setSection(requestedSection ?? visibleNavItems[0]?.id ?? "legal")
    setMobileView("list")
  }, [defaultSection, open, visibleNavItems])

  useEffect(() => {
    const isCurrentSectionVisible = visibleNavItems.some((item) => item.id === section)
    if (!isCurrentSectionVisible) {
      setSection(visibleNavItems[0]?.id ?? "legal")
    }
  }, [section, visibleNavItems])

  const handleSectionSelect = (id: SettingsSectionId) => {
    setSection(id)
    setMobileNavOpen(false)
    if (isMobile) setMobileView("section")
  }

  const renderMobileList = () => (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <span className="text-sm font-medium">Settings</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          aria-label="Close settings"
          onClick={() => onOpenChange(false)}
        >
          <X className="size-5" />
        </Button>
      </header>
      <nav className="flex flex-1 flex-col overflow-y-auto p-2">
        {visibleNavItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="h-auto justify-start gap-3 rounded-xl px-4 py-3"
            onClick={() => handleSectionSelect(item.id)}
          >
            <item.icon className="size-5 shrink-0" />
            <span className="flex items-center gap-2">
              <span className="font-medium">{item.label}</span>
              {item.id === "account" && accountHasWarning && <SettingsItemIndicator title="Email is not verified" />}
            </span>
            <ChevronLeft className="ml-auto size-4 rotate-180 text-muted-foreground" aria-hidden />
          </Button>
        ))}
      </nav>
    </>
  )

  const renderMobileSection = () => (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          aria-label="Back to settings list"
          onClick={() => setMobileView("list")}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <span className="text-sm font-medium">{activeSectionLabel}</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-9 shrink-0"
          aria-label="Close settings"
          onClick={() => onOpenChange(false)}
        >
          <X className="size-5" />
        </Button>
      </header>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <SettingsSectionContent section={section} />
      </div>
    </>
  )

  const renderDesktop = () => (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open settings menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Settings</SheetTitle>
            <nav className="flex flex-col pt-6">
              {visibleNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={section === item.id ? "secondary" : "ghost"}
                  className="justify-start gap-2 rounded-none px-4 py-3"
                  onClick={() => handleSectionSelect(item.id)}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                  {item.id === "account" && accountHasWarning && (
                    <span className="ml-auto">
                      <SettingsItemIndicator title="Email is not verified" />
                    </span>
                  )}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <span className="text-sm font-medium">{activeSectionLabel}</span>
        <DialogClose asChild>
          <Button variant="ghost" size="icon" className="ml-auto size-9 shrink-0" aria-label="Close settings">
            <X className="size-5" />
          </Button>
        </DialogClose>
      </header>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <SettingsSectionContent section={section} />
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" showCloseButton={false}>
          <SheetTitle className="sr-only">Settings</SheetTitle>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {mobileView === "list" ? renderMobileList() : renderMobileSection()}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col overflow-hidden p-0 sm:max-w-[calc(100%-2rem)] md:h-[700px] md:max-h-[700px] md:max-w-[700px] lg:max-w-[900px]"
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">Manage your account settings.</DialogDescription>
        <SidebarProvider className="min-h-0! flex-1 items-start overflow-hidden">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {visibleNavItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton isActive={section === item.id} onClick={() => setSection(item.id)}>
                          <item.icon />
                          <span>{item.label}</span>
                          {item.id === "account" && accountHasWarning && (
                            <span className="ml-auto">
                              <SettingsItemIndicator title="Email is not verified" />
                            </span>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <div className="flex max-h-[700px] min-h-0 flex-1 flex-col overflow-y-auto">{renderDesktop()}</div>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}
