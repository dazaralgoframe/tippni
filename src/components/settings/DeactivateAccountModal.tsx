"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import { DialogOverlay } from "@radix-ui/react-dialog"

interface DeactivateAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeactivateAccountModal({ open, onOpenChange }: DeactivateAccountModalProps) {
  const [isDeactivating, setIsDeactivating] = useState(false)

  const handleDeactivate = async () => {
    setIsDeactivating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDeactivating(false)
    onOpenChange(false)
    alert("Your account has been deactivated. You can reactivate it by logging in within 30 days.")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <DialogContent className="max-w-md border-0 bg-modal text-primary p-6 transition-colors duration-300">
            <DialogHeader>
            <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-red-500 dark:text-red-400" aria-hidden />
                <DialogTitle className="text-lg font-semibold text-primary">Deactivate Account?</DialogTitle>
            </div>

            <div className="mt-4 space-y-3 text-nuted-foreground text-sm leading-relaxed">
                <p>
                This will deactivate your account. You can reactivate it by logging in within 30 days. After 30 days, your
                account and all associated data will be permanently deleted.
                </p>

                <div className="font-medium text-primary">What happens when you deactivate:</div>
                <ul className="space-y-1 list-disc list-inside">
                <li>Your profile will not be visible to other users</li>
                <li>Your posts will be hidden</li>
                <li>You cannot send or receive messages</li>
                <li>Your username will be available for others to use</li>
                </ul>
            </div>
            </DialogHeader>

            <div className="flex gap-3 mt-6">
            <Button
                variant="outline"
                className="flex-1 bg-transparent text-primary border-border hover:bg-secondary/30 transition"
                onClick={() => onOpenChange(false)}
                disabled={isDeactivating}
            >
                Cancel
            </Button>
            <Button
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                onClick={handleDeactivate}
                disabled={isDeactivating}
            >
                {isDeactivating ? "Deactivating..." : "Deactivate"}
            </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}
