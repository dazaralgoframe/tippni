// src/components/feed/ReplyModal.tsx

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination } from "swiper/modules"
import "@/styles/swiper.css"
import { Heart, ImageIcon } from "lucide-react";

type ReplyModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (text: string, files: File[]) => void;
  replyingTo: string;
  avatarUrl?: string;
  mediaUrls?: string;
};

export default function ReplyModal({
  open,
  onClose,
  onSubmit,
  replyingTo,
  avatarUrl,
  mediaUrls
}: ReplyModalProps) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleFileSelect = (e: any) => {
    console.log('after image selected', e);
    
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    console.log('after image removed', index);

    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = () => {
    if (!text.trim() && images.length === 0) return;
    onSubmit(text, images);
    setText("");
    setImages([]);
    onClose();
  };
  console.log('ReplyModal props', replyingTo, avatarUrl, mediaUrls);
  console.log('ReplyModal length props', replyingTo, avatarUrl, mediaUrls?.length);
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-4 rounded-2xl max-w-xl bg-modal shadow-dropdown border-none">
        <DialogHeader>
          <p className="text-sm text-muted-foreground">
            Replying to <span className="text-accent">@{replyingTo}</span>
          </p>
        </DialogHeader>
        <div>

          {/* SINGLE IMAGE */}
          {mediaUrls && (
            <Image
              src={mediaUrls ?? ""}
              alt="Post media"
              width={100}
              height={40}
              quality={80}
            //   className="w-100"
            />
          )}
        </div>
        <div className="flex gap-3 mt-3">
          {/* User Avatar */}
          <Avatar className="size-10">
            <AvatarImage src={avatarUrl ?? "/images/default-avatar.png"} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          {/* Text Input + Images */}
          <div className="flex-1">
            <textarea
              className="w-full resize-none bg-transparent text-sm outline-none border-none"
              rows={3}
              placeholder="Post your reply"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {images.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <div className="relative group" key={index}>
                      <Image
                        src={url}
                        alt="uploaded"
                        width={300}
                        height={300}
                        className="rounded-xl object-cover w-full h-32"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Row: Upload + Submit */}
            <div className="flex items-center justify-between mt-3">
              <label className="cursor-pointer rounded-full hover:bg-accent/10 p-2 transition">
                <ImageIcon className="size-5 text-[var(--color-accent)]" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload image"
                />
              </label>
              <Button
                size="sm"
                className="px-4 bg-accent"
                onClick={submit}
                disabled={!text.trim() && images.length === 0}
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
