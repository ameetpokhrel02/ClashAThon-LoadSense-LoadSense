import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Clock, AlertTriangle, Plus, Calendar, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"
import { useWorkloadStore } from "@/store/workloadStore"

export default function DashboardScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { summary, alerts, isLoading, fetchSummary, fetchAlerts } = useWorkloadStore()

  // Fetch workload data on mount
  useEffect(() => {
    fetchSummary()
    fetchAlerts()
  }, [fetchSummary, fetchAlerts])

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // Helper to get risk color/label
  const getRiskDisplay = (riskLevel: string | undefined) => {
    switch (riskLevel) {
      case 'critical':
        return { color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400', label: 'Critical Risk', dotColor: 'bg-red-500' }
      case 'high':
        return { color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400', label: 'High Risk', dotColor: 'bg-orange-500' }
      case 'moderate':
        return { color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', label: 'Moderate Risk', dotColor: 'bg-yellow-500' }
      default:
        return { color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', label: 'Low Risk', dotColor: 'bg-green-500' }
    }
  }

  // Map upcoming weeks to heatmap format (show first 5 days/weeks)
  const weeklyIntensity = summary?.upcoming_weeks?.slice(0, 5).map((week, index) => {
    const weekLabel = index === 0 ? 'This' : index === 1 ? 'Next' : `Wk ${index + 1}`
    // Normalize load score to percentage (assuming max of 20)
    const intensity = Math.min((week.load_score / 20) * 100, 100)
    return { day: weekLabel, intensity, riskLevel: week.risk_level }
  }) || []

  // Get deadlines from current week and upcoming weeks
  const priorityDeadlines = summary?.upcoming_weeks?.flatMap(week => 
    week.deadlines?.map(deadline => ({
      title: deadline.title,
      course: deadline.course_id?.course_code || 'General',
      dueDate: new Date(deadline.due_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      impact: deadline.impact_level || 'Medium',
    })) || []
  ).slice(0, 5) || []

  const hasRisk = alerts.length > 0
  const currentWeekRisk = getRiskDisplay(summary?.current_week?.risk_level)
  const loadScore = summary?.current_week?.load_score || 0

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="dashboard"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-[#F6FAFB] dark:bg-gray-950 relative pb-20 md:pb-0 transition-colors duration-200">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Welcome back, {user?.firstName || 'Student'}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 hidden md:block">Here's your workload overview for this week.</p>
          </div>
          <Button
            onClick={() => onNavigate('add-deadline')}
            className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg flex items-center gap-2 font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Deadline</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff7400]" />
          </div>
        )}

        {/* Alert Panel */}
        {hasRisk && alerts[0] && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl p-4 flex items-center gap-3 border border-red-200 dark:border-red-800 cursor-pointer"
            onClick={() => onNavigate('overload-alert')}
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{alerts[0].message}</span>
          </motion.div>
        )}

        {!isLoading && (
          <>
            {/* Top Section - Status Card */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Academic Load</h2>
                  <div className={`${currentWeekRisk.color} px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full ${currentWeekRisk.dotColor}`}></span>
                    {currentWeekRisk.label}
                  </div>
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Weekly Load Score</p>
                    <p className="text-4xl font-semibold text-gray-800 dark:text-white">{loadScore}<span className="text-lg text-gray-400 font-normal">/20</span></p>
                  </div>
                  {summary?.total_overload_weeks && summary.total_overload_weeks > 0 && (
                    <div className="ml-auto text-right">
                      <p className="text-sm text-red-500 font-medium">{summary.total_overload_weeks} overload week{summary.total_overload_weeks > 1 ? 's' : ''} ahead</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Middle Section - Workload Heatmap */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Upcoming Weeks Heatmap</h2>
                {weeklyIntensity.length > 0 ? (
                  <div className="grid grid-cols-5 gap-3 md:gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50/50 dark:bg-gray-800/50">
                    {weeklyIntensity.map((week) => {
                      let bgColor = 'bg-green-500';
                      if (week.riskLevel === 'critical') bgColor = 'bg-red-500';
                      else if (week.riskLevel === 'high') bgColor = 'bg-orange-500';
                      else if (week.riskLevel === 'moderate') bgColor = 'bg-yellow-500';

                      return (
                        <div key={week.day} className="flex flex-col items-center gap-2">
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">{week.day}</div>
                          <div className="w-full h-24 md:h-28 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden flex items-end border border-gray-200 dark:border-gray-700">
                            <div 
                              className={`w-full rounded-b-lg transition-all duration-500 ${bgColor}`}
                              style={{ height: `${Math.max(week.intensity, 10)}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>No workload data yet. Add deadlines to see your workload heatmap.</p>
                  </div>
                )}
                <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Safe</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Moderate</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High</div>
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical</div>
                </div>
              </div>
            </motion.div>

            {/* Bottom Section - Upcoming Deadlines */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Upcoming Deadlines</h2>
                {priorityDeadlines.length > 0 ? (
                  <div className="space-y-3">
                    {priorityDeadlines.map((task, index) => {
                      let badgeColor = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
                      if (task.impact === 'High' || task.impact === 'high') badgeColor = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
                      else if (task.impact === 'Medium' || task.impact === 'medium') badgeColor = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';

                      return (
                        <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all bg-white dark:bg-gray-800 gap-3 sm:gap-0">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#ff7400]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Calendar className="w-4 h-4 text-[#ff7400]" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white text-sm">{task.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.course}</p>
                              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
                                <Clock className="w-3 h-3" />
                                {task.dueDate}
                              </div>
                            </div>
                          </div>
                          <div className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                            {task.impact} Impact
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No upcoming deadlines. Add some to get started!</p>
                    <Button
                      onClick={() => onNavigate('add-deadline')}
                      className="mt-4 bg-[#ff7400] hover:bg-[#e66800] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Deadline
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
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
              currentScreen="dashboard"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="dashboard"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}
