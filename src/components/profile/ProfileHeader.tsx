"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ProfileHeaderProps {
  username: string
}

export default function ProfileHeader({username}: ProfileHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4 py-3">
      <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back" className="">
        <ArrowLeft className="size-5" aria-hidden />
      </Button>
      <div>
        <h2 className="text-xl font-bold capitalize">{username}</h2>
        <p className="text-xs text-muted-foreground hidden">1,234 posts</p>
      </div>
    </div>
  )
}
