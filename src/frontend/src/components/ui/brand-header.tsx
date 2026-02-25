import { cn } from "@/lib/utils"
import logo from "@/assets/logo.png"

interface BrandHeaderProps {
  variant?: 'full' | 'compact' | 'minimal'
  className?: string
}

export function BrandHeader({
  variant = 'full',
  className
}: BrandHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {variant === 'full' && (
        <img src={logo} alt="LoadSense Logo" className="h-10 w-auto" />
      )}

      {variant === 'compact' && (
        <img src={logo} alt="LoadSense Logo" className="h-8 w-auto" />
      )}

      {variant === 'minimal' && (
        <img src={logo} alt="LoadSense Logo" className="h-6 w-auto" />
      )}
    </div>
  )
}