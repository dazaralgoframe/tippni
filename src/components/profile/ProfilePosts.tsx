// src/components/profile/ProfilePosts.tsx
"use client"

import PostCard from "@/components/feed/PostCard"
import { api } from "@/lib/axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface ProfilePostsProps {
  tab: string
  profileId: string
}

export default function ProfilePosts({ tab, profileId }: ProfilePostsProps) {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/api/v1/tippnis/user/${profileId}`)
      console.log("Profile posts:", res.data)
      const list = res.data || []
      let filtered = list
      console.log("Profile posts:", filtered);
      
      if (tab === "media") {
        filtered = list.filter((p: any) => p.mediaUrls?.length > 0)
      }

      if (tab === "replies") {
        filtered = list.filter((p: any) => p.type === "REPLY" || p.replyToId)
      }

      if (tab === "likes") {
        filtered = list.filter((p: any) => p.isLiked)
      }

      setPosts(filtered)
    } catch (err: any) {
      console.error("Failed to load posts:", err)
      toast.error(err?.response?.data?.message || "Failed loading posts.")
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=> {
    if (profileId) fetchPosts()
  }, [tab, profileId])
  // const posts = [
  //   {
  //     username: "Kew Coder",
  //     handle: "@kewcoder",
  //     text: "Just finished redesigning our design system. The new component library is going to make development so much faster!",
  //     imageSrc: "/images/design-system-presentation.png",
  //   },
  //   {
  //     username: "Kew Coder",
  //     handle: "@kewcoder",
  //     text: "Design tip: Always test your interfaces with real users. You'll be surprised what you learn!",
  //     imageSrc: "/images/minimal-desk-notebook.jpg",
  //   },
  //   {
  //     username: "Kew Coder",
  //     handle: "@kewcoder",
  //     text: "Just shipped a new design system update. Loving the consistency it brings!",
  //     imageSrc: "/images/webDeveloper.png",
  //   },
  // ]

  const replies = [
    {
      username: "Kew Coder",
      handle: "@kewcoder",
      text: "Great point! I totally agree with your perspective on this.",
      imageSrc: undefined,
    },
    {
      username: "Kew Coder",
      handle: "@kewcoder",
      text: "Thanks for sharing this resource. Really helpful!",
      imageSrc: undefined,
    },
  ]

  const media = [
    {
      username: "Kew Coder",
      handle: "@kewcoder",
      text: "Behind the scenes of our design process",
      imageSrc: "/images/design-system-presentation.png",
    },
    {
      username: "Kew Coder",
      handle: "@kewcoder",
      text: "New workspace setup",
      imageSrc: "/images/minimal-desk-notebook.jpg",
    },
  ]

  const likes = [
    {
      username: "Kew Coder",
      handle: "@kewcoder",
      text: "Loved this article on design systems",
      imageSrc: "/images/code-editor-screenshot.png",
    },
  ]

  const getPostsForTab = () => {
    switch (tab) {
      case "replies":
        return replies
      case "media":
        return media
      case "likes":
        return likes
      default:
        return posts
    }
  }
  if (loading) return <div className="py-10 text-center">Loading posts...</div>

  if (posts.length === 0)
    return <div className="py-10 text-center text-muted-foreground">No posts found.</div>

  console.log('profile post data', posts);
  
  return (
    <div className="space-y-4 py-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          // username={post.profile?.username}
          // handle={`@${post.profile?.username}`}
          // text={post.text}
          // text='Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry'
          // imageSrc={post.mediaUrls?.[0]}
          // avatarUrl={post.profile?.avatarUrl}
          post={post}
      />
      ))}
    </div>
  )
}
