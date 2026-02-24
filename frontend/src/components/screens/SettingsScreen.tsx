// ModernCard removed - using plain divs
import { Button } from "@/components/ui/button"
import { ModernInput } from "@/components/ui/modern-input"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { User, Bell, Shield, Palette } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"

export default function SettingsScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const settingsSections = [
    {
      title: "Profile Settings",
      icon: User,
      items: [
        { label: "Full Name", value: `${user?.firstName || 'John'} ${user?.lastName || 'Doe'}`, type: "text" },
        { label: "Email", value: user?.email || "john.doe@university.edu", type: "email" },
        { label: "Student ID", value: "2023001", type: "text" },
        { label: "Year", value: "3rd Year", type: "select" }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Email Notifications", value: true, type: "toggle" },
        { label: "Push Notifications", value: true, type: "toggle" },
        { label: "Deadline Reminders", value: true, type: "toggle" },
        { label: "Weekly Summary", value: false, type: "toggle" }
      ]
    },
    {
      title: "Privacy & Security",
      icon: Shield,
      items: [
        { label: "Two-Factor Authentication", value: false, type: "toggle" },
        { label: "Data Sharing", value: false, type: "toggle" },
        { label: "Activity Tracking", value: true, type: "toggle" }
      ]
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { label: "Theme", value: "Light", type: "select" },
        { label: "Language", value: "English", type: "select" },
        { label: "Time Format", value: "12 Hour", type: "select" }
      ]
    }
  ]

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="settings"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-[#F6FAFB] dark:bg-gray-950">
      {/* Top Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.4 }}
            >
              <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 bg-[#ff7400]/10 rounded-lg flex items-center justify-center">
                    <section.icon className="w-4 h-4 text-[#ff7400]" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 dark:text-white">{section.title}</h2>
                </div>
                
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</label>
                      </div>
                      
                      <div className="flex items-center">
                        {item.type === "text" || item.type === "email" ? (
                          <ModernInput
                            label=""
                            value={item.value as string}
                            type={item.type}
                            className="w-64"
                            readOnly
                          />
                        ) : item.type === "select" ? (
                          <select className="w-32 px-3 py-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ff7400]/20 focus:border-[#ff7400]">
                            <option>{item.value as string}</option>
                          </select>
                        ) : item.type === "toggle" ? (
                          <button
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                              ${item.value ? 'bg-[#ff7400]' : 'bg-gray-200 dark:bg-gray-700'}
                            `}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                                ${item.value ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* Save Button */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex justify-end"
          >
            <Button className="bg-[#ff7400] hover:bg-[#e66800] text-white px-8 font-medium shadow-sm">
              Save Changes
            </Button>
          </motion.div>
        </div>
        
        {/* Footer */}
        <Footer variant="minimal" />
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
              currentScreen="settings"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="settings"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}