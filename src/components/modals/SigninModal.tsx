// SigninModal.tsx
"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, Lock, Mail, User, UserCircle2 } from "lucide-react"
import { useState } from "react"
import { DialogOverlay } from "@radix-ui/react-dialog"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"
import ForgotPasswordModal from "../settings/ForgotPasswordModal"
import { toast } from "sonner"
import { api } from "@/lib/axios"

interface SigninModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  openSignup: boolean
  onOpenChangeSignup: (open: boolean) => void
  onSignup: boolean
  onSetSignup: (open: boolean) => void
}

const Chrome = () => (
  <>
      <svg width='48' version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" >
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
      </svg>
  </>
)
const Apple = () => (
  <>
      <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '22px', height: '22px'}}>
          <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"></path> 
      </svg>
  </>
)
export default function SigninModal({ open, onOpenChange, openSignup, onOpenChangeSignup, onSignup, onSetSignup }: SigninModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSignin = async (e: React.FormEvent) => {
    
    
    e.preventDefault()
    if (!validateForm()) {
      console.log('validation error', errors);
      return
    }
    console.log('loggedin');
    setIsLoading(true)
    try {
      console.log("🔐 Signing in with:", formData)
    
      // ✅ Send credentials to backend API
      const res = await api.post("/api/v1/auth/authenticate", {
        email: formData.email,
        password: formData.password,
      })
    
      console.log("✅ Signin success:", res.data)
      toast.success("✅ Signed in successfully!")
    
      // ✅ Close modal and show main feed
      onSetSignup(false)
      onOpenChange(false)
    } catch (err: any) {
      console.error("❌ Signin failed:", err)
    
      // ✅ Safely extract backend message
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password."
    
      setErrors({ submit: message })
      toast.error(`❌ ${message}`)
    } finally {
      setIsLoading(false)
    }
  }
  const handleOAuthSignin = (provider: string) => {
    console.log(`Signing up with ${provider}`)
    toast.warning('Still in work Login Loading for Auth')
    // Implement OAuth logic here
  }
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <DialogContent className="max-w border-0 bg-modal text-primary p-6 transition-colors duration-300">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="text-lg font-semibold text-primary">
                Signin to your account
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-3">
            <Button
                onClick={() => handleOAuthSignin("Google")}
                variant="outline"
                className="w-full rounded-full m-auto h-11 flex items-center justify-center gap-2 mb-2"
            >
                <Chrome />
                <span>Sign in with Google</span>
            </Button>
            <Button
                onClick={() => handleOAuthSignin("Apple")}
                variant="outline"
                className="w-full rounded-full m-auto h-11 flex items-center justify-center gap-2"
            >
                <Apple />
                <span>Sign in with Apple</span>
            </Button>
            </div>

            {/* Divider */}
            <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-primary bg-modal w-[40px] h-[40px] flex justify-center items-center rounded-full">OR</span>
            </div>
            </div>
          <form onSubmit={handleSignin} className="space-y-4 mb-6">
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
            <div className="flex justify-between">
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
                    onClick={() => setForgotPasswordOpen(true)}
                    variant="link"
                    className="w-fit rounded-full h-3 text-accent px-2 cursor-pointer"
                    size="sm"
                >
                    <span>Forgot Password</span>
              </Button>
            </div>

            {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
            <DialogFooter>
            <Button
              // onClick={()=> onSetSignup(false)}
              type="submit"
              disabled={isLoading}
              className="w-50 h-11 font-semibold flex bg-accent m-auto rounded-full"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
            </DialogFooter>
            
            <div className="text-center flex justify-center items-center">
              <div className="text-sm text-primary">
                  Don't have an account?
              </div>
              <Button
                  onClick={() => {onOpenChange(false), onOpenChangeSignup(true)}}
                  variant="link"
                  className="w-fit rounded-full h-11 text-accent px-2 cursor-pointer"
                  size="sm"
              >
                  <span>Signup</span>
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ForgotPasswordModal open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen} />
    </>
  )
}
