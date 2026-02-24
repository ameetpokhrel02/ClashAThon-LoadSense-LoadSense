import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { 
  User, 
  Mail, 
  GraduationCap,
  Calendar,
  LogOut,
  Edit2,
  Shield,
  Bell,
  Moon,
  ChevronRight
} from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"

export default function ProfileScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const profileStats = [
    { label: 'Deadlines Completed', value: '24' },
    { label: 'Courses Enrolled', value: '5' },
    { label: 'Average Load', value: '65%' },
  ]

  const menuItems = [
    {
      icon: User,
      label: 'Edit Profile',
      description: 'Update your personal information',
      action: () => onNavigate('settings')
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage alert preferences',
      action: () => onNavigate('settings')
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Password and security settings',
      action: () => onNavigate('settings')
    },
    {
      icon: Moon,
      label: 'Appearance',
      description: 'Theme and display options',
      action: () => onNavigate('settings')
    }
  ]

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="profile"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-[#F6FAFB] dark:bg-gray-950 relative pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Profile</h1>
      </div>

      <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences.</p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ff7400] to-[#ff8c33] rounded-2xl flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0] || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {user?.firstName} {user?.lastName || 'User'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">Student</p>
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <Mail className="w-4 h-4" />
                  {user?.email || 'student@university.edu'}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-[#ff7400] hover:bg-[#ff7400]/10"
              onClick={() => onNavigate('settings')}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Academic Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ff7400]/10 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#ff7400]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Program</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Computer Science</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ff7400]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#ff7400]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Academic Year</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">3rd Year</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          {profileStats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <p className="text-2xl font-semibold text-gray-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={item.action}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 hover:border-red-300 rounded-xl py-6 font-medium"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>

        {/* App Info */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 pt-4">
          <p>LoadSense v1.0.0</p>
          <p className="mt-1">Built for Clash-a-Thon 2026</p>
        </div>
      </div>
    </div>
  )

  return (
    <LayoutWrapper pattern="sidebar">
      <SidebarLayout
        sidebar={sidebarContent}
        content={mainContent}
        mobileNavigation={
          <>
            <MobileNavigation
              currentScreen="profile"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="profile"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}
