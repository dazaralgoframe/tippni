"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { DialogOverlay } from "@radix-ui/react-dialog"

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ForgotPasswordModal({ open, onOpenChange }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<"email" | "verify" | "reset">("email")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 8 || password.length > 16) errors.push("Password must be 8-16 characters")
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter")
    if (!/[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(password)) errors.push("At least one symbol (!@#$%^&*)")
    if (!/[0-9]/.test(password)) errors.push("At least one number")
    return errors
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email) return setError("Email is required")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address")

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStep("verify")
    } catch {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!verificationCode) return setError("Verification code is required")
    if (verificationCode.length !== 6) return setError("Verification code must be 6 digits")

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStep("reset")
    } catch {
      setError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!newPassword) return setError("New password is required")

    const passwordErrors = validatePassword(newPassword)
    if (passwordErrors.length > 0) return setError(`New password must have: ${passwordErrors.join(", ")}`)
    if (newPassword !== confirmPassword) return setError("Passwords do not match")

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setTimeout(() => {
        onOpenChange(false)
        setStep("email")
        setEmail("")
        setVerificationCode("")
        setNewPassword("")
        setConfirmPassword("")
        setSuccess(false)
      }, 2000)
    } catch {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordValidationRules = validatePassword(newPassword)
  const isNewPasswordValid = newPassword && passwordValidationRules.length === 0

  const handleBack = () => {
    if (step === "verify") setStep("email")
    else if (step === "reset") setStep("verify")
    setError("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogContent className="sm:max-w-md bg-modal border border-border text-foreground transition-all duration-300">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== "email" && (
              <button
                onClick={handleBack}
                className="p-1 rounded-full hover:bg-secondary transition"
                aria-label="Go back"
              >
                <ArrowLeft className="size-4 text-muted-foreground" />
              </button>
            )}
            <div>
              <DialogTitle className="text-primary">Forgot Password</DialogTitle>
              <DialogDescription className="text-muted-foreground mt-1 text-xs">
                {step === "email" && "Enter your email to reset your password"}
                {step === "verify" && "Enter the verification code sent to your email"}
                {step === "reset" && "Create a new password"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Step 1 — Email */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-accent text-white" disabled={isLoading || !email}>
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 2 — Verification */}
        {step === "verify" && (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-muted-foreground">
                Verification Code
              </label>
              <p className="text-xs text-muted-foreground">We sent a 6-digit code to {email}</p>
              <Input
                id="code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-lg tracking-widest"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-accent text-white" disabled={isLoading || verificationCode.length !== 6}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3 — Reset Password */}
        {step === "reset" && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium text-muted-foreground">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>

              {/* Password Validation */}
              {newPassword && (
                <div className="mt-3 space-y-2 text-sm">
                  <p className="font-medium text-muted-foreground">Password requirements:</p>
                  <div className="space-y-1">
                    {[
                      { valid: newPassword.length >= 8 && newPassword.length <= 16, text: "8–16 characters" },
                      { valid: /[A-Z]/.test(newPassword), text: "One uppercase letter" },
                      { valid: /[0-9]/.test(newPassword), text: "One number" },
                      { valid: /[!@#$%^&*()_+\-=[\]{};':\"\\|,.<>/?]/.test(newPassword), text: "One symbol (!@#$%^&*)" },
                    ].map((rule, i) => (
                      <div key={i} className={`flex items-center gap-2 ${rule.valid ? "text-green-600" : "text-muted-foreground"}`}>
                        {rule.valid ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
                        <span>{rule.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-muted-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-600 dark:text-green-400">Password reset successfully!</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleBack} className="flex-1" disabled={isLoading}>
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-accent text-white" disabled={isLoading || !isNewPasswordValid || !confirmPassword}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
