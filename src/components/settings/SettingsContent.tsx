"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Lock, Bell, Eye, LogOut, Moon, Scale } from "lucide-react"
import ChangePasswordModal from "./ChangePasswordModal"
import DeactivateAccountModal from "./DeactivateAccountModal"
import DeleteAccountModal from "./DeleteAccountModal"
// import Enable2FAModal from "./Enable2FAModal"

interface SettingsContentProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function SettingsContent({ activeTab, onTabChange }: SettingsContentProps) {
  const [privateAccount, setPrivateAccount] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [textSize, setTextSize] = useState("medium")
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [enable2FAOpen, setEnable2FAOpen] = useState(false)
  const [deactivateAccountOpen, setDeactivateAccountOpen] = useState(false)
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false)
  const [readReceipt, setReadReceipt] = useState(false)

  const tabs = [
    { id: "account", label: "Account", icon: Lock },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "display", label: "Display", icon: Moon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "legal", label: "Legal", icon: Scale },
  ]

  return (
    <div className="">
      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 flex-1 px-4 py-3 text-sm font-medium transition cursor-pointer ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="size-4" aria-hidden />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {activeTab === "account" && (
          <div className="space-y-4">
            <Card className="p-4 gap-1 border-none bg-secondary">
              <h3 className="font-semibold mb-2">Account Information</h3>
              <p className="text-sm text-muted-foreground mb-1">Email: tippni@example.com</p>
              <p className="text-sm text-muted-foreground mb-2">Phone: +91 89898 98989</p>
              <Button variant="outline" className="w-full bg-transparent hidden">
                Change Email
              </Button>
            </Card>

            <Card className="p-4 gap-1 border-none bg-secondary">
              <h3 className="font-semibold mb-2">Password</h3>
              <p className="text-sm text-muted-foreground mb-4">Change your password any time (Last changed 3 months ago)</p>
              <Button variant="outline" className="w-fit bg-transparent rounded-full cursor-pointer" onClick={() => setChangePasswordOpen(true)}>
                Change Password
              </Button>
            </Card>

            <Card className="p-4 gap-1 border-none bg-secondary hidden">
              <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
              <Button variant="outline" className="w-fit bg-transparent rounded-full cursor-pointer" 
              onClick={() => setEnable2FAOpen(true)}
              >
                Enable 2FA
              </Button>
            </Card>

            <Card className="p-4 border-none bg-red-40 gap-1 bg-secondary">
              <h3 className="font-semibold mb-2">Deactivate Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once you deactivate your account, there is no going back. Please be certain.
              </p>
              <Button variant="outline" className="w-fit bg-transparent rounded-full text-red-400 cursor-pointer" onClick={()=>setDeactivateAccountOpen(true)}>
                Deactivate Account
              </Button>
            </Card>
            <Card className="p-4 border-none bg-red-400 gap-1">
              <h3 className="font-semibold mb-2 text-white">Delete Account</h3>
              <p className="text-sm mb-4 text-white">
                Once you delete your account, all data will erase permanently and you won't get it back.
              </p>
              <Button variant="outline" className="w-fit bg-transparent text-white rounded-full cursor-pointer" onClick={()=>setDeleteAccountOpen(true)}>
                Delete Account
              </Button>
            </Card>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="space-y-4">
            <Card className="p-4 gap-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Private Account</h3>
                <Switch checked={privateAccount} onCheckedChange={setPrivateAccount} className="bg-accent" />
              </div>
              <p className="text-sm text-muted-foreground">
                When your account is private, only people you approve can follow you and see your posts.
              </p>
            </Card>

            <Card className="p-4 gap-1">
              <h3 className="font-semibold mb-2">Blocked Users</h3>
              <p className="text-sm text-muted-foreground mb-4">You have blocked 0 users</p>
              <Button variant="outline" className="w-fit bg-transparent rounded-full">
                Manage Blocked Users
              </Button>
            </Card>

            <Card className="p-4 gap-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Show read receipts</h3>
                <Switch checked={readReceipt} onCheckedChange={setReadReceipt} className="bg-accent" />
              </div>
              <p className="text-sm text-muted-foreground">
                Let people you’re messaging with know when you’ve seen their messages. Read receipts are not shown on message requests
              </p>
            </Card>

            <Card className="p-4 hidden">
              <h3 className="font-semibold mb-2">Muted Words</h3>
              <p className="text-sm text-muted-foreground mb-4">You have muted 0 words</p>
              <Button variant="outline" className="w-full bg-transparent">
                Manage Muted Words
              </Button>
            </Card>

            <Card className="p-4 hidden">
              <h3 className="font-semibold mb-2">Allow Messages From</h3>
              <p className="text-sm text-muted-foreground mb-4">Currently: Everyone</p>
              <Button variant="outline" className="w-full bg-transparent">
                Change Settings
              </Button>
            </Card>
          </div>
        )}

        {activeTab === "display" && (
        //   <div className="space-y-4">
        //     <Card className="p-4">
        //       <div className="flex items-center justify-between mb-2">
        //         <h3 className="font-semibold">Dark Mode</h3>
        //         <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        //       </div>
        //       <p className="text-sm text-muted-foreground">
        //         Adjust the appearance of Chatter to reduce glare and eye strain.
        //       </p>
        //     </Card>

        //     <Card className="p-4">
        //       <h3 className="font-semibold mb-3">Text Size</h3>
        //       <div className="space-y-2">
        //         {["small", "medium", "large"].map((size) => (
        //           <label key={size} className="flex items-center gap-3 cursor-pointer">
        //             <input
        //               type="radio"
        //               name="textSize"
        //               value={size}
        //               checked={textSize === size}
        //               onChange={(e) => setTextSize(e.target.value)}
        //               className="w-4 h-4"
        //             />
        //             <span className="capitalize text-sm">{size}</span>
        //           </label>
        //         ))}
        //       </div>
        //     </Card>

        //     <Card className="p-4">
        //       <h3 className="font-semibold mb-2">Color Theme</h3>
        //       <div className="flex gap-2">
        //         {["Blue", "Purple", "Green"].map((color) => (
        //           <button
        //             key={color}
        //             className={`w-8 h-8 rounded-full border-2 ${
        //               color === "Blue"
        //                 ? "border-primary bg-blue-500"
        //                 : color === "Purple"
        //                   ? "border-gray-300 bg-purple-500"
        //                   : "border-gray-300 bg-green-500"
        //             }`}
        //             aria-label={`${color} theme`}
        //           />
        //         ))}
        //       </div>
        //     </Card>
        //   </div>
        <></>
        )}

        {activeTab === "notifications" && (
        //   <div className="space-y-4">
        //     <Card className="p-4">
        //       <div className="flex items-center justify-between mb-2">
        //         <h3 className="font-semibold">Email Notifications</h3>
        //         <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
        //       </div>
        //       <p className="text-sm text-muted-foreground">Receive email updates about your account activity</p>
        //     </Card>

        //     <Card className="p-4">
        //       <h3 className="font-semibold mb-3">Notification Types</h3>
        //       <div className="space-y-3">
        //         {[
        //           { label: "Likes", description: "When someone likes your post" },
        //           { label: "Replies", description: "When someone replies to your post" },
        //           { label: "Follows", description: "When someone follows you" },
        //           { label: "Mentions", description: "When someone mentions you" },
        //         ].map((notif) => (
        //           <div key={notif.label} className="flex items-center justify-between">
        //             <div>
        //               <p className="text-sm font-medium">{notif.label}</p>
        //               <p className="text-xs text-muted-foreground">{notif.description}</p>
        //             </div>
        //             <Switch defaultChecked />
        //           </div>
        //         ))}
        //       </div>
        //     </Card>
        //   </div>
        <></>
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t hidden">
        <Button variant="outline" className="w-fit bg-transparent rounded-full" size="lg">
          <LogOut className="mr-2 size-4" aria-hidden />
          Log Out
        </Button>
      </div>
      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      {/* <Enable2FAModal open={enable2FAOpen} onOpenChange={setEnable2FAOpen} /> */}
      <DeactivateAccountModal open={deactivateAccountOpen} onOpenChange={setDeactivateAccountOpen} />
      <DeleteAccountModal open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen} />
    </div>
  )
}
