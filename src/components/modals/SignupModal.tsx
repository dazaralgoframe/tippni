// SignupModal.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Lock, Mail, User, Calendar, UserCircle2 } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { toast } from "sonner"
import OtpVerification from "./OtpVerification"
import { apiFetch } from "@/lib/api"

interface SignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SignupModal({ open, onOpenChange }: SignupModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showOtp, setShowOtp] = useState(false)

  // --- Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"
    if (!formData.dob) newErrors.dob = "Date of birth is required"
    if (!formData.gender) newErrors.gender = "Please select your gender"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- Input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  // --- Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)

    try {
      const data = await apiFetch<{ message: string }>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      toast.success(data?.message || "Signup successful!")
      setShowOtp(true)
    } catch (err: any) {
      toast.error(err.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out" />
      <DialogContent className="max-w border-0 bg-modal text-primary p-6 transition-colors duration-300">
        {!showOtp ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg font-semibold text-primary">
                  Create your account
                </DialogTitle>
              </div>
            </DialogHeader>

            <form onSubmit={handleSignup} className="space-y-4 mb-6">
              {/* Username */}
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10 h-11 rounded-md"
                  />
                </div>
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-11 rounded-md"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <div className="relative text-muted-foreground">
                  <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={cn("pl-10 h-11 rounded-md border-white")}
                  />
                </div>
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
              </div>

              {/* Gender */}
              <div className="">
                <div className="relative">
                  <UserCircle2 className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={cn(
                      "pl-10 pr-4 h-11 w-full rounded-md border border-input bg-background text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      "appearance-none cursor-pointer"
                    )}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 h-11 rounded-md"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 h-11 rounded-md"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Show password toggle */}
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-muted-foreground">Show password</span>
              </label>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-fit h-11 font-semibold flex bg-accent m-auto rounded-full"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </>
        ) : (
          <OtpVerification
            email={formData.email}
            onVerificationSuccess={() => {
              setShowOtp(false)
              onOpenChange(false)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
