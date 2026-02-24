import { ModernCard } from "@/components/ui/modern-card"
import { Button } from "@/components/ui/button"
import { ModernInput } from "@/components/ui/modern-input"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { Settings, User, Bell, Shield, Palette, Globe } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-[#F6FAFB] via-[#EAF4F6] to-[#DCEFF2]">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b border-[#E2E8F0] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A]"><span className="text-[#2A7A8C]">Settings</span></h1>
            <p className="text-[#64748B]">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}
            >
              <ModernCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div>
                        <label className="text-sm font-medium text-gray-900">{item.label}</label>
                      </div>
                      
                      <div className="flex items-center">
                        {item.type === "text" || item.type === "email" ? (
                          <ModernInput
                            value={item.value as string}
                            type={item.type}
                            className="w-64"
                            readOnly
                          />
                        ) : item.type === "select" ? (
                          <select className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            <option>{item.value as string}</option>
                          </select>
                        ) : item.type === "toggle" ? (
                          <button
                            className={`
                              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                              ${item.value ? 'bg-primary' : 'bg-gray-200'}
                            `}
                          >
                            <span
                              className={`
                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                ${item.value ? 'translate-x-6' : 'translate-x-1'}
                              `}
                            />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </motion.div>
          ))}
          
          {/* Save Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-end"
          >
            <Button className="bg-primary hover:bg-primary/80 px-8">
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