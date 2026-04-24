"use client"

import { Route } from "next"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"

import { WebRoutes } from "@/lib/web.routes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type BillingDialogState = "success" | "failed" | null

function getBillingDialogState(value: string | null): BillingDialogState {
  if (value === "success") {
    return "success"
  }

  if (value === "failed" || value === "cancelled") {
    return "failed"
  }

  return null
}

export function BillingCheckoutStatusDialog() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(true)

  const status = useMemo(() => getBillingDialogState(searchParams.get("billing")), [searchParams])
  const isVisible = open && status !== null

  const closeDialog = () => {
    setOpen(false)
    router.replace(pathname as Route)
  }

  const goToPricing = () => {
    router.push(WebRoutes.pricing.path)
  }

  if (!status) {
    return null
  }

  const isSuccess = status === "success"
  const title = isSuccess ? "Billing successful" : "Billing failed"
  const description = isSuccess
    ? "Your subscription is active now."
    : "We couldn't complete your billing action. You can retry from the pricing page."

  return (
    <Dialog open={isVisible} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {!isSuccess ? <Button onClick={goToPricing}>Retry</Button> : null}
          <Button variant="outline" onClick={closeDialog}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
