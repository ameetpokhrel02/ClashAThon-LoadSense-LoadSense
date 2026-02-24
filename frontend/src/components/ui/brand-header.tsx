import * as React from "react"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import LoadSenseImage from "@/assets/Loadsense.png"

interface BrandHeaderProps {
  variant?: 'full' | 'compact' | 'minimal'
  showNavigation?: boolean
  currentScreen?: string
  className?: string
}

export function BrandHeader({ 
  variant = 'full', 
  showNavigation = false, 
  currentScreen,
  className 
}: BrandHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {variant === 'full' && (
        <div className="bg-primary/20 p-2 rounded-xl backdrop-blur-sm border border-primary/30">
          <img 
            src={LoadSenseImage} 
            alt="LoadSense" 
            className="w-8 h-8 object-contain"
          />
        </div>
      )}
      
      {variant === 'compact' && (
        <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/30">
          <img 
            src={LoadSenseImage} 
            alt="LoadSense" 
            className="w-6 h-6 object-contain"
          />
        </div>
      )}
      
      {variant === 'minimal' && (
        <img 
          src={LoadSenseImage} 
          alt="LoadSense" 
          className="w-6 h-6 object-contain"
        />
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