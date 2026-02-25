import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { Calendar, Clock, Lightbulb, Target, RefreshCw, AlertTriangle, CheckCircle, Sparkles, TrendingUp, Brain, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"
import { api, handleApiError } from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { useWorkloadStore } from "@/store/workloadStore"

interface PriorityTask {
  id: string
  title: string
  course: string
  type: string
  dueDate: string
  formattedDueDate: string
  daysUntilDue: number
  estimatedHours: number
  adjustedWeight: number
  priority: "high" | "medium" | "low"
}

interface DayTask {
  task: string
  hours: number
  course?: string
}

interface WeeklyPlanDay {
  day: string
  date: string
  tasks: DayTask[]
  totalHours: number
}

interface StudyPlanData {
  workloadSummary: {
    riskLevel: "low" | "medium" | "high" | "critical"
    message: string
    totalTasks: number
    totalEstimatedHours: number
    totalAdjustedWeight: number
  }
  priorityTasks: PriorityTask[]
  aiSuggestions: string[]
  weeklyPlan: WeeklyPlanDay[]
  generatedAt: string
}

export default function SuggestionScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
  const { user, logout } = useAuthStore()
  const { summary, fetchSummary } = useWorkloadStore()

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const fetchStudyPlan = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post("/ai/suggestion")
      if (response.data.success) {
        setStudyPlan(response.data.data)
      } else {
        setError(response.data.message || "Failed to generate study plan")
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudyPlan()
    fetchSummary()
  }, [fetchSummary])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical": return "text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
      case "high": return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
      default: return "text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
    }
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "critical": return { label: "Critical", class: "bg-red-500 text-white" }
      case "high": return { label: "High Risk", class: "bg-orange-500 text-white" }
      case "medium": return { label: "Medium", class: "bg-yellow-500 text-white" }
      default: return { label: "Low", class: "bg-green-500 text-white" }
    }
  }

  const getDayStatus = (index: number, totalHours: number) => {
    if (index === 0) return "current"
    if (totalHours >= 5) return "peak"
    return "upcoming"
  }

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="suggestion"
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
              <Brain className="w-6 h-6 text-[#ff7400]" />
              AI Study Plan
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">Smart planning powered by AI</p>
          </div>
          <Button 
            onClick={fetchStudyPlan}
            disabled={loading}
            className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg font-medium shadow-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? "Generating..." : "Generate Plan"}
          </Button>
        </div>

        {/* Workload Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {studyPlan?.workloadSummary.totalTasks || summary?.current_week?.deadline_count || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Active Tasks</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {studyPlan?.workloadSummary.totalEstimatedHours || 0}h
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Hours</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                  {studyPlan?.workloadSummary.totalAdjustedWeight || summary?.current_week?.load_score || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Load Score</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`rounded-xl p-4 shadow-sm border ${
              studyPlan?.workloadSummary.riskLevel === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
              studyPlan?.workloadSummary.riskLevel === 'high' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' :
              studyPlan?.workloadSummary.riskLevel === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
              'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                studyPlan?.workloadSummary.riskLevel === 'critical' ? 'bg-red-200 dark:bg-red-800' :
                studyPlan?.workloadSummary.riskLevel === 'high' ? 'bg-orange-200 dark:bg-orange-800' :
                studyPlan?.workloadSummary.riskLevel === 'medium' ? 'bg-yellow-200 dark:bg-yellow-800' :
                'bg-green-200 dark:bg-green-800'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  studyPlan?.workloadSummary.riskLevel === 'critical' ? 'text-red-600 dark:text-red-300' :
                  studyPlan?.workloadSummary.riskLevel === 'high' ? 'text-orange-600 dark:text-orange-300' :
                  studyPlan?.workloadSummary.riskLevel === 'medium' ? 'text-yellow-600 dark:text-yellow-300' :
                  'text-green-600 dark:text-green-300'
                }`} />
              </div>
              <div>
                <p className={`text-lg font-bold capitalize ${
                  studyPlan?.workloadSummary.riskLevel === 'critical' ? 'text-red-700 dark:text-red-300' :
                  studyPlan?.workloadSummary.riskLevel === 'high' ? 'text-orange-700 dark:text-orange-300' :
                  studyPlan?.workloadSummary.riskLevel === 'medium' ? 'text-yellow-700 dark:text-yellow-300' :
                  'text-green-700 dark:text-green-300'
                }`}>
                  {studyPlan?.workloadSummary.riskLevel || 'Low'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Risk Level</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Loading State */}
        {loading && !studyPlan && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-xl shadow-sm"
          >
            <div className="relative">
              <Sparkles className="w-16 h-16 text-[#ff7400] animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 border-4 border-[#ff7400]/30 border-t-[#ff7400] rounded-full animate-spin" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-gray-800 dark:text-white">Generating Your Study Plan...</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">AI is analyzing your workload and deadlines</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 flex items-center gap-4"
          >
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-700 dark:text-red-300">Failed to Generate Plan</h4>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
            <Button onClick={fetchStudyPlan} variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Main Content Grid */}
        {studyPlan && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - AI Suggestions & Priority */}
            <div className="lg:col-span-1 space-y-6">
              {/* Risk Alert Card */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className={`shadow-lg border-2 ${getRiskColor(studyPlan.workloadSummary.riskLevel)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Lightbulb className="w-8 h-8 text-[#ff7400]" />
                      <Badge className={getRiskBadge(studyPlan.workloadSummary.riskLevel).class}>
                        {getRiskBadge(studyPlan.workloadSummary.riskLevel).label}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold mt-2">Workload Status</CardTitle>
                    <CardDescription className="text-sm">
                      {studyPlan.workloadSummary.message}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* AI Suggestions */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#ff7400]" />
                      AI Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {studyPlan.aiSuggestions.map((suggestion, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Priority Tasks */}
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#ff7400]" />
                      Priority Tasks
                    </CardTitle>
                    <CardDescription>Sorted by adjusted weight</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {studyPlan.priorityTasks.slice(0, 5).map((task, index) => (
                      <motion.div 
                        key={task.id}
                        initial={{ x: -5, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className={`p-3 rounded-lg border-l-4 ${
                          task.priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                          task.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                          'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-800 dark:text-gray-200 text-sm">{task.title}</h5>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{task.course} • {task.type}</p>
                          </div>
                          <Badge variant="outline" className="text-xs bg-white dark:bg-gray-800">
                            {task.daysUntilDue}d
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.estimatedHours}h
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            Weight: {task.adjustedWeight}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Weekly Timeline */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full shadow-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#ff7400]" />
                        Weekly Study Plan
                      </CardTitle>
                      <CardDescription>AI-optimized schedule to avoid burnout</CardDescription>
                    </div>
                    <Badge className="bg-[#ff7400]/10 text-[#ff7400] border-[#ff7400]/20 px-3 py-1">
                      Next {studyPlan.weeklyPlan.length} Days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {studyPlan.weeklyPlan.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No scheduled tasks for the upcoming days</p>
                      <Button 
                        variant="link" 
                        className="text-[#ff7400] mt-2"
                        onClick={() => onNavigate('add-deadline')}
                      >
                        Add a deadline
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {studyPlan.weeklyPlan.map((dayPlan, i) => {
                        const status = getDayStatus(i, dayPlan.totalHours)
                        return (
                          <motion.div 
                            key={i}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className={`p-5 flex items-start gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                              status === 'current' ? 'bg-[#ff7400]/5' : ''
                            }`}
                          >
                            <div className="w-20 shrink-0 text-right">
                              <h4 className={`font-bold ${status === 'current' ? 'text-[#ff7400]' : 'text-gray-800 dark:text-white'}`}>
                                {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayPlan.day}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{dayPlan.date}</p>
                            </div>
                            
                            <div className="relative flex flex-col items-center">
                              <div className={`w-4 h-4 rounded-full z-10 ${
                                status === 'current' ? 'bg-[#ff7400] ring-4 ring-[#ff7400]/20' : 
                                status === 'peak' ? 'bg-red-500 ring-4 ring-red-500/20' : 'bg-gray-300 dark:bg-gray-600'
                              }`}></div>
                              {i !== studyPlan.weeklyPlan.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 absolute top-4 bottom-[-20px]"></div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              {dayPlan.tasks.length === 0 ? (
                                <p className="text-gray-400 dark:text-gray-500 text-sm italic">No tasks scheduled</p>
                              ) : (
                                <div className="space-y-2">
                                  {dayPlan.tasks.map((task, j) => (
                                    <div key={j} className="flex justify-between items-start bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                      <div>
                                        <h4 className={`font-medium ${status === 'peak' ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                                          {task.task}
                                        </h4>
                                        {task.course && (
                                          <p className="text-xs text-gray-500 dark:text-gray-400">{task.course}</p>
                                        )}
                                      </div>
                                      <Badge variant="secondary" className="flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                        <Clock className="w-3 h-3 text-gray-500" />
                                        {task.hours}h
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              {status === 'current' && dayPlan.tasks.length > 0 && (
                                <Button size="sm" className="mt-3 bg-[#ff7400] hover:bg-[#e66800] text-white shadow-sm">
                                  Start Session
                                </Button>
                              )}
                              
                              {status === 'peak' && (
                                <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> 
                                  Heavy workload day ({dayPlan.totalHours}h). Plan ahead!
                                </p>
                              )}

                              {dayPlan.totalHours > 0 && (
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                  Total: {dayPlan.totalHours}h
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Generated timestamp */}
        {studyPlan && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            Generated at {new Date(studyPlan.generatedAt).toLocaleString()}
          </p>
        )}

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
              currentScreen="suggestion"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="suggestion"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}
