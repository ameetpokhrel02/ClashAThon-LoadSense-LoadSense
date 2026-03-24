import { cn } from "@/lib/utils"
import { Home, BookOpen, CalendarCheck, User, Plus } from "lucide-react"

interface MobileBottomNavProps {
  currentScreen: string
  onNavigate: (screen: string) => void
  disabled?: boolean
}

export function MobileBottomNav({ currentScreen, onNavigate, disabled = false }: MobileBottomNavProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'courses', icon: BookOpen, label: 'Modules' },
    // Center Floating Action Button (FAB)
    { id: 'add-deadline', icon: Plus, label: 'Add', isFab: true },
    { id: 'deadlines', icon: CalendarCheck, label: 'Deadlines' },
    { id: 'profile', icon: User, label: 'Account' },
  ]

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <div className="flex justify-around items-end h-16 relative px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id
          const Icon = item.icon

          if (item.isFab) {
            return (
              <div key={item.id} className="relative -top-5 px-2 flex justify-center">
                <button
                  onClick={() => !disabled && onNavigate(item.id)}
                  disabled={disabled}
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform touch-target",
                    "bg-[#ff7400] text-white hover:bg-[#e66800] active:scale-95",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6" />
                </button>
              </div>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => !disabled && onNavigate(item.id)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 pb-1 touch-target focus:outline-none transition-colors",
                isActive ? "text-[#ff7400]" : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="relative flex flex-col items-center">
                <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                {isActive && (
                  <span className="w-1 h-1 bg-[#ff7400] rounded-full absolute -bottom-3" />
                )}
              </div>
              <span className={cn("text-[10px] mt-1.5 font-medium", isActive && "font-semibold")}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
