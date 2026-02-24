// ModernCard removed - using plain divs
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { BookOpen, GraduationCap, Clock, Plus, Loader2, Filter, Building2 } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"
import { useModuleStore } from "@/store/moduleStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ModernInput } from "@/components/ui/modern-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CoursesScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [semesterFilter, setSemesterFilter] = useState<string>('all')
  const { user, logout } = useAuthStore()
  const { modules, isLoading, error, fetchModules, createModule } = useModuleStore()

  // Form state for adding new module
  const [moduleCode, setModuleCode] = useState('')
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [credits, setCredits] = useState('')
  const [semester, setSemester] = useState('')
  const [year, setYear] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const sem = semesterFilter !== 'all' ? parseInt(semesterFilter) : undefined
    fetchModules(sem)
  }, [fetchModules, semesterFilter])

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const resetForm = () => {
    setModuleCode('')
    setTitle('')
    setDepartment('')
    setCredits('')
    setSemester('')
    setYear('')
    setFormError(null)
  }

  const handleAddModule = async () => {
    if (!moduleCode || !title || !department || !credits || !semester || !year) {
      setFormError('Please fill in all fields')
      return
    }

    setIsSaving(true)
    setFormError(null)

    try {
      await createModule({
        moduleCode: moduleCode.toUpperCase(),
        title,
        department,
        credits: parseInt(credits),
        semester: parseInt(semester),
        year: parseInt(year)
      })
      setIsAddDialogOpen(false)
      resetForm()
    } catch {
      setFormError('Failed to create module. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getYearLabel = (year: number) => {
    switch (year) {
      case 1: return '1st Year'
      case 2: return '2nd Year'
      case 3: return '3rd Year'
      case 4: return '4th Year'
      default: return `Year ${year}`
    }
  }

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="courses"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-[#F6FAFB] dark:bg-gray-950 pb-20 md:pb-0">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">My Modules</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                  {formError}
                </div>
              )}
              <ModernInput
                label="Module Code"
                value={moduleCode}
                onChange={(e) => setModuleCode(e.target.value)}
                placeholder="e.g., CS301"
              />
              <ModernInput
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Data Structures"
              />
              <ModernInput
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Computer Science"
              />
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label>Credits</Label>
                  <Select value={credits} onValueChange={setCredits}>
                    <SelectTrigger>
                      <SelectValue placeholder="Credits" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(c => (
                        <SelectItem key={c} value={c.toString()}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sem" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <SelectItem key={s} value={s.toString()}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map(y => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => { setIsAddDialogOpen(false); resetForm() }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddModule}
                  disabled={isSaving}
                  className="flex-1 bg-[#ff7400] hover:bg-[#e66800] text-white"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Module'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">My Modules</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your enrolled modules</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg flex items-center gap-2 font-medium shadow-sm">
                <Plus className="w-4 h-4" />
                Add Module
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Module</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                {formError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                    {formError}
                  </div>
                )}
                <ModernInput
                  label="Module Code"
                  value={moduleCode}
                  onChange={(e) => setModuleCode(e.target.value)}
                  placeholder="e.g., CS301"
                />
                <ModernInput
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Data Structures"
                />
                <ModernInput
                  label="Department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g., Computer Science"
                />
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Credits</Label>
                    <Select value={credits} onValueChange={setCredits}>
                      <SelectTrigger>
                        <SelectValue placeholder="Credits" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map(c => (
                          <SelectItem key={c} value={c.toString()}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={semester} onValueChange={setSemester}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sem" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                          <SelectItem key={s} value={s.toString()}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4].map(y => (
                          <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => { setIsAddDialogOpen(false); resetForm() }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddModule}
                    disabled={isSaving}
                    className="flex-1 bg-[#ff7400] hover:bg-[#e66800] text-white"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Module'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        {/* Filter */}
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff7400]/20 focus:border-[#ff7400]"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {modules.length} module{modules.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff7400]" />
          </div>
        ) : modules.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-[#ff7400]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[#ff7400]" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No modules yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add your first module to get started tracking your courses.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-[#ff7400] hover:bg-[#e66800] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </div>
        ) : (
          /* Modules Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={module._id}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ff7400]/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#ff7400]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">{module.title}</h3>
                        <p className="text-xs text-[#ff7400] font-medium">{module.moduleCode}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-[#ff7400]/10 text-[#ff7400] text-xs font-medium rounded-full">
                      {module.credits} credits
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Building2 className="w-4 h-4" />
                      <span>{module.department}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <GraduationCap className="w-4 h-4" />
                      <span>{getYearLabel(module.year)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Semester {module.semester}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
        mobileNavigation={
          <>
            <MobileNavigation 
              currentScreen="courses"
              onNavigate={onNavigate}
            />
            <MobileSidebar
              isOpen={isMobileSidebarOpen}
              onToggle={toggleMobileSidebar}
              currentScreen="courses"
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          </>
        }
      />
    </LayoutWrapper>
  )
}