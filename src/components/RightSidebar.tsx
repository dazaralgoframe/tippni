"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Settings } from "lucide-react"
import Trending from "@/components/Trending"
import PopularUser from "@/components/PopularUser"
import ThemeToggle from "./ThemeToggle"

const whoToFollow = [
  { name: "Jamie Lee", handle: "@jamie", initials: "JL" },
  { name: "Sam Rivera", handle: "@samr", initials: "SR" },
  { name: "Priya Mehta", handle: "@priyam", initials: "PM" },
]

export default function RightSidebar() {
  return (
    <div className="flex h-[calc(100dvh-2rem)] flex-col gap-6">
      {/* User bar */}
      <Card className="p-3 border-none shadow-none bg-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarImage src="/images/current-user-avatar.png" alt="Current user avatar" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="text-sm font-medium leading-none">Kew Coder</div>
              <div className="text-xs text-muted-foreground truncate">@kewcoder</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="size-5" style={{color: '#436475'}} aria-hidden />
          </Button>
        </div>
      </Card>

      {/* Trending today */}
      <Trending />
      <PopularUser />
      {/* Popular users / Who to follow */}
      {/* <ThemeToggle /> */}
    </div>
  )
}
