import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-oxide focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-red-oxide text-white hover:bg-rust",
        secondary:
          "border-transparent bg-beige-medium text-deep-brown hover:bg-warm-sand",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-deep-brown border-warm-sand",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
