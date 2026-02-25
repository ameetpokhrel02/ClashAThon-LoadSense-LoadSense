import * as React from "react"
import { Button } from "@/components/ui/button"
import { LogoutDialog } from "@/components/ui/logout-dialog"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  BarChart3,
  User,
  LogOut,
  Plus,
  Brain,
  CalendarDays
} from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@/assets/logo.png"

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
      id: 'calendar',
      label: 'Workload View',
      icon: CalendarDays,
      active: currentScreen === 'calendar'
    },
    {
      id: 'smart-plan',
      label: 'Smart Planning',
      icon: Brain,
      active: currentScreen === 'smart-plan' || currentScreen === 'suggestion',
      highlight: true
    },
    {
      id: 'deadlines',
      label: 'Deadlines',
      icon: CalendarCheck,
      active: currentScreen === 'deadlines'
    },
    {
      id: 'courses',
      label: 'Modules',
      icon: BookOpen,
      active: currentScreen === 'courses'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: BarChart3,
      active: currentScreen === 'insights'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      active: currentScreen === 'profile'
    }
  ]

  return (
    <>
      <aside className={cn(
        "hidden lg:flex w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col transition-colors duration-200 h-full min-h-screen",
        className
      )}>
        {/* Brand Header with Main Logo */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={logo} alt="Site Logo" className="w-16 h-16 rounded-xl shadow-sm object-contain bg-white dark:bg-gray-900 p-1" />
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Quick Action - Add Deadline */}
        <div className="px-6 mb-6">
          <Button
            onClick={() => onNavigate('add-deadline')}
            className="w-full gap-3 bg-[#ff7400] hover:bg-[#e66800] text-white border-0 rounded-xl py-3.5 font-medium transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add Deadline
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isHighlight = 'highlight' in item && item.highlight
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-gray-600 dark:text-gray-400 hover:text-[#ff7400] hover:bg-[#ff7400]/10 rounded-xl py-3 px-4 transition-all duration-200 font-medium text-sm",
                  item.active && "bg-[#ff7400]/10 text-[#ff7400] font-semibold",
                  isHighlight && !item.active && "bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/20 border border-orange-200 dark:border-orange-800/50"
                )}
                onClick={() => onNavigate(item.id)}
              >
                <Icon className={cn("w-5 h-5", item.active && "text-[#ff7400]", isHighlight && "text-[#ff7400]")} />
                {item.label}
                {isHighlight && !item.active && (
                  <span className="ml-auto text-[10px] bg-[#ff7400] text-white px-1.5 py-0.5 rounded-full font-bold">AI</span>
                )}
              </Button>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800">
          {user && (
            <div className="mb-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#ff7400]/20 rounded-full flex items-center justify-center font-medium text-[#ff7400] text-sm">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div>
                  <p className="text-gray-800 dark:text-white font-medium text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Student</p>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl py-3 px-4 transition-all duration-200 font-medium text-sm"
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