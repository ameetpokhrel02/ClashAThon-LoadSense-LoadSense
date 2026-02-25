// ModernCard removed - using plain divs
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { Calendar, Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"
import { useDeadlineStore } from "@/store/deadlineStore"

// Local type definition
interface CalendarDeadline {
  _id?: string
  id?: string
  title: string
  course: string
  type: string
  dueDate: string
  estimatedHours: number
  risk: 'low' | 'medium' | 'high'
  notes?: string
}

export default function CalendarScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const { user, logout } = useAuthStore()
  const { deadlines, isLoading, fetchDeadlines } = useDeadlineStore()

  useEffect(() => {
    fetchDeadlines()
  }, [fetchDeadlines])

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // Calendar navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    return { year, month, daysInMonth, startingDay, monthName }
  }, [currentDate])

  // Map deadlines to calendar events
  const deadlinesByDate = useMemo(() => {
    const map: Record<string, CalendarDeadline[]> = {}
    deadlines.forEach((deadline: CalendarDeadline) => {
      const date = new Date(deadline.dueDate)
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      if (!map[key]) map[key] = []
      map[key].push(deadline)
    })
    return map
  }, [deadlines])

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const key = `${calendarData.year}-${calendarData.month}-${day}`
    return deadlinesByDate[key] || []
  }

  // Get risk color for a day (highest risk among events)
  const getDayRiskColor = (day: number) => {
    const events = getEventsForDay(day)
    if (events.length === 0) return null
    
    const hasHigh = events.some(e => e.risk === 'high')
    const hasMedium = events.some(e => e.risk === 'medium')
    
    if (hasHigh) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-2 ring-red-300 dark:ring-red-700'
    if (hasMedium) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 ring-2 ring-yellow-300 dark:ring-yellow-700'
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700'
  }

  // Get upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return deadlines
      .filter(d => {
        const dueDate = new Date(d.dueDate)
        return dueDate >= now && dueDate <= weekFromNow
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
  }, [deadlines])

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && 
           calendarData.month === today.getMonth() && 
           calendarData.year === today.getFullYear()
  }

  // Format date for display
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

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
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              {/* Calendar Header with Navigation */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff7400]" />
                  {calendarData.monthName}
                </h2>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={goToToday}
                    className="text-xs"
                  >
                    Today
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={goToPreviousMonth}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={goToNextMonth}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#ff7400]" />
                </div>
              )}

              {/* Calendar Grid */}
              {!isLoading && (
                <div className="grid grid-cols-7 gap-1 md:gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50/50 dark:bg-gray-800/50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 p-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Empty cells before first day */}
                  {Array.from({ length: calendarData.startingDay }, (_, i) => (
                    <div key={`empty-${i}`} className="aspect-square"></div>
                  ))}
                  
                  {/* Calendar Days */}
                  {Array.from({ length: calendarData.daysInMonth }, (_, i) => {
                    const day = i + 1
                    const dayEvents = getEventsForDay(day)
                    const riskColor = getDayRiskColor(day)
                    const todayClass = isToday(day)
                    
                    return (
                      <div
                        key={day}
                        className={`
                          aspect-square flex flex-col items-center justify-center text-sm rounded-lg cursor-pointer
                          transition-all duration-200 relative
                          ${todayClass 
                            ? 'bg-[#ff7400] text-white font-bold shadow-md' 
                            : riskColor 
                              ? riskColor 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }
                        `}
                        title={dayEvents.length > 0 ? `${dayEvents.length} event(s)` : ''}
                      >
                        <span className={todayClass ? 'font-bold' : 'font-medium'}>{day}</span>
                        {dayEvents.length > 0 && !todayClass && (
                          <span className="text-[10px] mt-0.5">{dayEvents.length}</span>
                        )}
                        {dayEvents.length > 0 && todayClass && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#ff7400] rounded-full text-[10px] font-bold flex items-center justify-center">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-200 dark:bg-red-800"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-yellow-200 dark:bg-yellow-800"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-200 dark:bg-green-800"></div>
                  <span>Low</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#ff7400]" />
                Upcoming (7 days)
              </h2>
              
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              )}

              {!isLoading && upcomingEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming events</p>
                  <Button 
                    variant="link" 
                    className="text-[#ff7400] text-sm mt-2"
                    onClick={() => onNavigate('add-deadline')}
                  >
                    Add a deadline
                  </Button>
                </div>
              )}
              
              {!isLoading && upcomingEvents.length > 0 && (
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event._id || event.id}
                      initial={{ x: 10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className={`border-l-4 pl-3 py-2 rounded-r-lg ${
                        event.risk === 'high' 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : event.risk === 'medium'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{event.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatEventDate(event.dueDate)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {event.risk === 'high' && (
                              <AlertTriangle className="w-3 h-3 text-red-500" />
                            )}
                            {event.risk === 'medium' && (
                              <Clock className="w-3 h-3 text-yellow-500" />
                            )}
                            {event.risk === 'low' && (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            )}
                            <span className="text-xs text-gray-400 capitalize">
                              {event.type} • {event.course}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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