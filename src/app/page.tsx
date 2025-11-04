// home.tsx
"use client"
import AvatarsRow from "@/components/feed/AvatarRow";
import PostCard from "@/components/feed/PostCard";
import SearchBar from "@/components/feed/SearchBar";
import LeftSidebar from "@/components/LeftSidebar";
import ProfilePage from "@/components/profile/ProfilePage";
import RightSidebar from "@/components/RightSidebar";
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import SettingsPage from "@/components/settings/SettingsPage";
import { useState } from "react";
import SignupPage from "@/components/auth/SignupPage";
import ThemeToggle from "@/components/ThemeToggle";
import MobileBottomNav from "@/components/MobileBottomNav";
import HomePage from "@/components/homepage/HomePage";

export default function Home() {
  const activePage = useSelector((state: RootState) => state.page.activePage)
  const [signup, setSignup] = useState(false)
  return (
    <div className="min-h-dvh pb-20 lg:pb-0">
      <div className="mx-auto max-w-7xl">
        <div className="fixed bottom-18 right-5 z-99"><ThemeToggle /></div>
        {signup ?
          <>
            <SignupPage onSignup={signup} onSetSignup={setSignup} />
          </>
          :
          <>
            <HomePage />
          </>
        }
        
      </div>
    </div>
  )
}
