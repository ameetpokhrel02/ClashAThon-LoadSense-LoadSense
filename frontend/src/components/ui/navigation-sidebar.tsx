import * as React from "react"
import { Button } from "@/components/ui/button"
import { BrandHeader } from "@/components/ui/brand-header"
import { LogoutDialog } from "@/components/ui/logout-dialog"
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar as CalendarIcon, 
  Settings, 
  LogOut,
  Plus,
  GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationSidebarProps {
  currentScreen: string
  onNavigate: (screen: string) => void
  user: { firstName?: string; lastName?: string } | null
  onLogout: () => void
  className?: string
}

export function NavigationSidebar({ 
  currentScreen, 
  onNavigate, 
  user, 
  onLogout,
  className 
}: NavigationSidebarProps) {
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: currentScreen === 'dashboard'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      active: currentScreen === 'courses'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: CalendarIcon,
      active: currentScreen === 'calendar'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      active: currentScreen === 'settings'
    }
  ]

  return (
    <>
      <aside className={cn(
        "w-64 bg-gradient-to-b from-[#2A7A8C] via-[#3B8FA1] to-[#1F5F6E] text-white flex flex-col shadow-2xl shadow-[#2A7A8C]/20 relative overflow-hidden",
        className
      )}>
        {/* Subtle glow overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />
        
        {/* Brand Header with Logo */}
        <div className="p-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 glass-card-dark rounded-xl flex items-center justify-center shadow-lg border border-white/20 glow-primary">
              <GraduationCap className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-white drop-shadow-sm">LoadSense</h2>
              <p className="text-xs text-white/80 font-medium">Smart Workload Management</p>
            </div>
          </div>
        </div>
        
        {/* Quick Action - Add Deadline */}
        <div className="px-6 mb-8 relative z-10">
          <Button 
            onClick={() => onNavigate('add-deadline')} 
            className="w-full gap-3 bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 hover:scale-[1.02] glow-primary"
          >
            <Plus className="w-5 h-5" />
            Add Deadline
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-3 relative z-10">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-4 text-white/90 hover:text-white hover:bg-white/15 rounded-xl py-4 px-4 transition-all duration-300 font-medium text-base group",
                  item.active && "bg-white/20 text-white font-semibold shadow-lg backdrop-blur-sm border border-white/10"
                )}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  item.active && "scale-110",
                  "group-hover:scale-110"
                )} />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-white/20 bg-white/5 backdrop-blur-sm relative z-10">
          {user && (
            <div className="mb-4 p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-base">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-white/80 text-sm font-medium">Student</p>
                </div>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-4 text-white/90 hover:text-white hover:bg-white/15 rounded-xl py-4 px-4 transition-all duration-300 font-medium group" 
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
            Logout
          </Button>
        </div>
      </aside>

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={onLogout}
      />
    </>
  )
}