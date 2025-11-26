// src/components/profile/ProfilePage.tsx
"use client"

import ProfileHeader from "./ProfileHeader"
import ProfileInfo from "./ProfileInfo"
import ProfileTabs from "./ProfileTabs"
import ProfilePosts from "./ProfilePosts"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { Loader } from "../ui/loader"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"
import { Edit2 } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import ProfileConnections from "./ProfileConnections"
import { fetchMyProfile } from "@/store/profileSlice"
import { Button } from "../ui/button"

export default function ProfilePage() {
  const dispatch = useDispatch()
  
  // Redux state
  const { data: myProfile, selectedUser, loading } = useSelector(
    (state: RootState) => state.profile
  )

  console.log('search result selectedUser => ', selectedUser);
  
  // Decide which profile to show
  const profile = selectedUser || myProfile
  const isOwnProfile = profile?.username === myProfile?.username

  const [activeTab, setActiveTab] = useState("posts")
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [showConnections, setShowConnections] = useState<null | "followers" | "following">(null)
  const fileInputRefBanner = useRef<HTMLInputElement>(null)

  // Load profile from API using Redux
  useEffect(() => {
    if (!selectedUser) {
      dispatch(fetchMyProfile() as any)
    }
  }, [selectedUser])

  // Banner upload
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
      await api.post("/api/v1/profiles/images/banner", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast.success("Banner updated!")
      dispatch(fetchMyProfile() as any)  // 🔥 Refresh Redux profile
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload banner.")
    } finally {
      setIsUploadingBanner(false)
      e.target.value = ""
    }
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    )
  }
  console.log('search result profile => ', profile);
  
  return (
    <main className="col-span-12 lg:col-span-6">
      {showConnections ? (
        <ProfileConnections
          type={showConnections}
          username={profile.username}
          onBack={() => setShowConnections(null)}
          profileId={profile.profileId}
        />
      ) : (
        <>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
            <ProfileHeader username={profile.username} />
          </div>

          {/* Banner */}
          <div className="h-48 bg-accent relative">
            <Avatar className="w-full h-full object-cover">
              <AvatarImage src={profile.bannerUrl} alt={profile.username} />
              <AvatarFallback>No Banner</AvatarFallback>
            </Avatar>
            {isUploadingBanner && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                <Loader width={30} height={30} />
              </div>
            )}
            {isOwnProfile &&
              <Button
              onClick={() => fileInputRefBanner.current?.click()}
              disabled={isUploadingBanner}
              className="absolute bottom-3 right-3 p-2 bg-white text-accent rounded-full border border-border shadow-sm cursor-pointer"
              >
                <Edit2 className={`w-4 h-4 ${isUploadingBanner ? "animate-pulse" : ""}`} />
              </Button>
            }

            <input
              ref={fileInputRefBanner}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
            />
          </div>

          {/* Profile Info */}
          <ProfileInfo setShowConnections={setShowConnections} />

          {/* Tabs */}
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Posts */}
          <ProfilePosts tab={activeTab} profileId={profile.profileId!} />
        </>
      )}

    </main>
  )
}
