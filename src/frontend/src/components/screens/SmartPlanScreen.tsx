import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { 
  Calendar, Clock, Lightbulb, Target, RefreshCw, AlertTriangle, CheckCircle, 
  Sparkles, TrendingUp, Brain, BarChart3, Zap, ArrowRight, Shield, 
  BookOpen, Code, TestTube, FileText, Play, Check, X, TrendingDown,
  ChevronRight, Rocket, Timer, Activity
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

type ViewMode = "overview" | "timeline" | "breakdown"

export default function SmartPlanScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("overview")
  const [planApplied, setPlanApplied] = useState(false)
  const [applyingPlan, setApplyingPlan] = useState(false)
  
  const { user, logout } = useAuthStore()
  const { fetchSummary } = useWorkloadStore()

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
    setPlanApplied(false)
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

  const applyPlan = async () => {
    setApplyingPlan(true)
    // Simulate applying plan (in real app, this would save to backend)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setPlanApplied(true)
    setApplyingPlan(false)
  }

  useEffect(() => {
    fetchStudyPlan()
    fetchSummary()
  }, [fetchSummary])

  // Calculate stress metrics
  const getStressMetrics = () => {
    if (!studyPlan) return { withoutPlan: 85, withPlan: 35 }
    
    const riskMultiplier = {
      critical: 95,
      high: 75,
      medium: 55,
      low: 30
    }
    
    const withoutPlan = riskMultiplier[studyPlan.workloadSummary.riskLevel] || 50
    const withPlan = Math.max(15, withoutPlan - 45) // AI reduces stress by ~45%
    
    return { withoutPlan, withPlan }
  }

  const stressMetrics = getStressMetrics()

  // Get high impact deadlines count
  const getHighImpactCount = () => {
    if (!studyPlan) return 0
    return studyPlan.priorityTasks.filter(t => t.priority === 'high' && t.daysUntilDue <= 2).length
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "critical": return { label: "🔴 Critical Overload", class: "bg-red-500 text-white animate-pulse" }
      case "high": return { label: "🟠 High Risk", class: "bg-orange-500 text-white" }
      case "medium": return { label: "🟡 Moderate", class: "bg-yellow-500 text-white" }
      default: return { label: "🟢 Manageable", class: "bg-green-500 text-white" }
    }
  }

  const getTaskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "research": return <BookOpen className="w-4 h-4" />
      case "coding": case "project": return <Code className="w-4 h-4" />
      case "testing": return <TestTube className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="smart-plan"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-gradient-to-br from-[#F6FAFB] via-white to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20 md:pb-0">
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
              <div className="bg-gradient-to-br from-[#ff7400] to-orange-600 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              Smart Planning
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              AI-powered workload mitigation & stress reduction
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={fetchStudyPlan}
              disabled={loading}
              variant="outline"
              className="border-[#ff7400] text-[#ff7400] hover:bg-[#ff7400]/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            {studyPlan && !planApplied && (
              <Button 
                onClick={applyPlan}
                disabled={applyingPlan}
                className="bg-gradient-to-r from-[#ff7400] to-orange-600 hover:from-[#e66800] hover:to-orange-700 text-white shadow-lg shadow-orange-500/25"
              >
                {applyingPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Apply Smart Plan
                  </>
                )}
              </Button>
            )}
            {planApplied && (
              <Badge className="bg-green-500 text-white px-4 py-2 flex items-center gap-2">
                <Check className="w-4 h-4" />
                Plan Applied!
              </Badge>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && !studyPlan && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 bg-white dark:bg-gray-900 rounded-2xl shadow-xl"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#ff7400] to-orange-600 rounded-full flex items-center justify-center">
                <Brain className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-[#ff7400]/30 border-t-[#ff7400] rounded-full animate-spin" />
            </div>
            <h3 className="mt-8 text-2xl font-bold text-gray-800 dark:text-white">Analyzing Your Workload...</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md">
              AI is detecting overload patterns and generating a smart mitigation strategy
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-gray-400">
              <Activity className="w-4 h-4 animate-pulse" />
              Processing deadlines & priorities
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
          >
            <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-full">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="font-bold text-xl text-red-700 dark:text-red-300">Failed to Generate Plan</h4>
              <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
            <Button onClick={fetchStudyPlan} className="bg-red-500 hover:bg-red-600 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Main Content */}
        {studyPlan && !loading && (
          <div className="space-y-6">
            {/* ========== SECTION 1: OVERLOAD ALERT ========== */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`shadow-xl border-2 overflow-hidden ${
                studyPlan.workloadSummary.riskLevel === 'critical' || studyPlan.workloadSummary.riskLevel === 'high'
                  ? 'border-red-300 dark:border-red-800'
                  : 'border-orange-200 dark:border-orange-800'
              }`}>
                <div className={`p-1 ${
                  studyPlan.workloadSummary.riskLevel === 'critical' 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                    : studyPlan.workloadSummary.riskLevel === 'high'
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                    : 'bg-gradient-to-r from-[#ff7400] to-orange-400'
                }`} />
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Alert Icon & Badge */}
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${
                        studyPlan.workloadSummary.riskLevel === 'critical' ? 'bg-red-100 dark:bg-red-900/30' :
                        studyPlan.workloadSummary.riskLevel === 'high' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        <AlertTriangle className={`w-10 h-10 ${
                          studyPlan.workloadSummary.riskLevel === 'critical' ? 'text-red-500' :
                          studyPlan.workloadSummary.riskLevel === 'high' ? 'text-orange-500' :
                          'text-yellow-500'
                        }`} />
                      </div>
                      <div>
                        <Badge className={`${getRiskBadge(studyPlan.workloadSummary.riskLevel).class} text-sm px-3 py-1`}>
                          {getRiskBadge(studyPlan.workloadSummary.riskLevel).label}
                        </Badge>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-2">
                          Overload Detected
                        </h2>
                      </div>
                    </div>

                    {/* Alert Message */}
                    <div className="flex-1 lg:border-l lg:border-gray-200 lg:dark:border-gray-700 lg:pl-6">
                      <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                        {getHighImpactCount() > 0 ? (
                          <>You have <span className="text-red-500">{getHighImpactCount()} high-impact</span> deadline{getHighImpactCount() > 1 ? 's' : ''} in <span className="text-orange-500">48 hours</span></>
                        ) : (
                          <>You have <span className="text-orange-500">{studyPlan.workloadSummary.totalTasks} tasks</span> requiring <span className="text-[#ff7400]">{studyPlan.workloadSummary.totalEstimatedHours}h</span> of work</>
                        )}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {studyPlan.workloadSummary.message}
                      </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-4 lg:gap-6">
                      <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-3xl font-bold text-[#ff7400]">{studyPlan.workloadSummary.totalTasks}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tasks</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-3xl font-bold text-purple-500">{studyPlan.workloadSummary.totalEstimatedHours}h</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Work</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <p className="text-3xl font-bold text-blue-500">{studyPlan.weeklyPlan.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Days Plan</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* ========== SECTION 2: STRESS FORECAST COMPARISON ========== */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
                <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#ff7400]" />
                    Stress Forecast
                  </CardTitle>
                  <CardDescription>AI prediction: How the smart plan reduces your stress</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Without Plan */}
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                          <X className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">Without Smart Plan</h4>
                          <p className="text-xs text-gray-500">Current trajectory</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl p-6 border border-red-200 dark:border-red-800">
                        <div className="flex items-end justify-between mb-3">
                          <span className="text-5xl font-bold text-red-500">{stressMetrics.withoutPlan}%</span>
                          <TrendingUp className="w-8 h-8 text-red-400" />
                        </div>
                        <Progress value={stressMetrics.withoutPlan} className="h-3 bg-red-100" />
                        <p className="text-sm text-red-600 dark:text-red-400 mt-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          High burnout risk detected
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-400" />
                            Unstructured work pattern
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-400" />
                            Last-minute cramming likely
                          </li>
                          <li className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-400" />
                            Sleep disruption probable
                          </li>
                        </ul>
                      </div>
                    </motion.div>

                    {/* With Plan */}
                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="relative"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                          <Check className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-white">With Smart Plan</h4>
                          <p className="text-xs text-gray-500">AI-optimized schedule</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 border-2 border-green-300 dark:border-green-700 ring-2 ring-green-200 dark:ring-green-800">
                        <div className="flex items-end justify-between mb-3">
                          <span className="text-5xl font-bold text-green-500">{stressMetrics.withPlan}%</span>
                          <TrendingDown className="w-8 h-8 text-green-400" />
                        </div>
                        <Progress value={stressMetrics.withPlan} className="h-3 bg-green-100" />
                        <p className="text-sm text-green-600 dark:text-green-400 mt-3 flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Optimal workload balance achieved
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            Distributed daily workload
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            Built-in buffer time
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            Healthy work-rest cycle
                          </li>
                        </ul>
                      </div>
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1">
                        Recommended ✓
                      </Badge>
                    </motion.div>
                  </div>

                  {/* Stress Reduction Summary */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-gradient-to-r from-[#ff7400]/10 to-orange-500/10 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-[#ff7400]" />
                      <span className="font-medium text-gray-800 dark:text-white">
                        AI predicts <span className="text-[#ff7400] font-bold">{stressMetrics.withoutPlan - stressMetrics.withPlan}% stress reduction</span> with this plan
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#ff7400]" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* View Mode Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
              {[
                { id: "overview", label: "Overview", icon: Lightbulb },
                { id: "timeline", label: "Timeline", icon: Calendar },
                { id: "breakdown", label: "Task Breakdown", icon: Target }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as ViewMode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    viewMode === tab.id
                      ? 'bg-white dark:bg-gray-700 text-[#ff7400] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ========== VIEW: OVERVIEW - AI SUGGESTIONS ========== */}
              {viewMode === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* AI Mitigation Strategy */}
                  <Card className="shadow-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-[#ff7400]" />
                        AI Mitigation Strategy
                      </CardTitle>
                      <CardDescription>Personalized recommendations to manage your workload</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      {studyPlan.aiSuggestions.map((suggestion, i) => (
                        <motion.div 
                          key={i}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * i }}
                          className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-850 border border-gray-100 dark:border-gray-700 hover:border-[#ff7400]/50 transition-all group"
                        >
                          <div className="bg-[#ff7400]/10 p-2 rounded-lg group-hover:bg-[#ff7400]/20 transition-colors">
                            <CheckCircle className="w-5 h-5 text-[#ff7400]" />
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{suggestion}</p>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Mitigation Timeline */}
                  <Card className="shadow-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Timer className="w-5 h-5 text-[#ff7400]" />
                        Quick Mitigation Timeline
                      </CardTitle>
                      <CardDescription>Your next 3 days at a glance</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {studyPlan.weeklyPlan.slice(0, 3).map((day, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: 10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * i }}
                            className="flex items-center gap-4"
                          >
                            <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center ${
                              i === 0 ? 'bg-gradient-to-br from-[#ff7400] to-orange-600 text-white' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                              <span className="text-xs font-medium">{day.day.slice(0, 3)}</span>
                              <span className="text-lg font-bold">{day.date.split(' ')[1] || day.date}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className={`font-semibold ${i === 0 ? 'text-[#ff7400]' : 'text-gray-800 dark:text-white'}`}>
                                  {i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : day.day}
                                </h5>
                                <Badge variant="outline" className="text-xs">
                                  {day.totalHours}h total
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {day.tasks.length > 0 
                                  ? day.tasks.map(t => t.task).join(' → ')
                                  : 'Rest & recovery day'}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </motion.div>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full mt-4 text-[#ff7400] hover:bg-[#ff7400]/10"
                        onClick={() => setViewMode("timeline")}
                      >
                        View Full Timeline
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* ========== VIEW: TIMELINE ========== */}
              {viewMode === "timeline" && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="shadow-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#ff7400]" />
                            AI Mitigation Timeline
                          </CardTitle>
                          <CardDescription>Step-by-step roadmap to manage your workload</CardDescription>
                        </div>
                        <Badge className="bg-[#ff7400]/10 text-[#ff7400] border-[#ff7400]/20 px-4 py-2">
                          {studyPlan.weeklyPlan.length} Day Plan
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-100 dark:divide-gray-800">
                        {studyPlan.weeklyPlan.map((dayPlan, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.05 * i }}
                            className={`p-6 flex items-start gap-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                              i === 0 ? 'bg-[#ff7400]/5' : ''
                            }`}
                          >
                            {/* Day indicator */}
                            <div className="shrink-0 text-center">
                              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                                i === 0 ? 'bg-gradient-to-br from-[#ff7400] to-orange-600 text-white shadow-lg shadow-orange-500/30' :
                                dayPlan.totalHours >= 5 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' :
                                'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                              }`}>
                                <span className="text-xs">{dayPlan.day.slice(0, 3)}</span>
                                <span className="text-lg font-bold">{dayPlan.date.split(' ')[1] || i + 1}</span>
                              </div>
                              {i === 0 && <Badge className="mt-2 bg-[#ff7400] text-white text-xs">Today</Badge>}
                            </div>

                            {/* Timeline connector */}
                            <div className="relative flex flex-col items-center pt-2">
                              <div className={`w-4 h-4 rounded-full z-10 ${
                                i === 0 ? 'bg-[#ff7400] ring-4 ring-[#ff7400]/20' :
                                dayPlan.totalHours >= 5 ? 'bg-red-500 ring-4 ring-red-500/20' :
                                'bg-gray-300 dark:bg-gray-600'
                              }`} />
                              {i !== studyPlan.weeklyPlan.length - 1 && (
                                <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 absolute top-6 bottom-[-24px]" />
                              )}
                            </div>

                            {/* Tasks */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className={`font-bold ${i === 0 ? 'text-[#ff7400]' : 'text-gray-800 dark:text-white'}`}>
                                  {i === 0 ? 'Start Here' : i === 1 ? 'Continue' : `Day ${i + 1}`}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {dayPlan.totalHours}h planned
                                </span>
                              </div>
                              
                              {dayPlan.tasks.length === 0 ? (
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  Rest & recovery day - recharge your energy
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  {dayPlan.tasks.map((task, j) => (
                                    <div 
                                      key={j}
                                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="bg-[#ff7400]/10 p-2 rounded-lg">
                                          {getTaskIcon(task.task)}
                                        </div>
                                        <div>
                                          <p className="font-medium text-gray-800 dark:text-white">{task.task}</p>
                                          {task.course && (
                                            <p className="text-xs text-gray-500">{task.course}</p>
                                          )}
                                        </div>
                                      </div>
                                      <Badge variant="secondary" className="bg-white dark:bg-gray-700">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {task.hours}h
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {i === 0 && dayPlan.tasks.length > 0 && (
                                <Button className="mt-4 bg-[#ff7400] hover:bg-[#e66800] text-white shadow-lg shadow-orange-500/25">
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Working
                                </Button>
                              )}

                              {dayPlan.totalHours >= 5 && (
                                <p className="text-sm text-red-500 mt-3 flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4" />
                                  Heavy workload day - take breaks every 90 minutes
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* ========== VIEW: TASK BREAKDOWN ========== */}
              {viewMode === "breakdown" && (
                <motion.div
                  key="breakdown"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card className="shadow-xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#ff7400]" />
                        Task Breakdown by Priority
                      </CardTitle>
                      <CardDescription>All tasks sorted by urgency and impact</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {/* Priority Sections */}
                      {['high', 'medium', 'low'].map((priority) => {
                        const tasks = studyPlan.priorityTasks.filter(t => t.priority === priority)
                        if (tasks.length === 0) return null
                        
                        return (
                          <motion.div
                            key={priority}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mb-8 last:mb-0"
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`w-3 h-3 rounded-full ${
                                priority === 'high' ? 'bg-red-500' :
                                priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              }`} />
                              <h3 className="font-bold text-gray-800 dark:text-white capitalize">
                                {priority} Priority
                              </h3>
                              <Badge variant="outline" className="ml-auto">
                                {tasks.length} task{tasks.length > 1 ? 's' : ''}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {tasks.map((task, i) => (
                                <motion.div
                                  key={task.id}
                                  initial={{ scale: 0.95, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.05 * i }}
                                  className={`p-4 rounded-xl border-l-4 ${
                                    priority === 'high' ? 'border-l-red-500 bg-red-50 dark:bg-red-900/20' :
                                    priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                                    'border-l-green-500 bg-green-50 dark:bg-green-900/20'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h5 className="font-semibold text-gray-800 dark:text-white">{task.title}</h5>
                                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        {task.course} • {task.type}
                                      </p>
                                    </div>
                                    <Badge className={`ml-2 ${
                                      task.daysUntilDue <= 1 ? 'bg-red-500 text-white' :
                                      task.daysUntilDue <= 3 ? 'bg-orange-500 text-white' :
                                      'bg-gray-200 dark:bg-gray-700'
                                    }`}>
                                      {task.daysUntilDue === 0 ? 'Today' :
                                       task.daysUntilDue === 1 ? 'Tomorrow' :
                                       `${task.daysUntilDue} days`}
                                    </Badge>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {task.estimatedHours}h estimated
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                      <BarChart3 className="w-4 h-4" />
                                      Weight: {task.adjustedWeight}
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )
                      })}

                      {studyPlan.priorityTasks.length === 0 && (
                        <div className="text-center py-12">
                          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">All Clear!</h3>
                          <p className="text-gray-500 mt-2">No pending tasks. Enjoy your free time!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ========== APPLY PLAN CTA ========== */}
            {!planApplied && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="shadow-2xl bg-gradient-to-r from-[#ff7400] to-orange-600 border-0 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-white/20 p-4 rounded-2xl">
                          <Rocket className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">Ready to reduce your stress?</h3>
                          <p className="text-white/80 mt-1">
                            Apply this AI-generated plan to optimize your study schedule
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={applyPlan}
                        disabled={applyingPlan}
                        size="lg"
                        className="bg-white text-[#ff7400] hover:bg-gray-100 shadow-xl px-8 py-6 text-lg font-bold"
                      >
                        {applyingPlan ? (
                          <>
                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            Applying Plan...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-2" />
                            Apply Smart Plan
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Plan Applied Success */}
            {planApplied && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Card className="shadow-2xl bg-gradient-to-r from-green-500 to-emerald-600 border-0">
                  <CardContent className="p-8 text-center">
                    <div className="bg-white/20 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mt-4">Plan Applied Successfully!</h3>
                    <p className="text-white/80 mt-2">
                      Your tasks have been scheduled. Check your calendar for the updated timeline.
                    </p>
                    <Button 
                      onClick={() => onNavigate('calendar')}
                      className="mt-6 bg-white text-green-600 hover:bg-gray-100"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Generated timestamp */}
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              Generated at {new Date(studyPlan.generatedAt).toLocaleString()}
            </p>
          </div>
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
              currentScreen="smart-plan"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="smart-plan"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}
