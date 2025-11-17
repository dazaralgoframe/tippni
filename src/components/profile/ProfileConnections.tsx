// src/components/profile/ProfileConnections.tsx
"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import { Loader } from "../ui/loader"

interface ProfileConnectionProps { 
    type: "followers" | "following", 
    onBack: () => void, 
    username: string,
    profileId: string
}
interface UserConnection {
    id: string
    name: string
    username: string
    email: string
    verified?: boolean
    avatarUrl?: string
    followers?: number
    isFollowing?: boolean
}

// call both api parallel
// export default function ProfileConnections({ type, onBack, username, profileId }: ProfileConnectionProps) {
//   const [tab, setTab] = useState<"verified" | "followers" | "following">(type)
//   const [followers, setFollowers] = useState<UserConnection[]>([])
//   const [following, setFollowing] = useState<UserConnection[]>([])
//   const [loading, setLoading] = useState(false)
//   console.log('profileId', profileId);
//   useEffect(() => {
//     const fetchConnections = async () => {
//       try {
//         setLoading(true)

//         const [followersRes, followingRes] = await Promise.all([
//           api.get(`/api/v1/follows/${profileId}/followers`),
//           api.get(`/api/v1/follows/${profileId}/followees`)
//         ])

//         const followerList = followersRes.data || []
//         const followingList = followingRes.data || []
//         console.log('followerList', followersRes);
//         console.log('followingList', followingRes);
        
//         const followingFormatted = followingList.map((u: any) => ({
//           id: u.id,
//           name: u.name || u.username,
//           username: u.username,
//           verified: u.verified || false,
//           avatarUrl: u.avatarUrl,
//           followers: u.followers || 0,
//           isFollowing: true
//         }))

//         const followingIds = new Set(followingFormatted.map((u) => u.id))

//         const followersFormatted = followerList.map((u: any) => ({
//           id: u.id,
//           name: u.name || u.username,
//           username: u.username,
//           verified: u.verified || false,
//           avatarUrl: u.avatarUrl,
//           followers: u.followers || 0,
//           isFollowing: followingIds.has(u.id) // <— MAGIC LINE
//         }))

//         setFollowers(followersFormatted)
//         setFollowing(followingFormatted)

//       } catch (error) {
//         console.error("❌ Failed fetching connections:", error)
//         toast.error("Failed to load connections")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchConnections()
//   }, [profileId])

//   // ⭐ Prepare list for selected tab
//   const verified = [...followers, ...following].filter((u) => u.verified)
//   const list =
//     tab === "verified" ? verified :
//     tab === "followers" ? followers :
//     following

//   const handleFollow = (id: string) => {
//     toast.info("Follow/unfollow API disabled in demo")
//   }

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="sticky top-0 flex items-center gap-3 py-1 bg-background/80 backdrop-blur z-10">
//         <button onClick={onBack} className="p-2 hover:bg-accent rounded-full transition">
//           <ArrowLeft className="w-5 h-5" />
//         </button>
//         <div>
//           <h2 className="text-xl font-bold capitalize">{username}</h2>
//           <div className="text-sm">@{username}</div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex border-b border-border">
//         {["verified", "followers", "following"].map((t) => (
//           <button
//             key={t}
//             onClick={() => setTab(t as any)}
//             className={`flex-1 text-center py-3 text-sm capitalize ${
//               tab === t ? "border-b-2 border-accent text-accent" : "text-muted-foreground"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* Loader */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-10 gap-4">
//           <Loader width={50} height={50} />
//         </div>
//       ) : list.length === 0 ? (
//         <div className="py-10 text-center text-muted-foreground">
//           You don’t have any {tab} yet.
//         </div>
//       ) : (
//         <div>
//           {list.map((user) => (
//             <div
//               key={`${user.id}-${tab}`}
//               className="flex items-center gap-3 px-1 py-2 hover:bg-accent/10 transition"
//             >
//               <Avatar>
//                 <AvatarImage src={user.avatarUrl} />
//                 <AvatarFallback>{user.name[0]}</AvatarFallback>
//               </Avatar>

//               <div className="flex-1">
//                 <p className="font-semibold">{user.name}</p>
//                 <p className="text-sm text-muted-foreground">@{user.username}</p>
//                 <p className="text-sm text-muted-foreground">{user.followers || 0} followers</p>
//               </div>

//               <Button
//                 size="sm"
//                 variant={user.isFollowing ? "outline" : "default"}
//                 className={`rounded-full ${!user.isFollowing && "bg-accent text-white"}`}
//                 onClick={() => handleFollow(user.id)}
//               >
//                 {user.isFollowing ? "Following" : "Follow"}
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

//call api seperately
export default function ProfileConnections({ type, onBack, username, profileId }: ProfileConnectionProps) {
  const [tab, setTab] = useState<"verified" | "followers" | "following">(type)
  const [followers, setFollowers] = useState<UserConnection[]>([])
  const [following, setFollowing] = useState<UserConnection[]>([])
  const [loading, setLoading] = useState(false)
  // console.log('profileId profileConnections=>', profileId);
  // console.log('followers profileConnections=>', followers);
  // console.log('following profileConnections=>', following);
    
  // useEffect(() => {
  //   const fetchConnections = async () => {
  //     try {
  //       setLoading(true)

  //       if (tab === "followers" || tab === "verified") {
  //         const res = await api.get(`/api/v1/follows/${profileId}/followers`)
  //         const list = res.data?.data || res.data || []
  //         console.log('profileConnections follower', list);
          
  //         const resFollowee = await api.get(`/api/v1/follows/${profileId}/followees`)
  //         const followeeList = resFollowee.data?.data || resFollowee.data || []
  //         console.log('profileConnections followees', followeeList);

  //         const matchFollow = 

  //         setFollowers(
  //           list.map((u: any) => ({
  //             id: u.id,
  //             name: u.name || u.username,
  //             username: u.username,
  //             verified: u.verified || false,
  //             avatarUrl: u.avatarUrl,
  //             followers: u.followers || 0,
  //             isFollowing: u.following || false,
  //           }))
  //         )
  //       }

  //       if (tab === "following") {
  //         const res = await api.get(`/api/v1/follows/${profileId}/followees`)
  //         const list = res.data?.data || res.data || []
  //         // console.log('profileConnections followees', list);
  //         setFollowing(
  //           list.map((u: any) => ({
  //             id: u.id,
  //             name: u.name || u.username,
  //             username: u.username,
  //             verified: u.verified || false,
  //             avatarUrl: u.avatarUrl,
  //             followers: u.followers || 0,
  //             isFollowing: true,
  //           }))
  //         )
  //       }
  //     } catch (err) {
  //       console.error("❌ Failed to load connections", err)
  //       toast.error("Failed to load followers/following.")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchConnections()
  // }, [tab, profileId])
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true)
        // Load both lists in parallel
        const [followersRes, followingRes] = await Promise.all([
          api.get(`/api/v1/follows/${profileId}/followers`),
          api.get(`/api/v1/follows/${profileId}/followees`)
        ])
  
        const followerList = followersRes.data?.data || followersRes.data || []
        const followeeList = followingRes.data?.data || followingRes.data || []
        console.log('followerList', followerList);
        console.log('followeeList', followeeList);
        
        const followingFormatted = followeeList.map((u: any) => ({
          id: u.profileId,
          name: u.name || u.username,
          username: u.username,
          email: u.email,
          verified: u.verified || false,
          avatarUrl: u.avatarUrl,
          followers: u.followers || 0,
          isFollowing: true
        }))
  
        const followingIds = new Set(followingFormatted.map((u) => u.id))
        const followersFormatted = followerList.map((u: any) => ({
          id: u.profileId,
          name: u.name || u.username,
          username: u.username,
          email: u.email,
          verified: u.verified || false,
          avatarUrl: u.avatarUrl,
          followers: u.followers || 0,
          isFollowing: followingIds.has(u.profileId)  // MAIN LOGIC
        }))
        setFollowers(followersFormatted)
        setFollowing(followingFormatted)
        console.log('followersFormatted', followersFormatted);
        console.log('followingFormatted', followingFormatted);
        
  
      } catch (error) {
        console.error("❌ Failed fetching connections", error)
        toast.error("Failed to load connections")
      } finally {
        setLoading(false)
      }
    }
  
    fetchConnections()
  }, [profileId])

  const verified = [...followers, ...following].filter((u) => u.verified)
  const list =
    tab === "verified" ? verified : tab === "followers" ? followers : following

    const handleFollow = async (targetId: string) => {
      try {
        setFollowers(prev =>
          prev.map(u => (u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u))
        )
    
        setFollowing(prev =>
          prev.map(u => (u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u))
        )
        console.log('targetId', targetId);
        
        const res = await api.post(`/api/v1/follows/${targetId}`)
        console.log('handleFollow res', res.data);
        
    
        if (res.data) {
          toast.success("Followed")
        } else {
          toast.success("Unfollowed")
        }
    
      } catch (err) {
        console.error("❌ Follow/unfollow error", err)
        toast.error("Failed updating follow state")
    
        // rollback
        setFollowers(prev =>
          prev.map(u => (u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u))
        )
        setFollowing(prev =>
          prev.map(u => (u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u))
        )
      }
    }
    const handleUnfollow = async (targetId: string) => {
      setFollowers(prev =>
        prev.map(u => (u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u))
      )
  
      setFollowing(prev =>
        prev.map(u => (u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u))
      )
      console.log('targetId', targetId);
      console.log('handle unfollow');
      
      try {
        setLoading(true)
        const res = await api.delete(`/api/v1/follows/${targetId}`)
        console.log('handleFollow res', res.data);
        
    
        if (res.data) {
          toast.success("Unfollowed")
        } else {
          toast.success("Followed")
        }
    
      } catch (err) {
        console.error("❌ Follow/unfollow error", err)
        toast.error("Failed updating follow state")
    
        // rollback
        setFollowers(prev =>
          prev.map(u => (u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u))
        )
        setFollowing(prev =>
          prev.map(u => (u.id === targetId ? { ...u, isFollowing: !u.isFollowing } : u))
        )
      }
      setLoading(false)
    }
  
  return (
    <div className="w-full">
      <div className="sticky top-0 flex items-center gap-3 py-1 bg-background z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <button onClick={onBack} className="p-2 hover:bg-accent rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
            <h2 className="text-xl font-bold capitalize">{username}</h2>
            <div className="text-sm">@{username}</div>
        </div>
      </div>
      <div className="flex border-b border-border">
        {["verified", "followers", "following"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`flex-1 text-center py-3 text-sm capitalize ${
              tab === t ? "border-b-2 border-accent text-accent" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <Loader width={50} height={50} className="w-30 h-30" />
          <p className="text-sm text-muted-foreground hidden">Loading {tab}...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          You don’t have any {tab} yet.
        </div>
      ) : (
        <div className="">
          {list.map((user) => (
            <div key={user.id} className="flex items-center gap-3 px-1 py-2 hover:bg-accent/10 transition">
              <Button key={user.id} className="flex items-center gap-3 px-1 py-2 hover:bg-accent/10 transition hidden">
                
              </Button>
              <Avatar>
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">{!user.followers ? '0' : user.followers} followers</p>
                </div>
              {!user.isFollowing &&
                <Button
                  size="sm"
                  variant={user.isFollowing ? "outline" : "default"}
                  className={`rounded-full flex-shrink-0 ${!user.isFollowing && 'bg-accent text-white'}`}
                  onClick={() => handleFollow(user.id)}
                >
                      Follow
                </Button>
              }
              {user.isFollowing &&
                <Button
                  size="sm"
                  variant={user.isFollowing ? "outline" : "default"}
                  className={`rounded-full flex-shrink-0 ${!user.isFollowing && 'bg-accent text-white'}`}
                  onClick={() => handleUnfollow(user.id)}
                >
                    Following
                </Button>
              }
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

