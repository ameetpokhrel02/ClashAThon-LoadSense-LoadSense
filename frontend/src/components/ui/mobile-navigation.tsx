import { motion } from "framer-motion"
import { Home, Plus, AlertTriangle, Lightbulb, Menu, X } from "lucide-react"
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

export function MobileNavigation({ currentScreen, onNavigate, className }: MobileNavigationProps) {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'add-deadline', icon: Plus, label: 'Add' },
    { id: 'overload-alert', icon: AlertTriangle, label: 'Alerts' },
    { id: 'suggestion', icon: Lightbulb, label: 'Tips' },
  ]

  return (
    <motion.div 
      className={`mobile-nav ${className}`}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex justify-around items-center">
        {navItems.map((item, index) => {
          const isActive = currentScreen === item.id
          const Icon = item.icon
          
          return (
            <motion.button
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
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
    { id: 'add-deadline', icon: Plus, label: 'Add Deadline' },
    { id: 'overload-alert', icon: AlertTriangle, label: 'Overload Alerts' },
    { id: 'suggestion', icon: Lightbulb, label: 'Suggestions' },
  ]

  return (
    <>
      {/* Overlay */}
      <motion.div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Sidebar */}
      <motion.div
        className={`sidebar-mobile ${isOpen ? 'open' : ''}`}
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">LoadSense</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/10"
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
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors touch-target ${
                    isActive 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
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