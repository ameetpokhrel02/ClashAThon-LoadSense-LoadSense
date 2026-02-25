import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { TopNavbar } from "./top-navbar"

interface LayoutWrapperProps {
  children: React.ReactNode
  pattern: 'split' | 'sidebar' | 'centered' | 'grid'
  className?: string
}

export function LayoutWrapper({ children, pattern, className }: LayoutWrapperProps) {
  const baseClasses = "min-h-screen bg-[#F6FAFB] dark:bg-gray-950 text-gray-800 dark:text-white font-sans antialiased"

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
        "flex-1 flex items-center justify-center p-4 lg:p-8 bg-[#F6FAFB] dark:bg-gray-950 min-h-screen lg:min-h-auto",
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
  onNavigate?: (screen: string) => void
}

export function SidebarLayout({
  sidebar,
  content,
  sidebarClassName,
  contentClassName,
  mobileNavigation,
  onNavigate
}: SidebarLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block flex-shrink-0 min-h-screen", sidebarClassName)}>
        {sidebar}
      </div>

      {/* Main Content Area with Top Navbar */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar - only show when onNavigate is provided */}
        {onNavigate && <TopNavbar onNavigate={onNavigate} />}

        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-y-auto pb-20 lg:pb-0",
          contentClassName
        )}>
          {content}
        </main>
      </div>

      {/* Mobile Navigation */}
      {mobileNavigation && (
        <div className="lg:hidden">
          {mobileNavigation}
        </div>
      )}
    </div>
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
        "lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 p-4",
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
              className="touch-target p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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