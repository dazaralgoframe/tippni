
// /src/components/homepage/HomePage.tsx
"use client"

import { useSelector } from "react-redux"
import LeftSidebar from "../LeftSidebar"
import { RootState } from "@/store"
import { useEffect, useState } from "react"
import SearchBar from "../feed/SearchBar"
import AvatarsRow from "../feed/AvatarRow"
import PostCard from "../feed/PostCard"
import ProfilePage from "../profile/ProfilePage"
import SettingsPage from "../settings/SettingsPage"
import RightSidebar from "../RightSidebar"
import MobileBottomNav from "../MobileBottomNav"
import { api } from "@/lib/axios"

const POST = [
    {
        id: 1,
        username:"Alex Johnson",
        handle:"alexj",
        text:"Just shipped a new design system update. Loving the consistency it brings! Just shipped a new design system update. Loving the consistency it brings! Just shipped a new design system update. Loving the consistency it brings! Just shipped a new design system update. Loving the consistency it brings! Just shipped a new design system update. Loving the consistency it brings!",
        imageUrl:"/images/webDeveloper.png"
    },
    {
        id: 2,
        username:"Dev Collective",
        handle:"devco",
        text:"Tip: Prefer semantic tokens over hard-coded colors for easier theming.",
        imageUrl:"/images/design-system-presentation.png"
    }
]

export default function HomePage() {
    const activePage = useSelector((state: RootState) => state.page.activePage)
    const [signup, setSignup] = useState(true)
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function fetchContent() {
          try {
            const res = await api.get(`/api/v1/timeline/home`)
    
            console.log("API Response:", res.data.length)
            console.log("API Response:", res.data)
            if(res.data && res.data.length >= 1){
                setPosts(res.data)
            } else {
                setPosts(POST)
            }
          } catch (err) {
            console.error("Fetch posts error:", err)
          } finally {
            setLoading(false)
          }
        }
        // setPosts(POST)
        fetchContent()
      }, [])
  return (
    <>
        <div className="grid grid-cols-12 gap-6 px-4 py-4">
            <aside className="sticky top-0 h-screen hidden md:block col-span-3 ">
            <LeftSidebar onSetSignup={setSignup} />
            </aside>
            <main className="col-span-12 md:col-span-6">
                <div className="">
                {/* <div className="sticky top-0 z-10 backdrop-blur"> */}
                    <div className="py-3">
                        <SearchBar />
                        <div className="mt-3 hidden"><AvatarsRow /></div>
                    </div>
                </div>
                {activePage === "home" && (
                    <div className="py-4 space-y-6">
                        {loading && <div>Loading posts...</div>}

                        {!loading && posts.length === 0 && (
                        <div>No posts available</div>
                        )}

                        {!loading && posts.map((post) => (
                        <PostCard
                            key={post.id}
                            username={post.profile?.username}
                            handle={`@${post.profile?.username}`}
                            text={post.text}
                            avatarUrl={post.profile?.avatarUrl}
                            imageSrc={post.mediaUrls?.[0]}
                        />
                        ))}
                    </div>
                )}
                {activePage === "profile" && <ProfilePage />}
                {activePage === "foryou" && <div>For You content here</div>}
                {activePage === "notification" && <div>Notifications here</div>}
                {activePage === "bookmarks" && <div>Bookmarks here</div>}
                {activePage === "settings" && <SettingsPage />}
            </main>
            <aside className="sticky top-0 h-screen hidden lg:block col-span-3">
            <RightSidebar />
            </aside>
        </div>
        <MobileBottomNav />
    </>
  )
}
