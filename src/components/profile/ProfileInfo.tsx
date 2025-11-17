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
  setShowConnections: (query: string) => void
}

export default function ProfileInfo({setShowConnections}: ProfileInfoProps) {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editOpen, setEditOpen] = useState(false)


  
  useEffect(() => {
    fetchProfile()
  }, [])
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/v1/profiles/me")
      setProfile(res.data.data || res.data)
      toast.success("✅ Profile loaded successfully!")
    } catch (error: any) {
      console.error("Error fetching profile:", error)
      toast.error(error.response?.data?.message || "Failed to fetch profile.")
    } finally {
      setLoading(false)
    }
  }
  // ✅ Handle avatar upload
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
    console.log('image FormData', file);
    
    try {
      setIsUploading(true)
      const res = await api.post("/api/v1/profiles/images/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      await fetchProfile()

      // ✅ Force reload avatar from server (cache-bust)
      setProfile((prev) =>
        prev
          ? { ...prev, avatarUrl: `${prev.avatarUrl}?t=${Date.now()}` }
          : prev
      )
    } catch (err: any) {
      console.error("Upload error:", err)
      toast.error(err.response?.data?.message || "Failed to upload image.")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleChangeBanner = async () => {
    toast.info("Edit profile modal coming soon…")
  }

  if (loading) {
    return (
      <div className="px-4 py-6 text-sm text-muted-foreground flex justify-center items-center">
        Loading profile...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="px-4 py-6 text-sm text-destructive">
        Failed to load profile.
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

            {/* Edit icon overlay */}
            <button
              onClick={handleAvatarEditClick}
              className="absolute bottom-2 right-2 p-1 bg-white rounded-full border border-border shadow-sm hover:bg-accent/10 transition"
              disabled={isUploading}
            >
              <Edit2
                className={`w-3 h-3 ${
                  isUploading ? "animate-pulse text-accent" : "text-accent"
                }`}
              />
            </button>

            {/* Hidden file input */}
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
            className="rounded-full bg-transparent self-end"
            onClick={() => setEditOpen(true)}
          >
            Edit Profile
          </Button>
        </div>

        {/* Name and Handle */}
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
            <div className="flex items-center gap-1">
              <Calendar className="size-4" aria-hidden />
              <span>Born at {profile.birthDate}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div>
            <span className="font-bold">0</span>
            <span className="text-muted-foreground ml-1">Post</span>
          </div>
          <button onClick={() => setShowConnections("followers")}>
            <span className="font-bold">{profile.followers}</span>
            <span className="text-muted-foreground ml-1">Followers</span>
          </button>
          <button onClick={() => setShowConnections("following")}>
            <span className="font-bold">{profile.followees}</span>
            <span className="text-muted-foreground ml-1">Following</span>
          </button>
        </div>
      </div>
      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        onProfileUpdated={fetchProfile}
      />
    </>
  )
}
