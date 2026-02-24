import { ModernCard } from "@/components/ui/modern-card"
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
    <div className="min-h-screen bg-gradient-to-br from-[#F6FAFB] via-[#EAF4F6] to-[#DCEFF2]">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b border-[#E2E8F0] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A]">Academic <span className="text-[#2A7A8C]">Calendar</span></h1>
            <p className="text-[#64748B]">Track your deadlines and events</p>
          </div>
          <Button 
            onClick={() => onNavigate('add-deadline')}
            className="btn-primary-glow rounded-lg"
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <ModernCard className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                September 2023
              </h2>
              
              {/* Simple Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
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
                        ${isCurrentMonth ? 'text-gray-900' : 'text-gray-300'}
                        ${isToday ? 'bg-primary text-white font-bold' : 'hover:bg-gray-100'}
                        ${hasEvent ? 'bg-red-100 text-red-800 font-semibold' : ''}
                      `}
                    >
                      {isCurrentMonth ? day : ''}
                    </div>
                  )
                })}
              </div>
            </ModernCard>
          </div>

          {/* Upcoming Events */}
          <div>
            <ModernCard className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Upcoming Events
              </h2>
              
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="border-l-4 border-primary pl-4 py-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {event.priority === 'high' && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          {event.priority === 'medium' && (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          )}
                          {event.priority === 'low' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          <span className="text-xs text-gray-500 capitalize">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ModernCard>
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