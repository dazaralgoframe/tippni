import { useRouter } from "next/navigation"
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

export default function BackButton () {
    const router = useRouter()
    const handleBack = () => {
      if (window.history.length > 1) {
        router.back()
      } else {
        // No valid history → fallback to home
        router.push("/")
      }
    }
    return (
        <Button variant="ghost" size="icon" onClick={handleBack} aria-label="Go back" className="cursor-pointer">
            <ArrowLeft className="size-5" aria-hidden />
        </Button>
    )
}