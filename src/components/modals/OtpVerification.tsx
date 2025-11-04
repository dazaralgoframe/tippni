// OtpVerification.tsx
"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"  // ✅ Import the common API helper
import Image from "next/image"
import WhiteLogo from "../../../public/images/tippniLogoDark.png";
import DarkLogo from "../../../public/images/tippniLogoLight.png";
import { useTheme } from "next-themes"
import { toast } from "sonner"

interface OtpVerificationProps {
  email: string
  onVerificationSuccess: () => void
}

export default function OtpVerification({ email, onVerificationSuccess }: OtpVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResendDisabled, setIsResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [otpVal, setOtpVal] = useState('')
  const {theme} = useTheme()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isResendDisabled && resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((t) => t - 1), 1000)
    } else if (resendTimer === 0 && isResendDisabled) {
      setIsResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [isResendDisabled, resendTimer])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      console.log("Activating account with:", { email, otp: otpString })
    
      const res = await apiFetch(`/api/v1/auth/activate?activationCode=${otpString}`, {
        method: "POST",
      })
    
      console.log("Activation success:", res)
      toast.success("✅ Account activated successfully!, please login")
    
      onVerificationSuccess()
    } catch (err: any) {
      console.error("Activation failed:", err)
      const message = err.message || "Invalid OTP. Please try again."
      setError(message)
      toast.error(`❌ ${message}`)
    } finally {
      setIsSubmitting(false)
      console.log("Activation request completed.")
    }
  }

  const handleResendOtp = async () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    setIsResendDisabled(true)
    setResendTimer(60)
    toast.warning('API not provided yet')
    // try {
    //   await apiFetch("/api/v1/auth/resend-otp", {
    //     method: "POST",
    //     body: JSON.stringify({ email }),
    //   })
    // } catch (err: any) {
    //   setError(err.message || "Failed to resend OTP.")
    // }
  }

  return (
    <>
      <div className="text-center">
        <div className="inline-flex items-center justify-center hidden">
          <Image src={theme === 'light' ? DarkLogo : WhiteLogo} width={150} height={100} alt='Logo' />
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-center">Verify your email</h1>
        <p className="text-muted-foreground text-center mt-2 text-sm">
          We sent a 6-digit code to <span className="text-accent">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-12 h-12 text-center text-2xl font-bold rounded-lg border-2 bg-background focus:outline-none transition ${
                  error
                    ? "border-destructive focus:ring-2 focus:ring-destructive"
                    : "border-muted-foreground/30 focus:border-primary focus:ring-2 focus:ring-primary"
                }`}
              />
            ))}
          </div>
        {error && <p className="text-red-600 text-sm font-bold text-center text-warning">{error}</p>}

        <Button type="submit" className="w-fit m-auto bg-accent flex" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
      </form>

      <div className="text-center mt-2">
        <p className="text-muted-foreground text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={`font-semibold ${
              isResendDisabled ? "text-muted-foreground cursor-not-allowed" : "text-primary hover:underline"
            }`}
          >
            {isResendDisabled ? `Resend in ${resendTimer}s` : "Resend"}
          </button>
        </p>
      </div>
    </>
  )
}
