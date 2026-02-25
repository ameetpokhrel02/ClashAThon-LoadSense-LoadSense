import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"
import { useWorkloadStore } from "@/store/workloadStore"

export default function InsightsScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { weeks, summary, alerts, isLoading, fetchWorkload, fetchSummary, fetchAlerts } = useWorkloadStore()

  useEffect(() => {
    fetchWorkload()
    fetchSummary()
    fetchAlerts()
  }, [fetchWorkload, fetchSummary, fetchAlerts])

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // Map weeks data to chart format
  const weeklyData = weeks.slice(0, 6).map((week, index) => {
    // Normalize load score to percentage (max 20)
    const loadPercent = Math.min((week.load_score / 20) * 100, 100)
    return {
      week: `Week ${index + 1}`,
      load: loadPercent,
      status: week.risk_level === 'critical' ? 'overload' : week.risk_level
    }
  })

  const currentWeekLoad = summary?.current_week ? Math.round((summary.current_week.load_score / 20) * 100) : 0
  const previousWeekLoad = weeks[1] ? Math.round((weeks[1].load_score / 20) * 100) : 0
  const loadChange = currentWeekLoad - previousWeekLoad
  const loadTrend = loadChange > 0 ? 'increasing' : 'decreasing'

  const riskLevel = summary?.current_week?.risk_level === 'critical' ? 'Overload' 
    : summary?.current_week?.risk_level === 'high' ? 'High'
    : summary?.current_week?.risk_level === 'moderate' ? 'Moderate' 
    : 'Safe'
  const riskColor = riskLevel === 'Overload' ? 'red' : riskLevel === 'High' ? 'orange' : riskLevel === 'Moderate' ? 'yellow' : 'green'

  const deadlineCount = summary?.current_week?.deadline_count || 0

  // Generate insights based on real data
  const insights = []
  if (alerts.length > 0) {
    insights.push({
      type: 'warning',
      title: 'High Workload Detected',
      message: alerts[0].message,
      icon: AlertTriangle,
      color: 'red'
    })
  }
  if (summary?.peak_week && summary.peak_week.load_score > 10) {
    insights.push({
      type: 'info',
      title: 'Peak Week Ahead',
      message: `Your busiest week has ${summary.peak_week.deadline_count} deadlines with a load score of ${summary.peak_week.load_score}.`,
      icon: Calendar,
      color: 'yellow'
    })
  }
  if (summary?.total_overload_weeks === 0) {
    insights.push({
      type: 'success',
      title: 'Good Progress',
      message: 'Your workload looks manageable. No overload weeks detected!',
      icon: CheckCircle,
      color: 'green'
    })
  }

  const getBarColor = (status: string) => {
    switch (status) {
      case 'overload': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'moderate': return 'bg-yellow-500'
      default: return 'bg-green-500'
    }
  }

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="insights"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-[#F6FAFB] dark:bg-gray-950 relative pb-20 md:pb-0">
      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Workload Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 hidden md:block">Predictive analysis to help you stay ahead of academic overload.</p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff7400]" />
          </div>
        )}

        {!isLoading && (
          <>
            {/* Alert Banner */}
            {riskLevel !== 'Safe' && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`rounded-xl p-4 flex items-start gap-3 border ${
                  riskLevel === 'Overload' 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' 
                    : riskLevel === 'High'
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400'
                }`}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">
                    {riskLevel === 'Overload' 
                      ? 'You are entering a high workload zone' 
                      : riskLevel === 'High'
                      ? 'High workload detected'
                      : 'Moderate workload detected'}
                  </p>
                  <p className="text-sm mt-1 opacity-80">
                    {riskLevel === 'Overload'
                      ? 'Consider postponing or delegating some tasks to avoid burnout.'
                      : 'Stay on track by managing your time effectively this week.'}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Current Load</span>
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{currentWeekLoad}%</p>
                <div className={`flex items-center gap-1 mt-1 text-xs ${loadChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {loadChange > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(loadChange)}% from last week
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Risk Status</span>
                  <Zap className={`w-4 h-4 ${riskColor === 'red' ? 'text-red-500' : riskColor === 'orange' ? 'text-orange-500' : riskColor === 'yellow' ? 'text-yellow-500' : 'text-green-500'}`} />
                </div>
                <p className={`text-2xl font-semibold ${riskColor === 'red' ? 'text-red-600' : riskColor === 'orange' ? 'text-orange-600' : riskColor === 'yellow' ? 'text-yellow-600' : 'text-green-600'}`}>{riskLevel}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on workload analysis</p>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Deadlines Due</span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{deadlineCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This week</p>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Overload Weeks</span>
                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{summary?.total_overload_weeks || 0}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upcoming</p>
              </motion.div>
            </div>

        {/* Workload Trend Graph */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Weekly Workload Trend</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Track your workload patterns over time</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              {loadTrend === 'increasing' ? (
                <>
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  <span className="text-red-600">Increasing</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Decreasing</span>
                </>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="relative">
            {/* Threshold Lines */}
            <div className="absolute left-0 right-0 top-[20%] border-t border-dashed border-red-300 dark:border-red-700 z-0">
              <span className="absolute -top-2.5 right-0 text-[10px] text-red-400 bg-white dark:bg-gray-900 px-1">Overload (80%)</span>
            </div>
            <div className="absolute left-0 right-0 top-[40%] border-t border-dashed border-yellow-300 dark:border-yellow-700 z-0">
              <span className="absolute -top-2.5 right-0 text-[10px] text-yellow-500 dark:text-yellow-400 bg-white dark:bg-gray-900 px-1">Moderate (60%)</span>
            </div>

            <div className="flex items-end justify-between gap-4 h-48 relative z-10">
              {weeklyData.map((week, index) => (
                <div key={week.week} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg relative overflow-hidden flex items-end">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${week.load}%` }}
                      transition={{ delay: 0.1 * index, duration: 0.5, ease: "easeOut" }}
                      className={`w-full rounded-t-lg ${getBarColor(week.status)}`}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{week.week.replace('Week ', 'W')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500"></span> Safe (&lt;60%)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-yellow-500"></span> Moderate (60-70%)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500"></span> High (70-80%)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-500"></span> Overload (&gt;80%)</div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-[#ff7400]/10 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#ff7400]" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Smart Insights</h2>
          </div>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  insight.color === 'red' 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                    : insight.color === 'yellow' 
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                    : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                }`}
              >
                <div className="flex items-start gap-3">
                  <insight.icon className={`w-5 h-5 flex-shrink-0 ${
                    insight.color === 'red' 
                      ? 'text-red-600 dark:text-red-400' 
                      : insight.color === 'yellow' 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : 'text-green-600 dark:text-green-400'
                  }`} />
                  <div>
                    <p className={`font-medium ${
                      insight.color === 'red' 
                        ? 'text-red-800 dark:text-red-300' 
                        : insight.color === 'yellow' 
                        ? 'text-yellow-800 dark:text-yellow-300' 
                        : 'text-green-800 dark:text-green-300'
                    }`}>{insight.title}</p>
                    <p className={`text-sm mt-0.5 ${
                      insight.color === 'red' 
                        ? 'text-red-700 dark:text-red-400' 
                        : insight.color === 'yellow' 
                        ? 'text-yellow-700 dark:text-yellow-400' 
                        : 'text-green-700 dark:text-green-400'
                    }`}>{insight.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-[#ff7400]/5 to-[#ff7400]/10 dark:from-[#ff7400]/10 dark:to-[#ff7400]/20 border border-[#ff7400]/20 dark:border-[#ff7400]/30 rounded-xl p-6"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#ff7400] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-800 dark:text-white">Pro Tip</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Break down large assignments into smaller tasks spread across multiple days. 
                This helps maintain a balanced workload and reduces last-minute stress.
              </p>
              <Button
                onClick={() => onNavigate('add-deadline')}
                className="mt-3 bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg text-sm"
                size="sm"
              >
                Plan Your Tasks
              </Button>
            </div>
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
              currentScreen="insights"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="insights"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}
