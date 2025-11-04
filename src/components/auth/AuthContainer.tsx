"use client"

import { useState } from "react"
import HomePage from "../homepage/HomePage"

type AuthStep = "login" | "register" | "otp" | "authenticated"

interface UserData {
  username: string
  email: string
  password: string
}

export default function AuthContainer() {
  const [authStep, setAuthStep] = useState<AuthStep>("login")
  const [userData, setUserData] = useState<UserData | null>(null)

  const handleLoginSuccess = () => {
    setAuthStep("authenticated")
  }

  const handleRegisterSubmit = (data: UserData) => {
    setUserData(data)
    setAuthStep("otp")
  }

  const handleOtpVerification = () => {
    setAuthStep("authenticated")
  }

  const handleSwitchToRegister = () => {
    setAuthStep("register")
  }

  const handleSwitchToLogin = () => {
    setAuthStep("login")
  }

  if (authStep === "authenticated") {
    return <HomePage />
  }

  return (
    <div>
      {authStep === "login" && (
        <LoginForm onLoginSuccess={handleLoginSuccess} onSwitchToRegister={handleSwitchToRegister} />
      )}
      {authStep === "register" && (
        <RegisterForm onRegisterSubmit={handleRegisterSubmit} onSwitchToLogin={handleSwitchToLogin} />
      )}
      {authStep === "otp" && userData && (
        <OtpVerification email={userData.email} onVerificationSuccess={handleOtpVerification} />
      )}
    </div>
  )
}
