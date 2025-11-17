// src/components/profile/ProfilePage.tsx
"use client"
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileTabs from "./ProfileTabs";
import ProfilePosts from "./ProfilePosts";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSession } from "next-auth/react";
import { Loader } from "../ui/loader";
import { Edit2 } from "lucide-react";
import ProfileConnections from "./ProfileConnections";

interface Profile {
  id: string
  name: string
  username: string
  bio?: string
  location?: string
  website?: string
  joinedDate?: string
  followersCount?: number
  followingCount?: number
  avatarUrl?: string
  bannerUrl?: string
  profileId?: string
}

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const [activeTab, setActiveTab] = useState("posts")
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isUploadingBanner, setIsUploadingBanner] = useState(false)
    const fileInputRefBanner = useRef<HTMLInputElement>(null)
    const [showConnections, setShowConnections] = useState<null | "followers" | "following">(null)


    const fetchProfile = async () => {
      try {
        if (status === "loading") return

        const token = session?.user?.token
        
        if (!token) {
          toast.error("No session token found. Please sign in again.")
          return
        }
        
        // ✅ Fetch user profile
        const res = await api.get("/api/v1/profiles/me")
        console.log('res profile=>', res);
        
        setProfile(res.data.data || res.data)
        toast.success("✅ Profile loaded successfully!")
      } catch (error:any) {
        console.error("Error fetching profile:", error)
        toast.error(error.response?.data?.message || "Failed to fetch profile.")
      } finally {
        setLoading(false)
      }
    }
    useEffect(() => {
      fetchProfile()
    }, [])
    const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
    
      if (file.size > 1024 * 1024) {
        toast.error("Banner must be smaller than 1MB")
        e.target.value = ""
        return
      }
    
      const formData = new FormData()
      formData.append("file", file)
    
      try {
        setIsUploadingBanner(true)
        const res = await api.post("/api/v1/profiles/images/banner", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        toast.success("✅ Banner updated successfully!")
        await fetchProfile()
      } catch (err: any) {
        console.error("Banner upload error:", err)
        toast.error(err.response?.data?.message || "Failed to upload banner.")
      } finally {
        setIsUploadingBanner(false)
        e.target.value = ""
      }
    }
    if (loading) {
      return <div className="min-h-screen flex justify-center -m-30 items-center"><Loader /></div>
    }
  
    if (!profile) {
      return <div className="px-4 py-6 text-sm text-destructive flex justify-center items-center">Failed to load profile.</div>
    }
    console.log('profile', profile);
    
    return(
      <main className="col-span-12 lg:col-span-6">
          {showConnections ? (
            <ProfileConnections
              type={showConnections}
              username={profile?.username || ''}
              onBack={() => setShowConnections(null)}
              profileId={profile?.profileId || ''}
            />
          ) : (
            <>
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <ProfileHeader username={profile?.username || ''} />
          </div>
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden hidden">
                <Image width={100} height={100} src="/images/twitter-profile-cover.jpg" alt="Profile cover" className="w-full h-full object-cover" />
              </div>
              <div className="h-48 bg-gradient-to-r bg-accent overflow-hidden relative">
                <Avatar className="w-full h-full object-cover">
                  <AvatarImage src={profile?.bannerUrl} alt={profile?.username} />
                  <AvatarFallback>{"No Banner"}</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRefBanner.current?.click()}
                  className="absolute bottom-3 right-3 p-2 bg-white rounded-full border border-border shadow-sm hover:bg-accent/10 transition cursor-pointer"
                  disabled={isUploadingBanner}
                >
                  <Edit2
                    className={`w-4 h-4 ${
                      isUploadingBanner ? "animate-pulse text-accent" : "text-accent"
                    }`}
                  />
                </button>
                <input
                  ref={fileInputRefBanner}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </div>
              <ProfileInfo setShowConnections={setShowConnections} />
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <ProfilePosts tab={activeTab} />
            </>
          )}
          
        </main>
    )
}