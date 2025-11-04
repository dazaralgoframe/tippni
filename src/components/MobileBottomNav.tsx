"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Bell, Settings, Feather } from "lucide-react"
import { useState } from "react"
import TippniModal from "./TippniModal"
import MenuLogo from "../../public/images/tippniLogo.png";
import Image from "next/image"

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Profile", icon: User, href: "/" },
  { label: "Notification1", icon: Bell, href: "/" },
  { label: "Notification", icon: Bell, href: "/" },
  { label: "Settings", icon: Settings, href: "/" },
]

export default function MobileBottomNav() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 flex lg:hidden justify-around items-center bg-modal border-t border-border h-16 z-40">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          if (index === 2) {
            return (
              <button
                key="tippni"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center w-20 h-20 rounded-full bg-transparent text-primary-foreground hover:bg-primary/90 -mt-10"
                aria-label="tippni"
              >
                <Image width={100} height={100} alt='image' src={MenuLogo} />
              </button>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-md transition-colors ${
                isActive ? "bg-sec text-pri" : "text-muted-foreground hover:bg-secondary/50"
              }`}
              aria-label={item.label}
            >
              <Icon className="size-6" aria-hidden />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>

      <TippniModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
