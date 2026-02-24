import { ModernCard } from "@/components/ui/modern-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { Search, Bell, Clock, CheckCircle, AlertTriangle, TrendingUp, Eye, Plus } from "lucide-react"
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
    { day: 'MON', date: 'Oct 23', intensity: 20 },
    { day: 'TUE', date: 'Oct 24', intensity: 40 },
    { day: 'WED', date: 'Oct 25', intensity: 85 }, // High intensity day
    { day: 'THU', date: 'Oct 26', intensity: 60 },
    { day: 'FRI', date: 'Oct 27', intensity: 30 },
    { day: 'SAT', date: 'Oct 28', intensity: 15 },
    { day: 'SUN', date: 'Oct 29', intensity: 10 }
  ]

  const priorityDeadlines = [
    {
      taskName: "Neural Networks Project",
      course: "CS402: AI",
      deadline: "In 2 days",
      impact: "High",
      color: "bg-red-500"
    },
    {
      taskName: "Database Normalization Quiz",
      course: "CS301: DB",
      deadline: "Tomorrow, 10:00 AM",
      impact: "Medium",
      color: "bg-yellow-500"
    },
    {
      taskName: "Term Paper: Ethics in Tech",
      course: "HU305: Ethics",
      deadline: "In 5 days",
      impact: "Medium",
      color: "bg-yellow-500"
    },
    {
      taskName: "Calculus III Problem Set",
      course: "MA301: Math",
      deadline: "In 6 days",
      impact: "Low",
      color: "bg-green-500"
    },
    {
      taskName: "Final Lab Report",
      course: "PH202: Physics",
      deadline: "Next Monday",
      impact: "High",
      color: "bg-red-500"
    }
  ]

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="dashboard"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.firstName?.[0] || 'A'}{user?.lastName?.[0] || 'S'}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName || 'Alex'} {user?.lastName || 'Student'}
                </p>
                <p className="text-xs text-gray-500">3rd year</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Section with Stats */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.firstName || 'Alex'}</h1>
              <p className="text-gray-600">You have 3 deadlines approaching this week. Let's stay ahead.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">TODAY'S LOAD</span>
                </div>
                <p className="text-xl font-bold text-gray-900">2.5 Hours</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">COMPLETED</span>
                </div>
                <p className="text-xl font-bold text-gray-900">12 Tasks</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Weekly Intensity & Deadlines */}
          <div className="lg:col-span-3 space-y-6">
            {/* Weekly Intensity Heatmap */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ModernCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Weekly Intensity Heatmap</h2>
                    <p className="text-sm text-gray-600">Visualizing your daily cognitive commitment</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-200 rounded"></div>
                      <span>Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded"></div>
                      <span>High</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-4">
                  {weeklyIntensity.map((day, index) => (
                    <div key={day.day} className="text-center">
                      <div className="text-xs font-medium text-gray-600 mb-2">{day.day}</div>
                      <div
                        className={`
                          w-full h-32 rounded-lg flex items-end justify-center p-2 transition-all duration-300 hover:scale-105
                          ${day.intensity > 70 ? 'bg-red-400' :
                            day.intensity > 40 ? 'bg-yellow-300' :
                              'bg-green-200'}
                        `}
                      >
                        <div
                          className="w-full bg-white/30 rounded"
                          style={{ height: `${day.intensity}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{day.date}</div>
                    </div>
                  ))}
                </div>
              </ModernCard>
            </motion.div>

            {/* Priority Deadlines Table */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ModernCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Priority Deadlines</h2>
                    <p className="text-sm text-gray-600">Upcoming assignments and exams sorted by due date</p>
                  </div>
                  <Button
                    onClick={() => onNavigate('add-deadline')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Task Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Deadline</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Impact</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priorityDeadlines.map((task, index) => (
                        <motion.tr
                          key={index}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4 font-medium text-gray-900">{task.taskName}</td>
                          <td className="py-4 px-4 text-gray-600">{task.course}</td>
                          <td className="py-4 px-4 text-gray-600">{task.deadline}</td>
                          <td className="py-4 px-4">
                            <Badge className={`${task.color} text-white px-2 py-1 text-xs`}>
                              {task.impact}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ModernCard>
            </motion.div>
          </div>

          {/* Right Column - Risk Status */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <ModernCard className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">RISK STATUS</h3>
                  <h2 className="text-xl font-bold text-yellow-600">Moderate Overload</h2>
                </div>

                <div className="space-y-4 text-sm text-gray-600 mb-6">
                  <p>Wednesday shows significant cognitive load with 3 major deadlines.</p>
                  <p>Consider starting your Neural Networks project today to avoid Thursday's crunch.</p>
                </div>

                <Button
                  onClick={() => onNavigate('suggestion')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Suggestions →
                </Button>
              </ModernCard>
            </motion.div>

            {/* AI Strategy Tip */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ModernCard className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-2">AI Strategy Tip</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Break your Neural Networks project into 2-hour chunks over the next 3 days to maintain quality.
                    </p>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      onClick={() => onNavigate('suggestion')}
                    >
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              </ModernCard>
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
