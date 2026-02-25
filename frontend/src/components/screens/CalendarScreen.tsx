import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { 
  Calendar, ChevronLeft, ChevronRight, 
  Loader2, Lightbulb, Target, TrendingUp, CalendarDays, RefreshCw,
  ArrowRight
} from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"
import { useDeadlineStore } from "@/store/deadlineStore"
import { api, handleApiError } from "@/lib/api"

// Type definitions
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

interface WeeklyLoadTrend {
  day: string
  capacity: number
  status: 'safe' | 'moderate' | 'overload'
}

interface MonthlySummary {
  totalDeadlines: number
  peakDays: number
  safeDays: number
  planAdherence: number
}

interface AiTip {
  message: string
  taskId: string
  taskTitle: string
  dueDate: string
  recommendedStartDate: string
}

interface CalendarStats {
  weeklyLoadTrend: WeeklyLoadTrend[]
  monthlySummary: MonthlySummary
  aiTip: AiTip | null
}

export default function CalendarScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarStats, setCalendarStats] = useState<CalendarStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)
  const { user, logout } = useAuthStore()
  const { deadlines, isLoading, loadDeadlines } = useDeadlineStore()

  useEffect(() => {
    loadDeadlines()
  }, [loadDeadlines])

  // Fetch calendar stats when month changes
  useEffect(() => {
    const fetchCalendarStats = async () => {
      setStatsLoading(true)
      try {
        const response = await api.get('/workload/calendar-stats', {
          params: {
            month: currentDate.getMonth(),
            year: currentDate.getFullYear()
          }
        })
        if (response.data.success) {
          setCalendarStats(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch calendar stats:', handleApiError(error))
      } finally {
        setStatsLoading(false)
      }
    }
    fetchCalendarStats()
  }, [currentDate])

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

  // Get risk color for a day
  const getDayRiskColor = (day: number) => {
    const events = getEventsForDay(day)
    if (events.length === 0) return null
    
    const hasHigh = events.some(e => e.risk === 'high')
    const hasMedium = events.some(e => e.risk === 'medium')
    
    if (hasHigh) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 ring-2 ring-red-300 dark:ring-red-700'
    if (hasMedium) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 ring-2 ring-yellow-300 dark:ring-yellow-700'
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-700'
  }

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && 
           calendarData.month === today.getMonth() && 
           calendarData.year === today.getFullYear()
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
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-[#ff7400]" />
              Workload Calendar
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
              Visualizing academic pressure for <span className="text-[#ff7400] font-medium">{calendarData.monthName}</span>
            </p>
          </div>
          <Button 
            onClick={() => onNavigate('add-deadline')}
            className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg font-medium shadow-sm flex items-center gap-2"
          >
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar View - Takes 3 columns on XL screens */}
          <div className="xl:col-span-3">
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
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 p-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Adjust for Monday start - empty cells */}
                  {Array.from({ length: calendarData.startingDay === 0 ? 6 : calendarData.startingDay - 1 }, (_, i) => (
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
                          transition-all duration-200 relative p-1
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
                        {/* Event badges */}
                        {dayEvents.length > 0 && !todayClass && (
                          <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                            {dayEvents.slice(0, 2).map((event, idx) => (
                              <span 
                                key={idx}
                                className={`text-[8px] px-1 rounded truncate max-w-full ${
                                  event.risk === 'high' ? 'bg-red-200 text-red-800' :
                                  event.risk === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                  'bg-green-200 text-green-800'
                                }`}
                              >
                                {event.title.length > 8 ? event.title.slice(0, 8) + '..' : event.title}
                              </span>
                            ))}
                            {dayEvents.length > 2 && (
                              <span className="text-[8px] text-gray-500">+{dayEvents.length - 2}</span>
                            )}
                          </div>
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
            </div>

            {/* AI Tip Banner */}
            {calendarStats?.aiTip && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 flex items-center gap-4"
              >
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full shrink-0">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">AI Tip:</span> {calendarStats.aiTip.message}
                  </p>
                </div>
                <Button 
                  onClick={() => onNavigate('smart-plan')}
                  className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
                >
                  View Plan
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            )}
          </div>

          {/* Right Panel - Workload Legend & Stats */}
          <div className="xl:col-span-1 space-y-4">
            {/* Workload Legend */}
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#ff7400]" />
                Workload Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 mt-1 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Safe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Optimal study hours. 0-40% of capacity used.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Moderate</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Active preparation. 41-75% of capacity used.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 mt-1 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">Overload</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Critical risk. &gt;75% capacity or high-impact cluster.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weekly Load Trend */}
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#ff7400]" />
                Weekly Load Trend
              </h3>
              
              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="space-y-3">
                  {(calendarStats?.weeklyLoadTrend || [
                    { day: 'Mon', capacity: 45, status: 'moderate' as const },
                    { day: 'Tue', capacity: 65, status: 'moderate' as const },
                    { day: 'Wed', capacity: 95, status: 'overload' as const },
                    { day: 'Thu', capacity: 80, status: 'overload' as const },
                    { day: 'Fri', capacity: 30, status: 'safe' as const },
                  ]).map((trend, index) => (
                    <div key={trend.day} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-8">{trend.day}</span>
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${trend.capacity}%` }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                          className={`h-full rounded-full ${
                            trend.status === 'overload' ? 'bg-red-500' :
                            trend.status === 'moderate' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                        />
                      </div>
                      <span className={`text-xs font-medium w-20 text-right ${
                        trend.status === 'overload' ? 'text-red-500' :
                        trend.status === 'moderate' ? 'text-yellow-600' :
                        'text-green-500'
                      }`}>
                        {trend.capacity}% Capacity
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {calendarStats?.weeklyLoadTrend?.some(t => t.status === 'overload') && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
                  * AI Forecast: Wednesday expects a 30% increase in prep time.
                </p>
              )}
            </motion.div>

            {/* Monthly Summary */}
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-5"
            >
              <h3 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4 uppercase tracking-wide">
                Monthly Summary
              </h3>
              
              {statsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {calendarStats?.monthlySummary?.totalDeadlines || deadlines.length || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Deadlines</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-500">
                      {calendarStats?.monthlySummary?.peakDays || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Peak Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {calendarStats?.monthlySummary?.safeDays || 0}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Safe Days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-500">
                      {calendarStats?.monthlySummary?.planAdherence || 0}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Plan Adherence</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sync to Calendar Button */}
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl py-6 font-medium shadow-lg shadow-green-500/25"
                onClick={() => {
                  alert('Sync to Google Calendar coming soon!')
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync to Calendar
              </Button>
            </motion.div>
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
