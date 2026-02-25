import { motion } from "framer-motion"
import { Home, Plus, CalendarCheck, BarChart3, User, Menu, X, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileNavigationProps {
  currentScreen: string
  onNavigate: (screen: string) => void
  className?: string
}

interface MobileSidebarProps {
  isOpen: boolean
  onToggle: () => void
  currentScreen: string
  onNavigate: (screen: string) => void
  onLogout: () => void
}

export function MobileNavigation(_props: MobileNavigationProps) {
  // Mobile bottom navigation is replaced by the hamburger side-menu to save vertical screen space.
  return null
}

export function MobileSidebar({
  isOpen,
  onToggle,
  currentScreen,
  onNavigate,
  onLogout
}: MobileSidebarProps) {
  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'deadlines', icon: CalendarCheck, label: 'Deadlines' },
    { id: 'add-deadline', icon: Plus, label: 'Add Deadline' },
    { id: 'smart-plan', icon: Brain, label: 'Smart Planning', highlight: true },
    { id: 'insights', icon: BarChart3, label: 'Insights' },
    { id: 'profile', icon: User, label: 'Profile' },
  ]

  return (
    <>
      {/* Floating Hamburger Button for Mobile */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="lg:hidden fixed top-3 left-4 z-40 p-2 rounded-lg bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 backdrop-blur-sm shadow-sm border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Overlay */}
      <motion.div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={onToggle}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Sidebar */}
      <motion.div
        className="fixed inset-y-0 left-0 z-50 w-[280px] bg-white dark:bg-gray-900 shadow-2xl lg:hidden border-r border-gray-200 dark:border-gray-800"
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">LoadSense</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item, index) => {
              const isActive = currentScreen === item.id
              const Icon = item.icon

              return (
                <motion.button
                  key={item.id}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors touch-target ${isActive
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary font-medium'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  onClick={() => {
                    onNavigate(item.id)
                    onToggle()
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </nav>

          {/* Logout Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <Button
              variant="outline"
              className="w-full touch-target border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={onLogout}
            >
              Logout
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

export function MobileMenuButton({ onToggle, className }: { onToggle: () => void, className?: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className={`lg:hidden touch-target ${className}`}
    >
      <Menu className="w-5 h-5" />
    </Button>
  )
}