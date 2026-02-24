import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LayoutWrapperProps {
  children: React.ReactNode
  pattern: 'split' | 'sidebar' | 'centered' | 'grid'
  className?: string
}

export function LayoutWrapper({ children, pattern, className }: LayoutWrapperProps) {
  const baseClasses = "min-h-screen bg-background text-foreground font-sans antialiased"
  
  const patternClasses = {
    split: "flex flex-col lg:flex-row",
    sidebar: "flex flex-col lg:flex-row",
    centered: "flex items-center justify-center p-4 lg:p-8",
    grid: "container mx-auto p-4 lg:p-8"
  }

  return (
    <div className={cn(baseClasses, patternClasses[pattern], className)}>
      {children}
    </div>
  )
}

interface SplitLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  leftPanelClassName?: string
  rightPanelClassName?: string
}

export function SplitLayout({ 
  leftPanel, 
  rightPanel, 
  leftPanelClassName, 
  rightPanelClassName 
}: SplitLayoutProps) {
  return (
    <>
      {/* Mobile: Hidden left panel, show compact version in right panel */}
      <div className={cn(
        "hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden",
        leftPanelClassName
      )}>
        <div className="relative z-10">
          {leftPanel}
        </div>
      </div>
      
      {/* Right panel - responsive */}
      <div className={cn(
        "flex-1 flex items-center justify-center p-4 lg:p-8 bg-background min-h-screen lg:min-h-auto",
        rightPanelClassName
      )}>
        <div className="w-full max-w-md">
          {rightPanel}
        </div>
      </div>
    </>
  )
}

interface SidebarLayoutProps {
  sidebar: React.ReactNode
  content: React.ReactNode
  sidebarClassName?: string
  contentClassName?: string
  mobileNavigation?: React.ReactNode
}

export function SidebarLayout({ 
  sidebar, 
  content, 
  sidebarClassName, 
  contentClassName,
  mobileNavigation
}: SidebarLayoutProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block", sidebarClassName)}>
        {sidebar}
      </div>
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto pb-20 lg:pb-0", // Add bottom padding for mobile nav
        contentClassName
      )}>
        {content}
      </main>
      
      {/* Mobile Navigation */}
      {mobileNavigation && (
        <div className="lg:hidden">
          {mobileNavigation}
        </div>
      )}
    </>
  )
}

interface ResponsiveContainerProps {
  children: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
  className?: string
}

export function ResponsiveContainer({ 
  children, 
  maxWidth = 'lg', 
  padding = true, 
  className 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full'
  }

  return (
    <motion.div 
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        padding && "px-4 lg:px-6",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

interface MobileHeaderProps {
  title: string
  onMenuToggle?: () => void
  actions?: React.ReactNode
  className?: string
}

export function MobileHeader({ title, onMenuToggle, actions, className }: MobileHeaderProps) {
  return (
    <motion.header 
      className={cn(
        "lg:hidden sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border p-4",
        className
      )}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="touch-target p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <h1 className="text-lg font-semibold text-responsive-lg">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </motion.header>
  )
}