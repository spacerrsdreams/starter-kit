"use client"

import { Check, SparklesIcon } from "lucide-react"

import type { PlanPickerDialogProps } from "@/features/billing/types/plan-picker-dialog.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const MONTHLY_PLAN_FEATURES = [
  "Unlimited chat sessions",
  "Priority response speed",
  "Early access to new tools",
]

const YEARLY_PLAN_FEATURES = [
  "Everything in Pro Monthly",
  "2 months free compared to monthly",
  "Smoother annual budgeting",
]

export function PlanPickerDialog({ open, onOpenChange, isBillingLoading, onSelectInterval }: PlanPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-dvh max-h-dvh w-screen max-w-[100vw] gap-0 rounded-none border-none bg-background p-0 sm:max-w-[100vw]">
        <div className="flex h-full flex-col">
          <DialogHeader className="border-b px-6 py-5 sm:px-8">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full bg-primary/10 px-2.5 text-primary">
                Pricing
              </Badge>
              <Badge variant="outline" className="rounded-full">
                Secure checkout
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription className="max-w-2xl text-sm sm:text-base">
              Choose the plan that fits your workflow. Billing is handled by Stripe and you can manage or cancel at
              any time.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border bg-card p-5">
                <p className="text-xl font-semibold">Free</p>
                <p className="mt-2 text-3xl font-semibold">$0</p>
                <p className="text-sm text-muted-foreground">Current access level</p>
                <div className="mt-4 rounded-xl border border-dashed bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  Your current plan
                </div>
                <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0" />
                    Basic chat and dashboard access
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0" />
                    Standard response speed
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border bg-card p-5 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xl font-semibold">Pro Monthly</p>
                  <Badge variant="outline" className="rounded-full">
                    Flexible
                  </Badge>
                </div>
                <p className="mt-2 text-3xl font-semibold">
                  Pro <span className="text-base font-medium text-muted-foreground">/ month</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Best for trying Pro with monthly flexibility.</p>
                <Button
                  type="button"
                  className="mt-4 w-full"
                  disabled={isBillingLoading}
                  onClick={() => onSelectInterval("monthly")}
                >
                  {isBillingLoading ? "Opening..." : "Upgrade to Monthly"}
                </Button>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {MONTHLY_PLAN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/35 bg-primary/5 p-5 shadow-sm">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-xl font-semibold">Pro Yearly</p>
                  <Badge className="rounded-full bg-primary text-primary-foreground">
                    <SparklesIcon className="mr-1 size-3.5" />
                    Best value
                  </Badge>
                </div>
                <p className="mt-2 text-3xl font-semibold">
                  Pro <span className="text-base font-medium text-muted-foreground">/ year</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Save more and lock in lower annual cost.</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full border-primary/40 bg-background hover:bg-primary/10"
                  disabled={isBillingLoading}
                  onClick={() => onSelectInterval("yearly")}
                >
                  {isBillingLoading ? "Opening..." : "Upgrade to Yearly"}
                </Button>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {YEARLY_PLAN_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
