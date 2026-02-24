import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const modernCardVariants = cva(
  "rounded-xl border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card border-border shadow-sm hover:shadow-md",
        elevated: "bg-card border-border shadow-lg hover:shadow-xl",
        outlined: "bg-card border-2 border-border hover:border-primary/30",
        gradient: "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm hover:shadow-md",
        glass: "bg-card/80 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md",
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