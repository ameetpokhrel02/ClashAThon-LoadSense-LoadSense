import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { 
  Plus, 
  Calendar, 
  Clock, 
  Trash2,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"
import { useDeadlineStore, type Deadline } from "@/store/deadlineStore"
import { format } from "date-fns"

export default function DeadlinesScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRisk, setFilterRisk] = useState<string>('all')
  const { user, logout } = useAuthStore()
  const { deadlines, isLoading, error, fetchDeadlines, deleteDeadline } = useDeadlineStore()

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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this deadline?')) {
      try {
        await deleteDeadline(id)
      } catch {
        alert('Failed to delete deadline')
      }
    }
  }

  const filteredDeadlines = deadlines.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterRisk === 'all' || d.risk === filterRisk.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    }
  }

  const formatDueDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="deadlines"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const DeadlineCard = ({ deadline, index }: { deadline: Deadline; index: number }) => (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex-1">
            <h3 className="font-medium text-gray-800 dark:text-white">
              {deadline.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{deadline.course}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {formatDueDate(deadline.dueDate)}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {deadline.estimatedHours}h estimated
              </div>
              {deadline.type && (
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  {deadline.type}
                </span>
              )}
            </div>
            {deadline.notes && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">{deadline.notes}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${getRiskBadgeColor(deadline.risk)}`}>
            {deadline.risk}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            onClick={() => handleDelete(deadline._id || deadline.id || '')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )

  const mainContent = (
    <div className="min-h-screen bg-[#F6FAFB] dark:bg-gray-950 relative pb-20 md:pb-0">
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Deadlines</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 hidden md:block">Manage all your academic deadlines in one place.</p>
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

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ff7400]/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#ff7400]" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{filteredDeadlines.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {filteredDeadlines.filter(d => d.risk === 'high').length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">High Risk</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {filteredDeadlines.reduce((sum, d) => sum + d.estimatedHours, 0)}h
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Hours</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search deadlines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff7400]/20 focus:border-[#ff7400]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7400]/20 focus:border-[#ff7400]"
            >
              <option value="all">All Risk Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff7400]" />
          </div>
        ) : (
          /* Deadlines List */
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Deadlines ({filteredDeadlines.length})
            </h2>
            {filteredDeadlines.length > 0 ? (
              <div className="space-y-3">
                {filteredDeadlines.map((deadline, index) => (
                  <DeadlineCard key={deadline._id || deadline.id} deadline={deadline} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
                <div className="w-12 h-12 bg-[#ff7400]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-6 h-6 text-[#ff7400]" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">No deadlines found</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Add your first deadline to get started.</p>
                <Button
                  onClick={() => onNavigate('add-deadline')}
                  className="mt-4 bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Deadline
                </Button>
              </div>
            )}
          </div>
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
              currentScreen="deadlines"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="deadlines"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}
