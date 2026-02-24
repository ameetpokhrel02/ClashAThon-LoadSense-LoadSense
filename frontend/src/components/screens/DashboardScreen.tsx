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
    <div className="min-h-screen bg-gray-100 relative pb-20 md:pb-0">
      {/* Floating Add Deadline Button */}
      <div className="absolute top-6 right-6 z-10 hidden md:block">
        <Button
          onClick={() => onNavigate('add-deadline')}
          className="bg-primary hover:bg-primary/80 text-white rounded-lg shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Deadline
        </Button>
      </div>

      {/* Mobile Header with Add Button */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-20">
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <Button
          onClick={() => onNavigate('add-deadline')}
          size="sm"
          className="bg-primary hover:bg-primary/80 text-white rounded-lg shadow-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 md:pt-20">
        {/* Alert Panel */}
        {hasRisk && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-red-100 text-red-600 rounded-lg p-4 flex items-center gap-3 shadow-sm"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm md:text-base">You may face overload next week.</span>
          </motion.div>
        )}

        {/* Top Section - Status Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Your Academic Load</h2>
              <div className="bg-gray-100 text-primary px-3 py-1 rounded-full text-xs md:text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Moderate
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Weekly Load Score</p>
                <p className="text-4xl font-bold text-gray-900">65<span className="text-lg text-gray-400 font-normal">/100</span></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Middle Section - Workload Heatmap */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Workload Heatmap</h2>
            <div className="grid grid-cols-5 gap-2 md:gap-4">
              {weeklyIntensity.map((day) => {
                let bgColor = 'bg-green-500';
                if (day.intensity > 70) bgColor = 'bg-red-500';
                else if (day.intensity > 40) bgColor = 'bg-yellow-500';

                return (
                  <div key={day.day} className="flex flex-col items-center gap-3">
                    <div className="text-xs md:text-sm font-medium text-gray-500">{day.day}</div>
                    <div className="w-full h-24 md:h-32 bg-gray-100 rounded-lg relative overflow-hidden flex items-end">
                      <div 
                        className={`w-full rounded-b-lg transition-all duration-500 ${bgColor}`}
                        style={{ height: `${day.intensity}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-4 md:gap-6 mt-6 text-xs md:text-sm text-gray-500">
              <div className="flex items-center gap-1.5 md:gap-2"><span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500"></span> Safe</div>
              <div className="flex items-center gap-1.5 md:gap-2"><span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500"></span> Busy</div>
              <div className="flex items-center gap-1.5 md:gap-2"><span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></span> Overload</div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section - Upcoming Deadlines */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Upcoming Deadlines</h2>
            <div className="space-y-4">
              {priorityDeadlines.map((task, index) => {
                let badgeColor = 'bg-green-100 text-green-700';
                if (task.impact === 'High') badgeColor = 'bg-red-100 text-red-700';
                else if (task.impact === 'Medium') badgeColor = 'bg-yellow-100 text-yellow-700';

                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-primary/20 hover:shadow-sm transition-all bg-gray-50/50 gap-4 sm:gap-0">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-500">{task.course}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
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
