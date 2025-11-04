"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle } from "lucide-react"
import { useState } from "react"

interface DeleteAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const confirmationRequired = "DELETE MY ACCOUNT"

  const handleDelete = async () => {
    if (confirmText !== confirmationRequired) return

    setIsDeleting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsDeleting(false)
    onOpenChange(false)
    setConfirmText("")
    alert("Your account has been permanently deleted. All your data has been removed.")
  }

  const isConfirmed = confirmText === confirmationRequired

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-0 bg-modal text-primary p-6 transition-colors duration-300">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5 text-red-600 dark:text-red-400" aria-hidden />
            <DialogTitle className="text-lg font-semibold text-red-600 dark:text-red-400">
              Delete Account Permanently?
            </DialogTitle>
          </div>

          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <div className="font-semibold text-primary">
              This action cannot be undone. Your account will be permanently deleted.
            </div>

            <p>
              Once you delete your account, there is no going back. Please be absolutely certain before proceeding.
            </p>

            <div className="font-medium text-primary">What will be deleted:</div>
            <ul className="space-y-1 list-disc list-inside text-primary">
              <li>Your profile and all profile information</li>
              <li>All your posts and media</li>
              <li>All your messages and conversations</li>
              <li>Your followers and following list</li>
              <li>All account activity and history</li>
            </ul>

            <div className="mt-4">
              To confirm, type{" "}
              <span className="font-mono font-semibold text-primary">{confirmationRequired}</span> below:
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          <Input
            placeholder={`Type "${confirmationRequired}" to confirm`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isDeleting}
            className="font-mono border-border bg-transparent text-primary placeholder:text-secondary focus-visible:ring-0"
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-transparent text-primary border-border hover:bg-secondary/30 transition"
              onClick={() => {
                onOpenChange(false)
                setConfirmText("")
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
