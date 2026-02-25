// ModernCard removed - using plain divs
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { Calendar, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"

export default function CalendarScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const upcomingEvents = [
    {
      id: 1,
      title: "CS301 Assignment Due",
      date: "2023-09-06",
      time: "11:59 PM",
      type: "assignment",
      priority: "high"
    },
    {
      id: 2,
      title: "Database Midterm Exam",
      date: "2023-09-08",
      time: "2:00 PM",
      type: "exam",
      priority: "high"
    },
    {
      id: 3,
      title: "Software Engineering Project",
      date: "2023-09-10",
      time: "5:00 PM",
      type: "project",
      priority: "medium"
    },
    {
      id: 4,
      title: "Study Group Meeting",
      date: "2023-09-05",
      time: "3:00 PM",
      type: "meeting",
      priority: "low"
    }
  ]

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="calendar"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-[#F6FAFB] dark:bg-gray-950 pb-20 md:pb-0">
      {/* Main Content */}
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Academic Calendar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">Track your deadlines and events</p>
          </div>
          <Button 
            onClick={() => onNavigate('add-deadline')}
            className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg font-medium shadow-sm flex items-center gap-2"
          >
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#ff7400]" />
                September 2023
              </h2>
              
              {/* Simple Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4 border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2; // Start from day 1 on Wednesday
                  const isCurrentMonth = day > 0 && day <= 30;
                  const isToday = day === 4;
                  const hasEvent = [6, 8, 10].includes(day);
                  
                  return (
                    <div
                      key={i}
                      className={`
                        aspect-square flex items-center justify-center text-sm rounded-lg cursor-pointer
                        ${isCurrentMonth ? 'text-gray-700' : 'text-gray-300'}
                        ${isToday ? 'bg-[#ff7400] text-white font-medium' : 'hover:bg-gray-100'}
                        ${hasEvent && !isToday ? 'bg-red-50 text-red-700 font-medium' : ''}
                      `}
                    >
                      {isCurrentMonth ? day : ''}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#ff7400]" />
                Upcoming Events
              </h2>
              
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="border-l-2 border-[#ff7400] pl-3 py-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm">{event.title}</h3>
                        <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {event.priority === 'high' && (
                            <AlertTriangle className="w-3 h-3 text-red-500" />
                          )}
                          {event.priority === 'medium' && (
                            <Clock className="w-3 h-3 text-yellow-500" />
                          )}
                          {event.priority === 'low' && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                          <span className="text-xs text-gray-400 capitalize">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
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
              currentScreen="calendar"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="calendar"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}