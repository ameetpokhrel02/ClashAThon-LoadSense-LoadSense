import { Button } from "@/components/ui/button"
import { ModernInput } from "@/components/ui/modern-input"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { User, Bell, Shield, Palette, Camera, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"

export default function SettingsScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user, logout, updateProfile, isLoadingProfile, fetchProfile } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [address, setAddress] = useState(user?.address || '')
  const [ward, setWard] = useState(user?.ward || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setPhone(user.phone || '')
      setAddress(user.address || '')
      setWard(user.ward || '')
      setAvatarPreview(user.avatar || null)
    }
  }, [user])

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setAvatarError("Only JPG, JPEG, or PNG files under 2MB are allowed.");
        setAvatarFile(null);
        setAvatarPreview(null);
        return;
      }
      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setAvatarError("Only JPG, JPEG, or PNG files under 2MB are allowed.");
        setAvatarFile(null);
        setAvatarPreview(null);
        return;
      }
      setAvatarError(null);
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    setSaveMessage(null)
    
    try {
      const formData = new FormData()
      formData.append('firstName', firstName)
      formData.append('lastName', lastName)
      formData.append('phone', phone)
      formData.append('address', address)
      formData.append('ward', ward)
      
      if (avatarFile) {
        formData.append('avatar', avatarFile)
      }
      
      await updateProfile(formData)
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' })
      setAvatarFile(null)
    } catch {
      setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setIsSaving(false)
    }
  }

  const settingsSections = [
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
    <div className="min-h-screen bg-[#F6FAFB] dark:bg-gray-950 pb-20 md:pb-0">
      {/* Main Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Settings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">Manage your account and preferences</p>
          </div>
          
          {/* Profile Settings - Editable Form */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0, duration: 0.4 }}
          >
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-[#ff7400]/10 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-[#ff7400]" />
                </div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white">Profile Settings</h2>
              </div>
              
              {/* Avatar Upload */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-[#ff7400] to-[#ff8c33] rounded-2xl flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
                      {firstName?.[0]}{lastName?.[0] || 'U'}
                    </div>
                  )}
                  <button
                    onClick={handleAvatarClick}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#ff7400] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#e66800] transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Profile Photo</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Click to upload a new photo</p>
                  {avatarError && (
                    <p className="text-xs text-red-600 mt-1">{avatarError}</p>
                  )}
                </div>
              </div>
              
              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModernInput
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    id="firstName"
                    name="firstName"
                  />
                  <ModernInput
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    id="lastName"
                    name="lastName"
                  />
                </div>
                <ModernInput
                  label="Email"
                  value={user?.email || ''}
                  type="email"
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                  id="email"
                  name="email"
                  autoComplete="email"
                />
                <ModernInput
                  label="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Enter your phone number"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                />
                <ModernInput
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  type="text"
                  placeholder="Enter your address"
                  id="address"
                  name="address"
                  autoComplete="street-address"
                />
                <ModernInput
                  label="Ward"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  type="text"
                  placeholder="Enter your ward"
                  id="ward"
                  name="ward"
                />
              </div>
            </div>
          </motion.div>

          {/* Other Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: (sectionIndex + 1) * 0.1, duration: 0.4 }}
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
                        {item.type === "select" ? (
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

          {/* Save Message */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                saveMessage.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              {saveMessage.text}
            </motion.div>
          )}
          
          {/* Save Button */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex justify-end"
          >
            <Button 
              onClick={handleSaveChanges}
              disabled={isSaving || isLoadingProfile}
              className="bg-[#ff7400] hover:bg-[#e66800] text-white px-8 font-medium shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
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
        onNavigate={onNavigate}
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