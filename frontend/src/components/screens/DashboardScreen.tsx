import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Clock, AlertTriangle, Plus, Calendar } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"

export default function DashboardScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  // Sample workload data
  const weeklyIntensity = [
    { day: 'Mon', intensity: 20 },
    { day: 'Tue', intensity: 40 },
    { day: 'Wed', intensity: 85 }, // High intensity day
    { day: 'Thu', intensity: 60 },
    { day: 'Fri', intensity: 30 },
  ]

  const priorityDeadlines = [
    {
      title: "Neural Networks Project",
      course: "CS402: AI",
      dueDate: "In 2 days",
      impact: "High",
    },
    {
      title: "Database Normalization Quiz",
      course: "CS301: DB",
      dueDate: "Tomorrow, 10:00 AM",
      impact: "Medium",
    },
    {
      title: "Term Paper: Ethics in Tech",
      course: "HU305: Ethics",
      dueDate: "In 5 days",
      impact: "Medium",
    },
    {
      title: "Calculus III Problem Set",
      course: "MA301: Math",
      dueDate: "In 6 days",
      impact: "Low",
    },
    {
      title: "Final Lab Report",
      course: "PH202: Physics",
      dueDate: "Next Monday",
      impact: "High",
    }
  ]

  const hasRisk = true; // Example condition

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="dashboard"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-[#F6FAFB] relative pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-[#ff7400] to-[#ff7400]/90 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-white">Dashboard</h1>
        <Button
          onClick={() => onNavigate('add-deadline')}
          size="sm"
          className="bg-white/15 hover:bg-white/25 text-white rounded-lg backdrop-blur-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.firstName || 'Student'}</h1>
            <p className="text-sm text-gray-500 mt-1">Here's your workload overview for this week.</p>
          </div>
          <Button
            onClick={() => onNavigate('add-deadline')}
            className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg flex items-center gap-2 font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Deadline
          </Button>
        </div>
        {/* Alert Panel */}
        {hasRisk && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-50 text-red-600 rounded-xl p-4 flex items-center gap-3 border border-red-200"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">You may experience workload overload next week. Consider redistributing tasks.</span>
          </motion.div>
        )}

        {/* Top Section - Status Card */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Your Academic Load</h2>
              <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Moderate Risk
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Weekly Load Score</p>
                <p className="text-4xl font-semibold text-gray-800">65<span className="text-lg text-gray-400 font-normal">/100</span></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Middle Section - Workload Heatmap */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Workload Heatmap</h2>
            <div className="grid grid-cols-5 gap-3 md:gap-4 border border-gray-200 rounded-lg p-4 bg-gray-50/50">
              {weeklyIntensity.map((day) => {
                let bgColor = 'bg-green-500';
                if (day.intensity > 70) bgColor = 'bg-red-500';
                else if (day.intensity > 40) bgColor = 'bg-yellow-500';

                return (
                  <div key={day.day} className="flex flex-col items-center gap-2">
                    <div className="text-xs font-medium text-gray-500">{day.day}</div>
                    <div className="w-full h-24 md:h-28 bg-gray-100 rounded-lg relative overflow-hidden flex items-end border border-gray-200">
                      <div 
                        className={`w-full rounded-b-lg transition-all duration-500 ${bgColor}`}
                        style={{ height: `${day.intensity}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-5 text-xs text-gray-500">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Safe</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Busy</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Overload</div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section - Upcoming Deadlines */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {priorityDeadlines.map((task, index) => {
                let badgeColor = 'bg-green-100 text-green-700';
                if (task.impact === 'High') badgeColor = 'bg-red-100 text-red-700';
                else if (task.impact === 'Medium') badgeColor = 'bg-yellow-100 text-yellow-700';

                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-all bg-white gap-3 sm:gap-0">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#ff7400]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar className="w-4 h-4 text-[#ff7400]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm">{task.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{task.course}</p>
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
          </div>
        </motion.div>
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
