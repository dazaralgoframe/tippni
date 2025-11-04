
// homePage.tsx
"use client"

import { useSelector } from "react-redux"
import LeftSidebar from "../LeftSidebar"
import { RootState } from "@/store"
import { useState } from "react"
import SearchBar from "../feed/SearchBar"
import AvatarsRow from "../feed/AvatarRow"
import PostCard from "../feed/PostCard"
import ProfilePage from "../profile/ProfilePage"
import SettingsPage from "../settings/SettingsPage"
import RightSidebar from "../RightSidebar"
import MobileBottomNav from "../MobileBottomNav"

export default function HomePage() {
    const activePage = useSelector((state: RootState) => state.page.activePage)
    const [signup, setSignup] = useState(true)

  return (
    <>
        <div className="grid grid-cols-12 gap-6 px-4 py-4">
        {/* Left Sidebar */}
            <aside className="sticky top-0 h-screen hidden md:block col-span-3 ">
            <LeftSidebar onSetSignup={setSignup} />
            </aside>

            {/* Feed */}
            <main className="col-span-12 md:col-span-6">
            <div className="">
            {/* <div className="sticky top-0 z-10 backdrop-blur"> */}
                <div className="py-3">
                <SearchBar />
                <div className="mt-3"><AvatarsRow /></div>
                </div>
            </div>
            <>
                {activePage === "home" && 
                <div className="py-4 space-y-6">
                    <PostCard
                    username="Alex Johnson"
                    handle="@alexj"
                    text="Just shipped a new design system update. Loving the consistency it brings!"
                    imageSrc="/images/webDeveloper.png"
                    />
                    <PostCard
                    username="Taylor Smith"
                    handle="@taywrites"
                    text="Writing is thinking. Draft often, publish when ready."
                    imageSrc="/images/minimal-desk-notebook.jpg"
                    />
                    <PostCard
                    username="Dev Collective"
                    handle="@devco"
                    text="Tip: Prefer semantic tokens over hard-coded colors for easier theming."
                    imageSrc="/images/design-system-presentation.png"
                    />
                </div>
                }
                {activePage === "profile" && <ProfilePage />}
                {activePage === "foryou" && <div>For You content here</div>}
                {activePage === "notification" && <div>Notifications here</div>}
                {activePage === "bookmarks" && <div>Bookmarks here</div>}
                {activePage === "settings" && <SettingsPage />}
            </>
            </main>

            {/* Right Sidebar */}
            <aside className="sticky top-0 h-screen hidden lg:block col-span-3">
            <RightSidebar />
            </aside>
        </div>
        <MobileBottomNav />
    </>
  )
}
