import * as React from "react";
import { cn } from "@/lib/utils/helpers";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full resize-none rounded-lg border border-transparent bg-beige-light px-4 py-3 text-sm text-deep-brown transition-all duration-150",
          "placeholder:text-taupe/60",
          "focus:border-red-oxide focus:outline-none focus:ring-2 focus:ring-red-oxide/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
