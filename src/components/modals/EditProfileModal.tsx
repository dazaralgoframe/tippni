// src/components/modals/EditProfileModal.tsx

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Globe, MapPin, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import { useDispatch } from "react-redux"
import { fetchMyProfile } from "@/store/profileSlice"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: {
    id: string
    username: string
    email: string
    bio?: string
    location?: string
    website?: string
    birthDate?: string
    profileId?: string
  } | null
}

export default function EditProfileModal({ open, onOpenChange, profile }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    location: "",
    website: "",
    birthDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const profileID = profile?.profileId
  console.log('profileID', profileID);
  console.log('profile edit profile', profile);
  
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        birthDate: profile.birthDate || "",
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await api.patch(`/api/v1/profiles/${profileID}`, formData)
      toast.success("✅ Profile updated successfully!")
      console.log('res edit profile', res.data);
      // onProfileUpdated()
      dispatch(fetchMyProfile() as any)
      onOpenChange(false)
    } catch (err: any) {
      console.error("Profile update failed:", err)
      toast.error(err.response?.data?.message || "Failed to update profile.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      <DialogContent className="max-w-lg border-0 bg-modal text-primary p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-center">
            Edit Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Username (readonly) */}
          {/* Email (readonly) */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              name="email"
              value={profile?.email || ""}
              disabled
              className="pl-10 h-11 bg-muted/40 text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              name="username"
              value={formData?.username}
              placeholder="Enter Name"
              onChange={handleChange}
              className="pl-10 h-11"
            />
          </div>
          {/* Bio */}
          <div>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Write your bio..."
              className="w-full rounded-md border border-input bg-background p-3 text-sm focus:ring-2 focus:ring-accent outline-none"
              rows={3}
            />
          </div>

          {/* birthDate */}
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
            <label htmlFor="birthDate" className="absolute left-5 -top-3 bg-[#1a3649] px-2 text-sm text-muted-foreground">
                Birthday
            </label>
            <Input
              type="date"
              name="birthDate"
              placeholder="Enter Birthdate"
              value={formData.birthDate}
              onChange={handleChange}
              className="pl-10 h-11"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              className="pl-10 h-11"
            />
          </div>

          {/* Website */}
          <div className="relative">
            <Globe className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              name="website"
              placeholder="Website URL"
              value={formData.website}
              onChange={handleChange}
              className="pl-10 h-11"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-25 flex m-auto h-11 bg-accent text-white rounded-full font-semibold"
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}