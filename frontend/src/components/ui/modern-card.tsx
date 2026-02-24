import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernCardVariants = cva(
  "rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white border-[#E2E8F0] shadow-xl hover:shadow-2xl",
        elevated: "bg-white border-[#E2E8F0] shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(42,122,140,0.2)]",
        outlined: "bg-white border-2 border-[#DCEFF2] hover:border-[#2A7A8C]/40",
        gradient: "bg-gradient-to-br from-[#EAF4F6] to-[#DCEFF2] border-[#E2E8F0] shadow-xl hover:shadow-2xl",
        glass: "bg-white/95 backdrop-blur-md border-[#E2E8F0] shadow-xl hover:shadow-2xl glow-primary-hover",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
)

interface ModernCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof modernCardVariants> {
  children: React.ReactNode
}

export function ModernCard({ 
  className, 
  variant, 
  padding, 
  children, 
  ...props 
}: ModernCardProps) {
  return (
    <div
      className={cn(modernCardVariants({ variant, padding }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { modernCardVariants }