// /src/app/page.tsx
"use client"
import { useSession } from "next-auth/react"
import ThemeToggle from "@/components/ThemeToggle";
import HomePage from "@/components/homepage/HomePage";
import AuthContainer from "@/components/auth/AuthContainer";
import { Loader } from "@/components/ui/loader";
import LanguageSwitch, { LanguageSelect } from "@/components/languageSelector/LanguageSwitch";

export default function Home() {
  const { data: session, status } = useSession()
  if (status === "loading") return <div className="min-h-dvh pb-20 lg:pb-0 flex justify-center items-center"><Loader /></div>
  return (
    <div className="min-h-dvh pb-20 lg:pb-0">
      <div className="fixed bottom-18 right-5 z-99"><ThemeToggle /></div>
      <div className="fixed top-10 right-5 z-99"><LanguageSwitch /></div>
      {session?.user ? <HomePage /> : <AuthContainer />}
    </div>
  )
}
