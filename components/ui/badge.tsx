import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/helpers";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-red-oxide/10 text-red-oxide",
        secondary:
          "bg-beige-medium text-deep-brown",
        outline:
          "border border-warm-sand text-deep-brown",
        success:
          "bg-sage/10 text-sage",
        warning:
          "bg-tan/20 text-deep-brown",
        destructive:
          "bg-red-oxide/10 text-red-oxide",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
