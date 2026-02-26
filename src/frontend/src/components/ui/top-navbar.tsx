import { useState, useRef, useEffect } from "react"
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useWorkloadStore } from "@/store/workloadStore"
import { useRemindersStore } from "@/store/reminderStore"
import { useNotificationStore } from "@/store/notificationStore"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/ui/theme-toggle"

interface TopNavbarProps {
  onNavigate: (screen: string) => void
}

export function TopNavbar({ onNavigate }: TopNavbarProps) {
  const { user, logout } = useAuthStore()
  const { alerts } = useWorkloadStore()
  const { reminders } = useRemindersStore()
  const { isRead, markAsRead, markAllAsRead } = useNotificationStore()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  // Combine alerts and reminders into a single notifications array
  const notifications = [
    ...(alerts || []).map((alert, i) => {
      const id = `alert-${alert.week_start}-${i}`
      return {
        id,
        title: "Workload Alert",
        message: alert.message,
        time: "Recent",
        unread: !isRead(id),
        type: 'alert'
      }
    }),
    ...(reminders || []).map((reminder) => {
      const id = `reminder-${reminder._id}`
      return {
        id,
        title: "Deadline Approaching",
        message: `${reminder.course}: ${reminder.title} due soon`,
        time: new Date(reminder.dueDate).toLocaleDateString(),
        unread: !isRead(id),
        type: 'reminder'
      }
    })
  ]

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id)
    if (notification.type === 'alert') {
      onNavigate('insights')
    } else if (notification.type === 'reminder') {
      onNavigate('deadlines')
    }
    setIsNotificationOpen(false)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead(notifications.map(n => n.id))
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-end">
        {/* Right - Notifications & Profile */}

        <div className="flex items-center gap-2 md:gap-4">
          {/* Notification Bell */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileOpen(false) }}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0 ${notification.unread ? 'bg-[#ff7400]/5' : ''
                            }`}
                        >
                          <div className="flex items-start gap-3">
                            {notification.unread && (
                              <span className="w-2 h-2 bg-[#ff7400] rounded-full mt-2 flex-shrink-0" />
                            )}
                            <div className={notification.unread ? '' : 'ml-5'}>
                              <p className="text-sm font-medium text-gray-800 dark:text-white">{notification.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{notification.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-[#ff7400] hover:text-[#e66800] font-medium w-full text-center"
                    >
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Theme Toggle beside notification icon */}
          <div className="ml-2">
            <ThemeToggle variant="icon" />
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationOpen(false) }}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-[#ff7400] to-[#ff8c33] rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0] || 'U'}
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800 dark:text-white leading-tight">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{user?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-[#ff7400] to-[#ff8c33] rounded-lg flex items-center justify-center text-white font-semibold">
                          {user?.firstName?.[0]}{user?.lastName?.[0] || 'U'}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'Student'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => { setIsProfileOpen(false); onNavigate('profile') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>
                    <button
                      onClick={() => { setIsProfileOpen(false); onNavigate('settings') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
