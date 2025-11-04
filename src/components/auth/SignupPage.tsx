// SignupPage.tsx
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail} from "lucide-react"
import SignupModal from "../modals/SignupModal"
import SigninModal from "../modals/SigninModal"
import DarkLogo from "../../../public/images/tippniLogoLight.png";
import WhiteLogo from "../../../public/images/tippniLogoDark.png";
import Image from "next/image"
import { useTheme } from "next-themes"

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
 interface SignupPageProps {
    onSignup: boolean
    onSetSignup: (open: boolean) => void
 }

export default function SignupPage({onSignup, onSetSignup}: SignupPageProps) {
  const [signupModalOpen, setSignupModalOpen] = useState(false)
  const [signinModalOpen, setSigninModalOpen] = useState(false)
  const {theme} = useTheme()

  const handleOAuthSignup = (provider: string) => {
    console.log(`Signing up with ${provider}`)
    // Implement OAuth logic here
  }

  return (
    <>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-4 text-center">
                <div className="text-5xl font-bold text-primary mb-2 hidden">Tippni</div>
                <Image src={theme === "light" ? DarkLogo : WhiteLogo} alt='Logo' width={200} height={100} className="m-auto" />
                <h1 className="text-2xl font-bold text-muted-foreground">Join today</h1>
                </div>

                {/* OAuth Buttons */}
                <div className="space-y-3 mb-6">
                <Button
                    onClick={() => handleOAuthSignup("Google")}
                    variant="outline"
                    className="w-full rounded-full m-auto h-11 flex items-center justify-center gap-2 mb-2"
                >
                    <Chrome />
                    <span>Sign up with Google</span>
                </Button>
                <Button
                    onClick={() => handleOAuthSignup("Apple")}
                    variant="outline"
                    className="w-full rounded-full m-auto h-11 flex items-center justify-center gap-2"
                >
                    <Apple />
                    <span>Sign up with Apple</span>
                </Button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-background text-primary bg-modal w-[40px] h-[40px] flex justify-center items-center rounded-full">OR</span>
                </div>
                </div>
                <Button
                    onClick={() => setSignupModalOpen(true)}
                    variant="outline"
                    className="w-full rounded-full h-11 flex items-center justify-center gap-2 m-auto mb-2"
                >
                    <Mail className="w-5 h-5" />
                    <span>Sign up with Email</span>
                </Button>
                <p className="text-xs text-muted-foreground text-center mb-6">
                By signing up, you agree to our{" "}
                <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                </Link>
                </p>

                {/* Sign In Link */}
                <div className="text-center">
                <p>
                    Already have an account?
                    <Button
                    onClick={() => setSigninModalOpen(true)}
                    variant="outline"
                    className="w-fit rounded-full h-11 flex items-center justify-center gap-2 m-auto mt-2"
                >
                    <span>Sign in</span>
                </Button>
                </p>
                </div>
            </div>
        </div>
        <SignupModal open={signupModalOpen} onOpenChange={setSignupModalOpen} />
        <SigninModal open={signinModalOpen} onOpenChange={setSigninModalOpen} openSignup={signupModalOpen} onOpenChangeSignup={setSignupModalOpen} onSignup={onSignup} onSetSignup={onSetSignup} />
    </>
  )
}
