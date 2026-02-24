import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernCardVariants = cva(
  "rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl",
        elevated: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-2xl hover:shadow-[0_25px_60px_-15px_rgba(255,116,0,0.2)]",
        outlined: "bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-[#ff7400]/40",
        gradient: "bg-gradient-to-br from-[#F6FAFB] dark:from-gray-900 to-[#F0F5F6] dark:to-gray-800 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl",
        glass: "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl glow-primary-hover",
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