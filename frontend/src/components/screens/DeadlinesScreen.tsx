import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { TopNavbar } from "@/components/ui/top-navbar"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import {
  Plus,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  BarChart3
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { motion } from "framer-motion"

import { useAuthStore } from "@/store/authStore"
import { useDeadlineStore } from "@/store/deadlineStore"
import type { Deadline as StoreDeadline } from "@/store/deadlineStore"

export default function DeadlinesScreen({ onNavigate }: { onNavigate: (screen: string, data?: StoreDeadline) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterImpact, setFilterImpact] = useState<string>('all')
  const { user, logout } = useAuthStore()

  const deadlines = useDeadlineStore((state) => state.deadlines)
  const loadDeadlines = useDeadlineStore((state) => state.loadDeadlines)
  const deleteDeadline = useDeadlineStore((state) => state.deleteDeadline)
  const setDeadlineCompleted = useDeadlineStore((state) => state.setDeadlineCompleted)

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  useEffect(() => {
    loadDeadlines()
  }, [loadDeadlines])

  const toImpact = (risk: string): 'High' | 'Medium' | 'Low' => {
    if (risk === 'high') return 'High'
    if (risk === 'medium') return 'Medium'
    return 'Low'
  }

  const formatDueDate = (iso: string) => {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })
  }

  // Explicitly define the UI deadline type with all needed fields
  type UIDeadline = StoreDeadline & {
    impact: string;
    status: 'completed' | 'pending';
    notes?: string;
    impactLevel?: string;
    weight?: number;
    risk?: string;
  };
  const uiDeadlines: UIDeadline[] = useMemo(() => {
    return deadlines.map((d) => ({
      ...d,
      dueDate: formatDueDate(d.dueDate),
      impact: toImpact(d.risk),
      status: d.isCompleted ? 'completed' : 'pending',
    }))
  }, [deadlines])

  const handleDelete = async (id: string) => {
    await deleteDeadline(id)
  }

  const handleToggleStatus = async (id: string) => {
    const current = deadlines.find(d => d.id === id)
    if (!current) return
    await setDeadlineCompleted(id, !current.isCompleted)
  }

  const filteredDeadlines = uiDeadlines.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterImpact === 'all' || d.impact === filterImpact
    return matchesSearch && matchesFilter
  })

  const pendingDeadlines = filteredDeadlines.filter(d => d.status === 'pending')
  const completedDeadlines = filteredDeadlines.filter(d => d.status === 'completed')

  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
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

  const [openDetailId, setOpenDetailId] = useState<string | null>(null)

  const DeadlineCard = ({ deadline, index }: { deadline: any; index: number }) => (
    <>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all ${deadline.status === 'completed' ? 'opacity-60' : ''
          }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => handleToggleStatus(deadline.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${deadline.status === 'completed'
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-[#ff7400]'
                }`}
            >
              {deadline.status === 'completed' && (
                <CheckCircle2 className="w-3 h-3 text-white" />
              )}
            </button>
            <div className="flex-1">
              <h3 className={`font-medium text-gray-800 dark:text-white ${deadline.status === 'completed' ? 'line-through' : ''}`}>
                {deadline.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{deadline.course}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {deadline.dueDate}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {deadline.estimatedHours}h estimated
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <BookOpen className="w-3.5 h-3.5" />
                  {deadline.type}
                </div>
              </div>
              {deadline.notes && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                  Notes: {deadline.notes}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getImpactBadgeColor(deadline.impact)}`}>
              {deadline.impact}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 text-gray-400 hover:text-[#ff7400] hover:bg-[#ff7400]/10"
              onClick={() => setOpenDetailId(deadline.id)}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 text-gray-400 hover:text-[#ff7400] hover:bg-[#ff7400]/10"
              onClick={() => onNavigate('add-deadline', deadline)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={() => handleDelete(deadline.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      {/* Details Modal */}
      <Dialog open={openDetailId === deadline.id} onOpenChange={(open) => !open && setOpenDetailId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deadline Details</DialogTitle>
            <DialogDescription>All information for this deadline</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div><strong>Title:</strong> {deadline.title}</div>
            <div><strong>Course:</strong> {deadline.course}</div>
            <div><strong>Type:</strong> {deadline.type}</div>
            <div><strong>Due Date:</strong> {deadline.dueDate}</div>
            <div><strong>Estimated Hours:</strong> {deadline.estimatedHours}</div>
            <div><strong>Notes:</strong> {deadline.notes || <span className="text-gray-400">None</span>}</div>
            <div><strong>Impact Level:</strong> {deadline.impactLevel || <span className="text-gray-400">N/A</span>}</div>
            <div><strong>Weight:</strong> {deadline.weight ?? <span className="text-gray-400">N/A</span>}</div>
            <div><strong>Risk:</strong> {deadline.risk || <span className="text-gray-400">N/A</span>}</div>
            <div><strong>Status:</strong> {deadline.status}</div>
          </div>
          <DialogClose asChild>
            <Button className="mt-4 w-full" variant="outline">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )

  const mainContent = (
    <div className="min-h-screen flex flex-col bg-[#F6FAFB] dark:bg-gray-950 relative pb-20 md:pb-0">
      {/* Desktop Top Navbar */}
      <div className="hidden md:block sticky top-0 z-30">
        <TopNavbar onNavigate={onNavigate} />
      </div>
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Deadlines</h1>
        <Button
          onClick={() => onNavigate('add-deadline')}
          size="sm"
          className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Deadlines</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all your academic deadlines in one place.</p>
          </div>
          <Button
            onClick={() => onNavigate('add-deadline')}
            className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg flex items-center gap-2 font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Deadline
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
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{pendingDeadlines.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pending</p>
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
                  {pendingDeadlines.filter(d => d.impact === 'High').length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">High Priority</p>
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
                <p className="text-2xl font-semibold text-gray-800 dark:text-white">{completedDeadlines.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
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
              value={filterImpact}
              onChange={(e) => setFilterImpact(e.target.value)}
              className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7400]/20 focus:border-[#ff7400]"
            >
              <option value="all">All Impact</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Pending Deadlines */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending ({pendingDeadlines.length})</h2>
          {pendingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {pendingDeadlines.map((deadline, index) => (
                <DeadlineCard key={deadline.id} deadline={deadline} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 font-medium">All caught up!</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No pending deadlines.</p>
            </div>
          )}
        </div>

        {/* Completed Deadlines */}
        {completedDeadlines.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed ({completedDeadlines.length})</h2>
            <div className="space-y-3">
              {completedDeadlines.map((deadline, index) => (
                <DeadlineCard key={deadline.id} deadline={deadline} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto block w-full">
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
