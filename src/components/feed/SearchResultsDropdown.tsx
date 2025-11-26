// src/components/feed/SearchResultsDropdown.tsx
"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, Search } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import { Loader } from "../ui/loader"
import { useDispatch } from "react-redux"
import { fetchProfileByUsername } from "@/store/profileSlice"
import { setPage } from "@/store/pageSlice"


interface UserProfile {
  id: string
  name: string
  username: string
  profileId: string
  avatarUrl?: string
  followers: number
  following: number
  isFollowing?: boolean
}

interface SearchResultsDropdownProps {
  searchQuery: string
  recentSearches: string[]
  onClose: () => void
  onSelectSearch: (query: string) => void
}

export function SearchResultsDropdown({
  searchQuery,
  recentSearches,
  onClose,
  onSelectSearch,
}: SearchResultsDropdownProps) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({})
  const dispatch = useDispatch()


  const openUserProfile = (profileId: string) => {
    console.log('SearchResultsDropdown username =>', profileId);
    dispatch(fetchProfileByUsername(profileId) as any)       // Load that user's profile
    dispatch(setPage("profile"))               // Switch to ProfilePage
    onClose()                                  // Close the dropdown
    alert('clicked user from search')
    
  }
  // ✅ Fetch from API when search query changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([])
        return
      }

      try {
        setLoading(true)
        const res = await api.get(
          `/api/v1/profiles/?username=${encodeURIComponent(searchQuery)}&page=0&size=10&sort=`
        )
        
        
        const data = res.data?.content || res.data || []
        console.log('SearchResultsDropdown search content', res.data.content);
        // Normalize the API data
        const formatted = data.map((user: any, index: number) => ({
          id: user.id ?? `user=${index}`,
          profileId: user.profileId,
          name: user.name || user.username || "Unknown User",
          username: user.username ? `${user.username}` : "",
          avatarUrl: user.avatarUrl,
          followers: user.followers || 0,
          following: user.followees || 0,
          isFollowing: user.isFollowing || false,
        }))

        setUsers(formatted)
      } catch (error: any) {
        console.error("❌ Failed to fetch users:", error)
        toast.error("Failed to load search results.")
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchUsers, 400) // debounce for better UX
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const toggleFollow = (userId: string) => {
    setFollowingState((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }
  console.log('SearchResultsDropdown userlist => ', users);
  
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-2xl border border-border bg-modal shadow-lg max-w-100 m-auto">
      {searchQuery.trim() === "" ? (
        // 🕑 Show recent searches
        <div className="p-4">
          {recentSearches.length > 0 ? (
            <>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Recent</h3>
              <div className="space-y-3">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectSearch(search)}
                    className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors"
                  >
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{search}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-5">
              {/* <Search className="mb-2 size-8 text-muted-foreground" /> */}
              <Loader className="w-15 h-15" width={30} height={30} />
              <p className="text-sm text-muted-foreground">Try searching for people</p>
            </div>
          )}
        </div>
      ) : loading ? (
        // ⏳ Loading state
        <div className="flex flex-col items-center justify-center py-8 text-center gap-5">
          {/* <Search className="mb-2 size-8 animate-spin text-muted-foreground" /> */}
          <Loader className="w-15 h-15" width={30} height={30} />
          <p className="text-sm text-muted-foreground">Searching...</p>
        </div>
      ) : users.length > 0 ? (
        // ✅ Show fetched results
        <div className="max-h-96 overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => openUserProfile(user.profileId)}
              className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 hover:bg-accent transition-colors cursor-pointer"
            >
              <div className="flex flex-1 items-center gap-3 min-w-0">
                <Avatar className="size-10 flex-shrink-0">
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.followers} followers · {user.following} following
                  </p>
                </div>
              </div>
              <Button
                onClick={() => toggleFollow(user.id)}
                variant="secondary"
                size="sm"
                className="flex-shrink-0 hidden"
              >
                {followingState[user.id] ? "Following" : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        // ❌ No results found
        <div className="flex flex-col items-center justify-center py-8 text-center p-4">
          <Search className="mb-2 size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No results found for "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  )
}
