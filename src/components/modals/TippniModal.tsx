// src/components/modals/TippniModal.tsx

"use client"

import { useState } from "react"
import { X, ImageIcon, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { compressToUnder10KB, formatSize } from "@/utils/compressImage"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { createTippniPost } from "@/store/postSlice"

interface ComposeTweetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TippniModal({ open, onOpenChange }: ComposeTweetModalProps) {
  const [tweetText, setTweetText] = useState("")
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false)
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
  
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      return true;
    });
  
    setImageFiles((prev) => [...prev, ...validFiles]);
  
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handlePost = async () => {
    if (!tweetText.trim() && imageFiles.length === 0) {
      toast.error("Post cannot be empty");
      return;
    }
  
    if (!tweetText.trim() && !imageFiles) {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      setIsPosting(true);
      const formData = new FormData();
      const jsonBlob = new Blob(
        [JSON.stringify({ text: tweetText.trim() })],
        { type: "application/json" }
      );
      formData.append("request", jsonBlob);
      if (imageFiles.length > 0) {
        let summary = "📦 Compression Summary:\n\n";
      
        for (const file of imageFiles) {
          const original = formatSize(file.size);
      
          const compressed = await compressToUnder10KB(file);
      
          const compressedSize = formatSize(compressed.size);
      
          summary += `• ${file.name}: ${original} → ${compressedSize}\n`;
      
          formData.append("files", compressed);
        }
      
        toast.info(summary, { duration: 10000 });
      }
      
      const result = await dispatch(createTippniPost(formData)).unwrap();

      toast.success("Tippni posted successfully!");

      // Reset UI
      setTweetText("");
      setImageFiles([]);
      setImagePreviews([]);
      onOpenChange(false);
  
    } catch (err: any) {
      console.error("❌ Tippni post error:", err);
      toast.error(err?.message || "Failed to post Tippni");
    } finally {
      setIsPosting(false);
    }
  };
  
  const handleClose = () => {
    setTweetText("")
    setImageFiles([])
    setImagePreviews([])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border border-border bg-[var(--color-bg)] text-primary p-0">
        {/* Header */}
        <VisuallyHidden>
          <DialogTitle>Tippni Post</DialogTitle>
        </VisuallyHidden>

        <VisuallyHidden>
          <DialogDescription>Create a new Tippni post</DialogDescription>
        </VisuallyHidden>
        <div className="flex items-center justify-center border-b border-border px-4 py-3">
          <button
            onClick={handleClose}
            className="rounded-full hover:bg-secondary/50 p-2 transition hidden"
            aria-label="Close"
          >
            <X className="size-5 text-primary" />
          </button>
          <span className="text-sm font-semibold text-muted-foreground text-center">
            Tippni Post
          </span>
          <div className="w-8" />
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <div className="flex gap-4">
            <Avatar className="size-12">
              <AvatarImage src="/images/current-user-avatar.png" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              {/* Text input */}
              <Textarea
                placeholder="What's happening?!"
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                className="resize-none border-0 bg-transparent text-2xl placeholder:text-muted-foreground focus-visible:ring-0 p-0 min-h-24"
              />

          
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative rounded-2xl overflow-hidden bg-secondary">
                      <img src={preview} className="w-full h-auto object-cover" />

                      <button
                        onClick={() => {
                          setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                          setImageFiles((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-2 left-2 rounded-full bg-black/50 p-2 hover:bg-black/70"
                      >
                        <X className="size-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div className="flex gap-2">
                  <label className="cursor-pointer rounded-full hover:bg-accent/10 p-2 transition">
                    <ImageIcon className="size-5 text-[var(--color-accent)]" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      aria-label="Upload image"
                    />
                  </label>
                  <button className="rounded-full hover:bg-accent/10 p-2 transition">
                    <Heart className="size-5 text-[var(--color-accent)]" />
                  </button>
                </div>

                <Button
                  onClick={handlePost}
                  disabled={isPosting || (!tweetText.trim() && !imageFiles)}
                  size="lg"
                  className="rounded-full px-8 font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
