//  src/components/profile/ProfileInfo.tsx
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/axios"
import { MapPin, LinkIcon, Calendar, Edit2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import EditProfileModal from "../modals/EditProfileModal"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Loader } from "../ui/loader"
import { useDispatch } from "react-redux"
import { fetchMyProfile } from "@/store/profileSlice"

interface Profile {
  id: string
  email: string
  username: string
  bio?: string
  location?: string
  website?: string
  birthDate?: string
  joinDate?: string
  followers?: number
  followees?: number
  avatarUrl?: string
  profileId?: string
}

interface ProfileInfoProps {
  setShowConnections: (v: "followers" | "following" | null) => void
}

export default function ProfileInfo({setShowConnections}: ProfileInfoProps) {
  const dispatch = useDispatch()
  const profile = useSelector((state: RootState) => state.profile.data)
  const { data: session, status } = useSession()
  // const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editOpen, setEditOpen] = useState(false)


  

  const handleAvatarEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
  
    if (file.size > 1024 * 1024) {
      toast.error("File must be smaller than 1MB")
      e.target.value = ""
      return
    }
  
    const formData = new FormData()
    formData.append("file", file)
  
    try {
      setIsUploading(true)
  
      await api.post("/api/v1/profiles/images/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
  
      toast.success("Avatar updated!")
  
      // 🔥 refresh redux profile
      setTimeout(() => {
        dispatch(fetchMyProfile() as any)
      }, 200)
  
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to upload avatar.")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }
  

  const handleChangeBanner = async () => {
    toast.info("Edit profile modal coming soon…")
  }

  if (!profile) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground">
        <Loader />
      </div>
    )
  }
  console.log('profile - profileInfo', profile);
  
  return (
    <>
      <div className="px-4 py-4">
        {/* Avatar + Edit */}
        <div className="flex items-start justify-between -mt-20 mb-4">
          <div className="relative">
            <Avatar className="size-32 border-3 border-background">
              <AvatarImage
                src={profile.avatarUrl || "/images/tippniLogo.jpg"}
                alt={profile.username}
              />
              <AvatarFallback>{profile.username || "U"}</AvatarFallback>
            </Avatar>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                <Loader width={30} height={30} />
              </div>
            )}
            <Button
              onClick={handleAvatarEditClick}
              className="absolute bottom-2 right-2 w-7 h-7 p-1 bg-white rounded-full border border-border shadow-sm hover:bg-accent/10 transition cursor-pointer"
              disabled={isUploading}
            >
              <Edit2
                className={`w-1 h-1 ${
                  isUploading ? "animate-pulse text-accent" : "text-accent"
                }`}
              />
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <Button
            variant="outline"
            className="rounded-full bg-transparent self-end cursor-pointer"
            onClick={() => setEditOpen(true)}
          >
            Edit Profile
          </Button>
        </div>

        <div className="mb-2">
          <h1 className="text-2xl font-bold capitalize">{profile.username}</h1>
          <p className="text-muted-foreground hidden">@{profile.username}</p>
        </div>

        {profile.bio && (
          <p className="text-sm mb-4 leading-relaxed">{profile.bio}</p>
        )}

        {/* Info */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-4" aria-hidden />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="size-4" aria-hidden />
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {profile.website}
              </a>
            </div>
          )}
          {profile.birthDate && (
            <div className="flex items-center gap-1 hidden">
              <Calendar className="size-4" aria-hidden />
              <span>Born at {profile.birthDate}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div className="hidden">
            <span className="font-bold">0</span>
            <span className="text-muted-foreground ml-1">Post</span>
          </div>
          <button onClick={() => setShowConnections("followers")} className="hover:underline cursor-pointer">
            <span className="font-bold">{profile.followers}</span>
            <span className="text-muted-foreground ml-1">Followers</span>
          </button>
          <button onClick={() => setShowConnections("following")} className="hover:underline cursor-pointer">
            <span className="font-bold">{profile.followees}</span>
            <span className="text-muted-foreground ml-1">Following</span>
          </button>
        </div>
      </div>
      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        // onProfileUpdated={fetchProfile}
      />
    </>
  )
}
