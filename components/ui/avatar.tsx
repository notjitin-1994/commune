import * as React from "react";
import { cn } from "@/lib/utils/helpers";
import { getInitials } from "@/lib/utils/helpers";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name = "", size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-xs",
      md: "w-10 h-10 text-sm",
      lg: "w-14 h-14 text-base",
      xl: "w-20 h-20 text-xl",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-navy-700 to-navy-600",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-semibold text-white">
            {getInitials(name)}
          </span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };
