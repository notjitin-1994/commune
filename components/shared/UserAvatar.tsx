"use client";

import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils/helpers";

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showStatus?: boolean;
  isOnline?: boolean;
}

export function UserAvatar({
  name,
  src,
  size = "md",
  className,
  showStatus = false,
  isOnline = false,
}: UserAvatarProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      <Avatar src={src} name={name} size={size} />
      {showStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
            isOnline ? "bg-sage" : "bg-warm-sand"
          )}
        />
      )}
    </div>
  );
}
