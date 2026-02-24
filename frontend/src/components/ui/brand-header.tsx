import { cn } from "@/lib/utils"
import { GraduationCap } from "lucide-react"

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
        <div className="bg-[#ff7400] p-2 rounded-xl">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
      )}
      
      {variant === 'compact' && (
        <div className="bg-[#ff7400] p-1.5 rounded-lg">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
      )}
      
      {variant === 'minimal' && (
        <div className="bg-[#ff7400] p-1 rounded-lg">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="flex flex-col">
        <span className={cn(
          "font-bold tracking-tight",
          variant === 'full' ? "text-2xl" : "text-xl",
          className?.includes('text-white') ? "text-white" : "text-primary"
        )}>
          LoadSense
        </span>
        {variant === 'full' && (
          <span className={cn(
            "text-xs",
            className?.includes('text-white') ? "text-white/80" : "text-muted-foreground"
          )}>
            Smart Workload Management
          </span>
        )}
      </div>
    </div>
  )
}