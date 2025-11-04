"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MessageCircle, Heart, Repeat2, Bookmark } from "lucide-react"
import Image from "next/image"

type PostCardProps = {
  username: string
  handle: string
  text: string
  imageSrc?: string
}

export default function PostCard({ username, handle, text, imageSrc }: PostCardProps) {
  const initials = username
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <Card className="border-none shadow-none p-5 pb-0 rounded-xl" style={{background: '#2AA3EF0A'}}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <Avatar className="size-10">
          <AvatarImage src="/images/current-user-avatar.png" alt={`${username} avatar`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center justify-center">
              <div className="text-sm font-bold truncate">
                {username}
              </div>
            </div>
            <Button variant="ghost" size="icon" aria-label="More options">
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </div>
          {/* Subtext */}
          <p className="mt-0 text-xs leading-relaxed text-pretty">{text}</p>
        </div>
      </div>

      {imageSrc && (
        <div className="px-6">
          <Image width={1000} height={60} src={imageSrc || "/file.svg"} alt="Post related" className="h-auto w-full rounded-3xl" />
          {/* Actions */}
          <div className="flex items-center justify-between px-4 py-3 text-muted-foreground">
            <Action icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6.66667 10H6.675H6.66667ZM10 10H10.0083H10ZM13.3333 10H13.3417H13.3333ZM17.5 10C17.5 13.6817 14.1417 16.6667 10 16.6667C8.77386 16.6708 7.56233 16.4006 6.45417 15.8758L2.5 16.6667L3.6625 13.5667C2.92667 12.535 2.5 11.3117 2.5 10C2.5 6.31833 5.85833 3.33333 10 3.33333C14.1417 3.33333 17.5 6.31833 17.5 10Z" stroke="#436475" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>} label="Reply" 
            />
            <Action icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M14.1667 16.6667L10.8333 13.3333M5.83333 13.3333V3.33333V13.3333ZM5.83333 3.33333L2.5 6.66667L5.83333 3.33333ZM5.83333 3.33333L9.16667 6.66667L5.83333 3.33333ZM14.1667 6.66667V16.6667V6.66667ZM14.1667 16.6667L17.5 13.3333L14.1667 16.6667Z" stroke="#436475" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>} label="Forward" 
              />
            <Action icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3.5983 5.265C3.25008 5.61322 2.97385 6.02662 2.78539 6.48159C2.59694 6.93657 2.49994 7.42421 2.49994 7.91667C2.49994 8.40913 2.59694 8.89677 2.78539 9.35174C2.97385 9.80671 3.25008 10.2201 3.5983 10.5683L9.99997 16.97L16.4016 10.5683C17.1049 9.86507 17.5 8.91123 17.5 7.91667C17.5 6.9221 17.1049 5.96827 16.4016 5.265C15.6984 4.56173 14.7445 4.16664 13.75 4.16664C12.7554 4.16664 11.8016 4.56173 11.0983 5.265L9.99997 6.36333L8.90164 5.265C8.55342 4.91677 8.14002 4.64055 7.68505 4.45209C7.23007 4.26363 6.74243 4.16663 6.24997 4.16663C5.75751 4.16663 5.26987 4.26363 4.8149 4.45209C4.35992 4.64055 3.94652 4.91677 3.5983 5.265V5.265Z" stroke="#436475" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>} label="Favorite" 
            />
            <Action icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4.16666 4.16667C4.16666 3.72464 4.34225 3.30072 4.65481 2.98816C4.96737 2.67559 5.3913 2.5 5.83332 2.5H14.1667C14.6087 2.5 15.0326 2.67559 15.3452 2.98816C15.6577 3.30072 15.8333 3.72464 15.8333 4.16667V17.5L9.99999 14.5833L4.16666 17.5V4.16667Z" stroke="#436475" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>} label="Bookmark" 
            />
          </div>
        </div>
      )}

      
    </Card>
  )
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={label}
    >
      {icon}
      <span className="hidden">{label}</span>
    </button>
  )
}
