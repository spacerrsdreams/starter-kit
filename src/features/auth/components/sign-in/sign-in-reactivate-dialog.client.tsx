"use client"

import Link from "next/link"

import { WebRoutes } from "@/lib/web.routes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const texts = {
  reactivateTitle: "Reactivate Account",
  reactivateDescription: "Reactivate your account to continue.",
  reactivateForgotHint: "Forgot your password? Reset it here.",
  resetItHere: "Reset it here",
  thenSignInToReactivate: "Then sign in to reactivate.",
  reactivateNo: "No",
  reactivating: "Reactivating...",
  reactivateYes: "Yes",
}

interface SignInReactivateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isReactivateLoading: boolean
  reactivateError: string | null
  onConfirm: () => void
  onReactivateReset: () => void
}
export function SignInReactivateDialog({
  open,
  onOpenChange,
  isReactivateLoading,
  reactivateError,
  onConfirm,
  onReactivateReset,
}: SignInReactivateDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) onReactivateReset()
      }}
    >
      <AlertDialogContent>
        <AlertDialogTitle>{texts.reactivateTitle}</AlertDialogTitle>
        <AlertDialogDescription>{texts.reactivateDescription}</AlertDialogDescription>
        <p className="text-xs text-muted-foreground">
          {texts.reactivateForgotHint}{" "}
          <Link href={WebRoutes.resetPassword.path} className="text-primary underline underline-offset-2">
            {texts.resetItHere}
          </Link>
          {texts.thenSignInToReactivate}
        </p>
        {reactivateError && <p className="text-sm text-destructive">{reactivateError}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isReactivateLoading}>{texts.reactivateNo}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isReactivateLoading}
          >
            {isReactivateLoading ? texts.reactivating : texts.reactivateYes}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
