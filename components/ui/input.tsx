import * as React from "react";
import { cn } from "@/lib/utils/helpers";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-transparent bg-beige-light px-4 py-2 text-sm text-deep-brown transition-all duration-150",
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
Input.displayName = "Input";

export { Input };
