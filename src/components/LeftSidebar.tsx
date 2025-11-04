// leftsidebar.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { setPage } from "@/store/pageSlice"
import { useState } from "react"
import TippniModal from "./TippniModal"
import WhiteLogo from "../../public/images/tippniLogoDark.png";
import DarkLogo from "../../public/images/tippniLogoLight.png";
import Image from "next/image"
import { useTheme } from "next-themes"
import { toast } from "sonner"

// ---------- ICONS ----------

const iconClasses = "size-7 transition-colors group-hover:text-accent"

const Home = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="currentColor" className={iconClasses}>
    <path d="M16.0605 3.43952C15.7792 3.15831 15.3977 3.00034 15 3.00034C14.6023 3.00034 14.2208 3.15831 13.9395 3.43952L3.4395 13.9395C3.16626 14.2224 3.01507 14.6013 3.01849 14.9946C3.02191 15.3879 3.17966 15.7641 3.45777 16.0422C3.73588 16.3204 4.1121 16.4781 4.5054 16.4815C4.89869 16.4849 5.2776 16.3337 5.5605 16.0605L6 15.621V25.5C6 25.8978 6.15804 26.2794 6.43934 26.5607C6.72065 26.842 7.10218 27 7.5 27H10.5C10.8978 27 11.2794 26.842 11.5607 26.5607C11.842 26.2794 12 25.8978 12 25.5V22.5C12 22.1022 12.158 21.7207 12.4393 21.4394C12.7206 21.158 13.1022 21 13.5 21H16.5C16.8978 21 17.2794 21.158 17.5607 21.4394C17.842 21.7207 18 22.1022 18 22.5V25.5C18 25.8978 18.158 26.2794 18.4393 26.5607C18.7206 26.842 19.1022 27 19.5 27H22.5C22.8978 27 23.2794 26.842 23.5607 26.5607C23.842 26.2794 24 25.8978 24 25.5V15.621L24.4395 16.0605C24.7224 16.3337 25.1013 16.4849 25.4946 16.4815C25.8879 16.4781 26.2641 16.3204 26.5422 16.0422C26.8203 15.7641 26.9781 15.3879 26.9815 14.9946C26.9849 14.6013 26.8337 14.2224 26.5605 13.9395L16.0605 3.43952Z"/>
  </svg>
)

const Sparkles = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="currentColor" className={iconClasses}>
    <path fillRule="evenodd" clipRule="evenodd" d="M18.5925 3.8295C18.4974 3.63905 18.3629 3.47102 18.1979 3.33657C18.0329 3.20213 17.8411 3.10434 17.6354 3.04971C17.4297 2.99509 17.2147 2.98488 17.0047 3.01975C16.7947 3.05463 16.5945 3.1338 16.4175 3.252C15.9 3.597 15.4965 4.089 15.1845 4.572C14.8635 5.067 14.58 5.6415 14.3295 6.246C13.8285 7.452 13.4085 8.898 13.0695 10.347C12.6595 12.1177 12.3525 13.9107 12.15 15.717C11.5397 15.3236 11.0493 14.7699 10.7325 14.1165C10.2405 13.0965 10.1355 11.8155 10.1355 10.1355C10.1354 9.83887 10.0474 9.54893 9.88261 9.30231C9.71778 9.0557 9.48354 8.86349 9.20949 8.74998C8.93544 8.63648 8.63389 8.60677 8.34296 8.66463C8.05203 8.72248 7.78479 8.86529 7.57501 9.075C6.59875 10.0492 5.82455 11.2066 5.29685 12.4808C4.76915 13.755 4.49835 15.1209 4.50001 16.5C4.50013 18.2267 4.92608 19.9267 5.74012 21.4494C6.55415 22.9722 7.73116 24.2707 9.16688 25.2299C10.6026 26.1891 12.2527 26.7795 13.9711 26.9487C15.6895 27.1179 17.423 26.8607 19.0183 26.1999C20.6135 25.5391 22.0212 24.4951 23.1166 23.1604C24.212 21.8257 24.9613 20.2414 25.2982 18.5479C25.6351 16.8544 25.5492 15.104 25.048 13.4516C24.5468 11.7993 23.6459 10.296 22.425 9.075C21.537 8.1885 20.955 7.5975 20.403 6.8745C19.8585 6.1605 19.317 5.28 18.5925 3.8295ZM18.18 22.68C17.5507 23.3085 16.7492 23.7365 15.8768 23.9098C15.0044 24.0831 14.1002 23.994 13.2785 23.6537C12.4567 23.3135 11.7542 22.7373 11.2597 21.998C10.7651 21.2587 10.5008 20.3894 10.5 19.5C10.5 19.5 11.8185 20.25 14.25 20.25C14.25 18.75 15 14.25 16.125 13.5C16.875 15 17.304 15.4395 18.1815 16.3185C18.6001 16.7358 18.932 17.2317 19.1583 17.7777C19.3846 18.3236 19.5007 18.909 19.5 19.5C19.5007 20.091 19.3846 20.6764 19.1583 21.2223C18.932 21.7683 18.6001 22.2642 18.1815 22.6815L18.18 22.68Z"/>
  </svg>
)

const Bell = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="currentColor" className={iconClasses}>
    <path d="M15 3C12.6131 3 10.3239 3.94821 8.63609 5.63604C6.94826 7.32387 6.00005 9.61305 6.00005 12V17.379L4.93955 18.4395C4.72983 18.6493 4.58702 18.9165 4.52917 19.2075C4.47132 19.4984 4.50102 19.7999 4.61453 20.074C4.72803 20.348 4.92024 20.5823 5.16686 20.7471C5.41347 20.9119 5.70342 20.9999 6.00005 21H24C24.2967 20.9999 24.5866 20.9119 24.8332 20.7471C25.0798 20.5823 25.2721 20.348 25.3856 20.074C25.4991 19.7999 25.5288 19.4984 25.4709 19.2075C25.4131 18.9165 25.2703 18.6493 25.0605 18.4395L24 17.379V12C24 9.61305 23.0518 7.32387 21.364 5.63604C19.6762 3.94821 17.387 3 15 3ZM15 27C13.8066 27 12.662 26.5259 11.8181 25.682C10.9742 24.8381 10.5 23.6935 10.5 22.5H19.5C19.5 23.6935 19.0259 24.8381 18.182 25.682C17.3381 26.5259 16.1935 27 15 27Z"/>
  </svg>
)

const Bookmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="currentColor" className={iconClasses}>
    <path d="M7.5 6C7.5 5.20435 7.81607 4.44129 8.37868 3.87868C8.94129 3.31607 9.70435 3 10.5 3H19.5C20.2956 3 21.0587 3.31607 21.6213 3.87868C22.1839 4.44129 22.5 5.20435 22.5 6V27L15 23.25L7.5 27V6Z"/>
  </svg>
)

const CircleUserRound = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="currentColor" className={iconClasses}>
    <path fillRule="evenodd" clipRule="evenodd" d="M27 15C27 18.1826 25.7357 21.2348 23.4853 23.4853C21.2348 25.7357 18.1826 27 15 27C11.8174 27 8.76515 25.7357 6.51472 23.4853C4.26428 21.2348 3 18.1826 3 15C3 11.8174 4.26428 8.76515 6.51472 6.51472C8.76515 4.26428 11.8174 3 15 3C18.1826 3 21.2348 4.26428 23.4853 6.51472C25.7357 8.76515 27 11.8174 27 15ZM18 10.5C18 11.2956 17.6839 12.0587 17.1213 12.6213C16.5587 13.1839 15.7956 13.5 15 13.5C14.2043 13.5 13.4413 13.1839 12.8787 12.6213C12.3161 12.0587 12 11.2956 12 10.5C12 9.70435 12.3161 8.94129 12.8787 8.37868C13.4413 7.81607 14.2043 7.5 15 7.5C15.7956 7.5 16.5587 7.81607 17.1213 8.37868C17.6839 8.94129 18 9.70435 18 10.5ZM15 16.5C13.5639 16.4997 12.1579 16.9117 10.9491 17.6871C9.74033 18.4625 8.77956 19.5686 8.181 20.874C9.02501 21.8559 10.0714 22.6436 11.2484 23.1832C12.4254 23.7228 13.7052 24.0014 15 24C16.2948 24.0014 17.5746 23.7228 18.7516 23.1832C19.9286 22.6436 20.975 21.8559 21.819 20.874C21.2204 19.5686 20.2597 18.4625 19.0509 17.6871C17.8421 16.9117 16.4361 16.4997 15 16.5Z"/>
  </svg>
)

const Settings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 20" fill="currentColor" className={iconClasses}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12.2697 3.17C11.8639 1.61 9.49325 1.61 9.08746 3.17C9.02688 3.40442 8.90805 3.62213 8.74065 3.80541C8.57324 3.9887 8.362 4.13238 8.12409 4.22477C7.88619 4.31716 7.62835 4.35564 7.37156 4.33709C7.11478 4.31854 6.8663 4.24347 6.64634 4.118C5.18124 3.282 3.50471 4.852 4.39744 6.224C4.97408 7.11 4.46257 8.266 3.38617 8.511C1.71925 8.89 1.71925 11.111 3.38617 11.489C3.63656 11.5458 3.86909 11.6572 4.06481 11.8141C4.26053 11.971 4.41392 12.1689 4.51249 12.3918C4.61105 12.6147 4.652 12.8563 4.63201 13.0968C4.61202 13.3373 4.53164 13.5701 4.39744 13.776C3.50471 15.148 5.18124 16.718 6.64634 15.882C6.86626 15.7563 7.11476 15.6811 7.37161 15.6623C7.62847 15.6436 7.88642 15.682 8.12445 15.7743C8.36248 15.8666 8.57387 16.0102 8.7414 16.1935C8.90893 16.3768 9.02787 16.5945 9.08853 16.829C9.49325 18.39 11.865 18.39 12.2686 16.829C12.3295 16.5946 12.4485 16.377 12.6161 16.1939C12.7837 16.0107 12.995 15.8672 13.233 15.7749C13.4709 15.6826 13.7288 15.6442 13.9856 15.6628C14.2424 15.6815 14.4908 15.7565 14.7108 15.882C16.1759 16.718 17.8524 15.148 16.9597 13.776C16.8257 13.57 16.7456 13.3373 16.7257 13.0969C16.7058 12.8564 16.7468 12.6149 16.8453 12.3921C16.9439 12.1692 17.0972 11.9713 17.2928 11.8144C17.4883 11.6575 17.7207 11.546 17.971 11.489C19.6379 11.11 19.6379 8.889 17.971 8.511C17.7206 8.45419 17.4881 8.34281 17.2923 8.18593C17.0966 8.02904 16.9432 7.83109 16.8447 7.60818C16.7461 7.38527 16.7051 7.14372 16.7251 6.90318C16.7451 6.66265 16.8255 6.42994 16.9597 6.224C17.8524 4.852 16.1759 3.282 14.7108 4.118C14.4909 4.24368 14.2424 4.31895 13.9855 4.33767C13.7287 4.35639 13.4707 4.31804 13.2327 4.22574C12.9947 4.13344 12.7833 3.9898 12.6157 3.80651C12.4482 3.62323 12.3293 3.40548 12.2686 3.171L12.2697 3.17ZM10.6786 13C11.5282 13 12.3431 12.6839 12.9438 12.1213C13.5446 11.5587 13.8821 10.7956 13.8821 10C13.8821 9.20435 13.5446 8.44129 12.9438 7.87868C12.3431 7.31607 11.5282 7 10.6786 7C9.82893 7 9.01409 7.31607 8.4133 7.87868C7.81252 8.44129 7.475 9.20435 7.475 10C7.475 10.7956 7.81252 11.5587 8.4133 12.1213C9.01409 12.6839 9.82893 13 10.6786 13Z" />
  </svg>
)
const navItems = [
  { label: "Home", icon: Home, href: "#", key: 'home' },
  { label: "For you", icon: Sparkles, href: "#", key: 'foryou' },
  { label: "Notification", icon: Bell, href: "#", key: 'notification' },
  { label: "Bookmarks", icon: Bookmark, href: "#", key: 'bookmarks' },
  { label: "Profile", icon: CircleUserRound, href: "#", key: 'profile' },
  { label: "Settings and privacy", icon: Settings, href: "#", key: 'settings' },
]

interface LeftSidebarProps {
  onSetSignup: (open: boolean) => void
}

export default function LeftSidebar({onSetSignup}: LeftSidebarProps) {
  const dispatch = useDispatch()
  const activePage = useSelector((state: RootState) => state.page.activePage)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {theme} = useTheme()
  return (
    <>
      <div className="flex h-[calc(100dvh-2rem)] flex-col justify-between rounded-lg p-4">
      {/* Header / Logo */}
      <div>
        <div className="mb-6 flex items-center gap-2 hidden">
          <div aria-hidden className="size-9 rounded-full bg-primary hidden" />
          <span className="text-lg font-semibold">Tippni</span>
        </div>
        <Image width={120} height={120} src={theme === 'light' ? DarkLogo : WhiteLogo} alt="logo" />
      </div>
      <div className="md:w-60">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => dispatch(setPage(item.key as any))}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-secondary 
                  ${activePage === item.key ? 'text-accent' : 'text-primary'}`}
                // className={`w-full text-left px-3 py-2 rounded-md transition-colors 
                //   ${activePage === item.key ? "bg-accent text-white" : "text-primary hover:bg-secondary"}`}
                aria-label={item.label}
            >
              <Icon />
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
            )
          })}
        </nav>

          {/* Tweet button */}
          <div className="mt-6">
            <Button className="w-full rounded-full bg-accent text-white" size="lg" onClick={() => setIsModalOpen(true)}>
              {/* <Feather className="mr-2 size-4 hidden" aria-hidden /> */}
              Tippni
            </Button>
          </div>
      </div>

      {/* Footer (optional quick links) */}
      <div className="mt-6 text-xs text-muted-foreground">
        <Button onClick={()=> onSetSignup(true)} className="w-50 rounded-full text-white cursor-pointer p-2 bg-secondary text-primary border border-primary" size="lg">Logout</Button>
        <p className="hidden">© {new Date().getFullYear()} Chatter</p>
      </div>
    </div>
    <TippniModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
