// src/components/feed/PostCard.tsx
 
"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { api } from "@/lib/axios"
import { toast } from "sonner"

type PostCardProps = {
  post: {
    id: number
    text: string
    mediaUrls?: string[]
    isLiked?: boolean
    likes?: number
    profile?: {
      username: string
      avatarUrl?: string
    }
  }
}

export default function PostCard({ post }: PostCardProps) {
  console.log('post from PostCard => ', post);
  
  const username = post.profile?.username || "Unknown"
  const handle = `@${username}`
  const avatarUrl = post.profile?.avatarUrl
  const imageSrc = post.mediaUrls?.[0]
  const postId = post.id

  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  const [liked, setLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes || 0);
  
  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current
      const over = el.scrollHeight > el.clientHeight + 5
      setIsOverflowing(over)
    }
  }, [post.text])

  
  const initials = username
    ?.split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  const {theme} = useTheme()
  const svgStrokeColor = theme === 'light' ? '#436475' : '#d6d6d6'
  async function toggleLike() {
    try {
      if (liked) {
        // UNLIK
        alert('unlike')
        await api.delete(`/api/v1/like/${postId}`);
        toast.warning('you unliked the post')
        setLiked(false);
        setLikes((prev) => prev - 1);
      } else {
        // LIKE
        alert('like')
        await api.post(`/api/v1/like/${postId}`);
        toast.success('you liked the post')
        setLiked(true);
        setLikes((prev) => prev + 1);
      }
    } catch (err: unknown) {
      alert('error')
      console.error("Like error:", err);
      const message =
      err instanceof Error
        ? err.message
        : "Something went wrong";
      toast.error(message);
    }
  }
  return (
    <Card className="border-none shadow-md p-5 pb-0 rounded-xl" style={{ background: '#2AA3EF0A' }} key={postId}>
      <div className="flex items-start gap-3">
        <Avatar className="size-10">
          <AvatarImage src={avatarUrl || "/images/default-avatar.png"} alt={`${username} avatar`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <div>
              <div className="text-sm font-bold truncate">{username}</div>
              <div className="text-xs text-muted-foreground truncate">{handle}</div>
            </div>
            <Button variant="ghost" size="icon" aria-label="More options">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
          <div className="mt-1 text-sm leading-relaxed break-words">
            <p
              ref={textRef}
              className={
                expanded
                  ? "whitespace-pre-wrap"
                  : "whitespace-pre-wrap line-clamp-3"
              }
            >
              {post.text} 
            </p>
            {!expanded && isOverflowing && (
              <Button
                onClick={() => setExpanded(true)}
                variant="link"
                className="text-accent text-xs font-semibold mt-1 hover:underline px-0 cursor-pointer"
              >
                Read more
              </Button>
            )}

            {expanded && (
              <Button
                onClick={() => setExpanded(false)}
                variant="link"
                className="text-accent text-xs font-semibold mt-1 hover:underline px-0 cursor-pointer"
              >
                Show less
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Image */}
      
        <div className="px-6 mt-3">
          {imageSrc && (
            // <Image
            //   width={100}
            //   height={100}
            //   src={imageSrc || ''}
            //   alt="Post media"
            //   className="w-full h-50 rounded-3xl"
            // />
            <Image
              src={imageSrc}
              alt="Post media"
              width={2000}
              height={1200}
              quality={80}
              sizes="(max-width: 480px) 100vw,
                    (max-width: 768px) 100vw,
                    (max-width: 1200px) 80vw,
                    400px"
              className="
              rounded-3xl w-full h-auto 
              max-h-[300px] 
              md:max-h-[300px] 
              lg:max-h-[350px] 
              object-cover
              "
            />
          )}
          <div className="flex items-center justify-between px-4 py-3 text-muted-foreground">
          <Action label="Reply" icon={<ReplyIcon stroke={svgStrokeColor} />} />
          <Action label="Forward" icon={<ForwardIcon stroke={svgStrokeColor} />} />
          <Action
            label="Favorite"
            icon={
              <div onClick={toggleLike} className="flex items-center gap-1 cursor-pointer p-0">
                {liked ? <FilledHeartIcon stroke='red' /> : <HeartIcon stroke={svgStrokeColor} />}
                <span className="text-sm">{likes}</span>
              </div>
            }
          />
          <Action label="Bookmark" icon={<BookmarkIcon stroke={svgStrokeColor} />} />
          </div>
        </div>
    </Card>
  )
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className="p-0 inline-flex items-center gap-2 rounded-md text-xs hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={label}
    >
      {icon}
    </div>
  )
}

const ReplyIcon = ({ stroke }: any) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M6.66667 10H6.675H6.66667ZM10 10H10.0083H10ZM13.3333 10H13.3417H13.3333ZM17.5 10C17.5 13.6817 14.1417 16.6667 10 16.6667C8.77386 16.6708 7.56233 16.4006 6.45417 15.8758L2.5 16.6667L3.6625 13.5667C2.92667 12.535 2.5 11.3117 2.5 10C2.5 6.31833 5.85833 3.33333 10 3.33333C14.1417 3.33333 17.5 6.31833 17.5 10Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ForwardIcon = ({ stroke }: any) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M14.1667 16.6667L10.8333 13.3333M5.83333 13.3333V3.33333V13.3333ZM5.83333 3.33333L2.5 6.66667L5.83333 3.33333ZM5.83333 3.33333L9.16667 6.66667L5.83333 3.33333ZM14.1667 6.66667V16.6667V6.66667ZM14.1667 16.6667L17.5 13.3333L14.1667 16.6667Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const HeartIcon = ({ stroke }: any) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M3.5983 5.265C3.25008 5.61322 2.97385 6.02662 2.78539 6.48159C2.59694 6.93657 2.49994 7.42421 2.49994 7.91667C2.49994 8.40913 2.59694 8.89677 2.78539 9.35174C2.97385 9.80671 3.25008 10.2201 3.5983 10.5683L9.99997 16.97L16.4016 10.5683C17.1049 9.86507 17.5 8.91123 17.5 7.91667C17.5 6.9221 17.1049 5.96827 16.4016 5.265C15.6984 4.56173 14.7445 4.16664 13.75 4.16664C12.7554 4.16664 11.8016 4.56173 11.0983 5.265L9.99997 6.36333L8.90164 5.265C8.55342 4.91677 8.14002 4.64055 7.68505 4.45209C7.23007 4.26363 6.74243 4.16663 6.24997 4.16663C5.75751 4.16663 5.26987 4.26363 4.8149 4.45209C4.35992 4.64055 3.94652 4.91677 3.5983 5.265V5.265Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FilledHeartIcon = ({ stroke }: any) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="red">
    <path d="M3.5983 5.265C3.25008 5.61322 2.97385 6.02662 2.78539 6.48159C2.59694 6.93657 2.49994 7.42421 2.49994 7.91667C2.49994 8.40913 2.59694 8.89677 2.78539 9.35174C2.97385 9.80671 3.25008 10.2201 3.5983 10.5683L9.99997 16.97L16.4016 10.5683C17.1049 9.86507 17.5 8.91123 17.5 7.91667C17.5 6.9221 17.1049 5.96827 16.4016 5.265C15.6984 4.56173 14.7445 4.16664 13.75 4.16664C12.7554 4.16664 11.8016 4.56173 11.0983 5.265L9.99997 6.36333L8.90164 5.265C8.55342 4.91677 8.14002 4.64055 7.68505 4.45209C7.23007 4.26363 6.74243 4.16663 6.24997 4.16663C5.75751 4.16663 5.26987 4.26363 4.8149 4.45209C4.35992 4.64055 3.94652 4.91677 3.5983 5.265V5.265Z"
    stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      />
  </svg>
)

const BookmarkIcon = ({ stroke }: any) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M4.16666 4.16667C4.16666 3.72464 4.34225 3.30072 4.65481 2.98816C4.96737 2.67559 5.3913 2.5 5.83332 2.5H14.1667C14.6087 2.5 15.0326 2.67559 15.3452 2.98816C15.6577 3.30072 15.8333 3.72464 15.8333 4.16667V17.5L9.99999 14.5833L4.16666 17.5V4.16667Z"
      stroke={stroke}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
