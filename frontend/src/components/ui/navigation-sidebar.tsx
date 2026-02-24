import * as React from "react"
import { Button } from "@/components/ui/button"
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
        "w-64 bg-gradient-to-b from-[#ff7400] to-[#ff7400]/85 text-white flex flex-col shadow-xl relative overflow-hidden",
        className
      )}>
        {/* Subtle glow overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/8 pointer-events-none" />
        
        {/* Brand Header with Logo */}
        <div className="p-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center shadow-sm border border-white/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg text-white">LoadSense</h2>
              <p className="text-xs text-white/70">Workload Management</p>
            </div>
          </div>
        </div>
        
        {/* Quick Action - Add Deadline */}
        <div className="px-6 mb-6 relative z-10">
          <Button 
            onClick={() => onNavigate('add-deadline')} 
            className="w-full gap-3 bg-white/15 hover:bg-white/25 text-white border-0 rounded-xl py-3.5 font-medium transition-all duration-200 backdrop-blur-sm border border-white/10"
          >
            <Plus className="w-5 h-5" />
            Add Deadline
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-2 relative z-10">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl py-3 px-4 transition-all duration-200 font-medium text-sm",
                  item.active && "bg-white/15 text-white font-semibold"
                )}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-white/15 bg-white/5 relative z-10">
          {user && (
            <div className="mb-4 p-3 rounded-xl bg-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-medium text-white text-sm">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-white/60 text-xs">Student</p>
                </div>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl py-3 px-4 transition-all duration-200 font-medium text-sm" 
            onClick={() => setShowLogoutDialog(true)}
          >
            <LogOut className="w-5 h-5" />
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