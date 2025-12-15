// src/components/feed/PostCard.tsx
 
"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"
import { api } from "@/lib/axios"
import { toast } from "sonner"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import "@/styles/swiper.css"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { deletePost } from "@/store/postSlice";
import { Post } from "@/types/post"
import DustDeleteWrapper from "@/components/animations/DustDeleteWrapper"
import ConfirmModal from "../common/ConfirmModal"
import { toggleRepost } from "@/store/repostSlice"
import { Action, BookmarkIcon, FilledHeartIcon, ForwardIcon, HeartIcon, ReplyIcon } from "@/components/common/PostActions"
import ReplyModal from "@/components/feed/ReplyModal"


type PostCardProps = {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const dispatch = useAppDispatch()
  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const username = post.profile?.username || "Unknown"
  const avatarUrl = post.profile?.avatarUrl
  const imageSrc = post.mediaUrls?.[0]
  const postId = post.id
  const profileId = post?.profile?.profileId

  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)

  const [liked, setLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes || 0);

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const originalPost =
  typeof post.retippniTo === "object" && post.retippniTo !== null
    ? post.retippniTo
    : post;
  const isRepost = !!post.retippniTo;
  const isRepostedByUser = post.isRetippnied;
  const repostCount = originalPost.retippnis ?? 0;
  console.log('originalPost PostCard', originalPost);
  console.log('mediaUrls PostCard', originalPost);
  

  const isOwner = originalPost.isBelongs;

  const [showReplyModal, setShowReplyModal] = useState(false);


  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current
      const over = el.scrollHeight > el.clientHeight + 5
      setIsOverflowing(over)
    }
  }, [originalPost.text])

  
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
  const openDeleteModal = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      setShowDeleteModal(false);
      document.getElementById(`dust-trigger-btn-${postId}`)?.click();
      await new Promise((res) => setTimeout(res, 1800));
      await dispatch(deletePost(postId)).unwrap();
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };
  const handleRepost = async () => {
    try {
      await dispatch(
        toggleRepost({
          postId: originalPost.id,
          isReposted: isRepostedByUser
        })
      ).unwrap();
  
      toast.success(isRepostedByUser ? "Undo repost" : "Reposted!");
    } catch (err) {
      toast.error("Repost action failed");
    }
  };
  
  const handleReplySubmit = async (text: string, files: File[]) => {
    try {
      const form = new FormData();
      form.append("text", text);
      files.forEach((f) => form.append("media", f));
      console.log('formData after reply', form);
      
      // await api.post(`/api/v1/comment/${postId}`, form);
      toast.success("Reply posted!");
    } catch (err) {
      toast.error("Failed to post reply");
    }
  };
  
  return (
    <DustDeleteWrapper
      postId={postId}
      onFinish={() => dispatch(deletePost(postId))}
    >
      <Card className={`border-none shadow-md p-5 pb-3 rounded-xl gap-3 relative bg-secondary`} key={postId}>
        {isRepost && (
          <div className="text-xs text-accent font-semibold mb-2 px-2">
            🔁 You reposted
          </div>
        )}
        <div className="flex items-start gap-3">
          <Avatar className="size-10">
            <AvatarImage src={originalPost.profile?.avatarUrl || "/images/default-avatar.png"} alt={`${originalPost.profile?.username || "Unknown"} avatar`} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <div>
                <div className="text-sm font-bold truncate">{originalPost.profile?.username || "Unknown"}</div>
                <div className="text-xs text-muted-foreground truncate">@{originalPost.profile?.username || "Unknown"}</div>
              </div>
              <div className="absolute top-2 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="More options">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-32 bg-secondary-solid text-primary-foreground border-none shadow-dropdown">
                  {isOwner ? (
                    // ONLY SHOW DELETE IF THIS USER OWNS THE POST
                    <DropdownMenuItem
                      className="text-red-500 font-medium cursor-pointer"
                      onClick={openDeleteModal}
                    >
                      Delete
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem className="cursor-pointer">
                        Mute @{username}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-500">
                        Block @{username}
                      </DropdownMenuItem>
                    </>
                  )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                {originalPost.text || ""} 
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
        <div className="px-6">

          {/* MULTI-IMAGE CAROUSEL */}
          {(originalPost.mediaUrls?.length ?? 0) > 1 && (
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={10}
              className="rounded-3xl"
            >
              {originalPost.mediaUrls?.map((url, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={url}
                    alt={`Post media ${index + 1}`}
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
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* SINGLE IMAGE */}
          {originalPost.mediaUrls?.length === 1 && (
            <Image
              src={originalPost.mediaUrls?.[0] ?? ""}
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

          {/* YOUR ICONS AREA */}
          <div className="flex items-center justify-between px-4 py-3 text-muted-foreground">
            <Action
              label="Reply"
              icon={
                <div onClick={() => setShowReplyModal(true)}>
                  <ReplyIcon stroke={svgStrokeColor} />
                </div>
              }
            />
            <Action
              label="Forward"
              icon={
                <div onClick={handleRepost} className="flex items-center gap-1 cursor-pointer">
                  <ForwardIcon stroke={isRepostedByUser ? "#16A34A" : svgStrokeColor} />
                  <span className="text-sm">{repostCount}</span>
                </div>
              }
            />
            <Action
              label="Favorite"
              icon={
                <div
                  onClick={toggleLike}
                  className="flex items-center gap-1 cursor-pointer p-0"
                >
                  {liked ? <FilledHeartIcon /> : <HeartIcon stroke={svgStrokeColor} />}
                  <span className="text-sm">{likes}</span>
                </div>
              }
            />
            <Action label="Bookmark" icon={<BookmarkIcon stroke={svgStrokeColor} />} />
          </div>
        </div>
    </Card>
    <ConfirmModal
      open={showDeleteModal}
      title="Delete post?"
      description="This action cannot be undone. Are you sure you want to delete this post?"
      onCancel={() => setShowDeleteModal(false)}
      onConfirm={confirmDelete}
      confirmText = 'Delete'
    />
    <ReplyModal
      open={showReplyModal}
      onClose={() => setShowReplyModal(false)}
      onSubmit={handleReplySubmit}
      replyingTo={originalPost.profile?.username || "user"}
      avatarUrl={currentUser?.avatarUrl}
      mediaUrls={originalPost.mediaUrls?.[0] ?? ""}
    />
    </DustDeleteWrapper>
  )
}