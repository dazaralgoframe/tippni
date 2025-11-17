'use client'

import { Check, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

type Language = {
  code: string
  label: string
  secondLabel: string
}

const languages: Language[] = [
  { code: 'en', label: 'English', secondLabel: 'English' },
  { code: 'hi', label: 'हिन्दी', secondLabel: 'Hindi' },
  { code: 'ta', label: 'தமிழ்', secondLabel: 'Tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ', secondLabel: 'Kannada' },
  { code: 'te', label: 'తెలుగు', secondLabel: 'Telugu' },
]

/**
 * ✅ Custom hook to handle language persistence + cross-tab sync
 */
const useLanguage = () => {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<string>("")

  useEffect(() => {
    // 1️⃣ Initialize from localStorage first
    const storedLang = localStorage.getItem("appLanguage")
    if (storedLang) {
      i18n.changeLanguage(storedLang)
      setCurrentLang(storedLang)
    } else {
      // fallback to browser
      const browserLang = navigator.language.split("-")[0]
      const supportedLang = languages.find(l => l.code === browserLang) ?? languages[0]
      i18n.changeLanguage(supportedLang.code)
      localStorage.setItem("appLanguage", supportedLang.code)
      setCurrentLang(supportedLang.code)
    }

    // 2️⃣ Keep sync with i18n (handles route changes / re-mounts)
    const handleLangChange = () => setCurrentLang(i18n.language)
    i18n.on("languageChanged", handleLangChange)

    // 3️⃣ Cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "appLanguage" && e.newValue) {
        i18n.changeLanguage(e.newValue)
      }
    }
    window.addEventListener("storage", handleStorage)

    return () => {
      i18n.off("languageChanged", handleLangChange)
      window.removeEventListener("storage", handleStorage)
    }
  }, [i18n])

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem("appLanguage", lang)
    setCurrentLang(lang)
  }

  return { currentLang, changeLanguage }
}

/**
 * ✅ Component 1: Fancy selector with checkmark
 */
export const LanguageSelect = () => {
  const { currentLang, changeLanguage } = useLanguage()

  return (
    <div className="max-w-md mx-auto mt-10 rounded-lg overflow-hidden shadow-xl bg-accent-secondary">
      {languages.map((lang, idx) => (
        <div
          key={lang.code}
          onClick={() => changeLanguage(lang.code)}
          className={`flex items-center justify-between px-4 py-4 border-b border-lite cursor-pointer ${
            idx === languages.length - 1 ? "border-none rounded-b-lg" : ""
          }`}
        >
          <span>
            {lang.label} ({lang.secondLabel})
          </span>
          <div
            className={`border rounded-full w-5 h-5 p-[3px] ${
              currentLang === lang.code
                ? "bg-blue-500 border-blue-500"
                : "border-gray-200"
            }`}
          >
            {currentLang === lang.code && (
              <Check className="text-gray-200 w-3 h-3 font-bold" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * ✅ Component 2: Simple <select> dropdown
 */
// const LanguageSwitch = () => {
//   const { currentLang, changeLanguage } = useLanguage()
//   const [open, setOpen] = useState(false)
//   const dropdownRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setOpen(false)
//       }
//     }
//     if (open) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [open])

//   const activeLang = languages.find((l) => l.code === currentLang)
//   return (
//     <div className="relative inline-block" ref={dropdownRef}>
//       <button
//         onClick={() => setOpen((prev) => !prev)}
//         className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent-primary-hex shadow-md hover:bg-accent cursor-pointer"
//       >
//         <Globe className="w-6 h-6 accent" />
//         <span className="text-sm font-medium text-primary">
//           {activeLang?.code.toUpperCase() || currentLang.toUpperCase()}
//         </span>
//       </button>

//       {open && (
//         <div className="absolute mt-2 w-56 rounded-lg overflow-hidden shadow-xl bg-accent-secondary z-10">
//           {languages.map((lang, idx) => (
//             <div
//               key={lang.code}
//               onClick={() => {
//                 changeLanguage(lang.code)
//                 setOpen(false)
//               }}
//               className={`flex items-center justify-between px-4 py-3 border-b border-lite cursor-pointer hover:bg-accent ${
//                 idx === languages.length - 1 ? "border-none rounded-b-lg" : ""
//               }`}
//             >
//               <span>
//                 {lang.label} ({lang.secondLabel})
//               </span>
//               <div
//                 className={`border rounded-full w-5 h-5 p-[3px] ${
//                   currentLang === lang.code
//                     ? "bg-blue-500 border-blue-500"
//                     : "border-gray-200"
//                 }`}
//               >
//                 {currentLang === lang.code && (
//                   <Check className="text-gray-200 w-3 h-3 font-bold" />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
const LanguageSwitch = () => {
  const { currentLang, changeLanguage } = useLanguage()
  const selectRef = useRef<HTMLSelectElement>(null)

  const handleButtonClick = () => {
    // trigger native select click
    if (selectRef.current) {
      selectRef.current.click()
    }
  }
  return (
    <div className="relative inline-flex items-center gap-2">
      {/* Globe button with code */}
      <button
        onClick={handleButtonClick}
        type="button"
        className="flex items-center gap-1 p-1 rounded-full bg-accent-primary-hex cursor-pointer"
      >
        <Globe className="w-6 h-6 accent" />
        <span className="text-sm font-medium accent uppercase">
          {currentLang}
        </span>
      </button>

      {/* Hidden native select */}
      <select
        ref={selectRef}
        id="language"
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.secondLabel}
          </option>
        ))}
      </select>
    </div>
  )
}

export default LanguageSwitch
