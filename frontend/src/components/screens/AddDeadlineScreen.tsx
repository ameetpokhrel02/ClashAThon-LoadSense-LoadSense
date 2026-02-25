import { ModernCard } from "@/components/ui/modern-card"
import { Button } from "@/components/ui/button"
import { ModernInput } from "@/components/ui/modern-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { BrandHeader } from "@/components/ui/brand-header"
import { LayoutWrapper, ResponsiveContainer, MobileHeader } from "@/components/ui/layout-wrapper"
import { Footer } from "@/components/ui/footer"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { PullToRefresh } from "@/components/ui/pull-to-refresh"
import { CalendarIcon, ArrowLeft, Clock, BookOpen, Target } from "lucide-react"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import { useDeadlineStore, type RiskLevel } from "@/store/deadlineStore"
import { useWorkloadStore } from "@/store/workloadStore"
import { useRemindersStore } from "@/store/reminderStore"
import { useModuleStore } from "@/store/moduleStore"
import { useHapticFeedback } from "@/hooks/useMobileGestures"

import type { Deadline } from '@/store/deadlineStore'

interface AddDeadlineScreenProps {
  onNavigate: (screen: string, data?: Deadline) => void
  editDeadline?: Deadline
}

export default function AddDeadlineScreen({ onNavigate, editDeadline }: AddDeadlineScreenProps) {
  const [date, setDate] = useState<Date | undefined>(editDeadline ? new Date(editDeadline.dueDate) : undefined)
  const [title, setTitle] = useState(editDeadline?.title || "")
  const [course, setCourse] = useState(editDeadline?.course || "")
  const [type, setType] = useState(editDeadline?.type || "")
  const [hours, setHours] = useState(editDeadline?.estimatedHours ? String(editDeadline.estimatedHours) : "")
  const [notes, setNotes] = useState(editDeadline?.notes || "");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [manualCourse, setManualCourse] = useState("")

  // Module store
  const { modules, fetchModules } = useModuleStore()

  useEffect(() => {
    fetchModules()
  }, [fetchModules])
  
  const createDeadline = useDeadlineStore(state => state.createDeadline)
  const fetchSummary = useWorkloadStore(state => state.fetchSummary)
  const fetchWorkload = useWorkloadStore(state => state.fetchWorkload)
  const fetchReminders = useRemindersStore(state => state.fetchReminders)
  const { triggerHaptic } = useHapticFeedback()

  const handleSave = async () => {
    // If "Other" is selected, use manualCourse
    const selectedCourse = course === "__other__" ? manualCourse : course
    if (!title || !selectedCourse || !type || !date || !hours) {
      triggerHaptic('medium')
      alert("Please fill in all required fields")
      return
    }

    const estimatedHours = parseInt(hours)
    let risk: RiskLevel = 'low'
    if (estimatedHours > 10) risk = 'high'
    else if (estimatedHours > 5) risk = 'medium'

    try {
      setIsSaving(true)
      let result
      if (editDeadline) {
        // TODO: Call updateDeadline API here
        // result = await updateDeadline({ ...fields, id: editDeadline.id })
        alert('Update logic not yet implemented!')
        result = true // Remove this after implementing update
      } else {
        result = await createDeadline({
          title,
          course: selectedCourse,
          type,
          dueDate: date.toISOString(),
          estimatedHours,
          risk,
          notes,
        })
      }

      if (!result) {
        alert('Failed to save deadline. Please try again.')
        return
      }

      // Refresh dashboard data so new deadline appears immediately
      await fetchSummary()
      await fetchWorkload()
      await fetchReminders()
      triggerHaptic('light')
      onNavigate('dashboard')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleRefresh = async () => {
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <LayoutWrapper pattern="centered" className="bg-[#F6FAFB] dark:bg-gray-950">
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Mobile Header */}
        <MobileHeader 
          title="Add Deadline"
          onMenuToggle={toggleMobileSidebar}
          actions={
            <Button 
              variant="ghost" 
              size="sm"
              className="touch-target" 
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          }
        />

        <ResponsiveContainer maxWidth="full" className="pb-20 lg:pb-8">
          {/* Back Navigation - Desktop Only */}
          <div className="hidden lg:block mb-8">
            <Button 
              variant="ghost" 
              className="gap-2 text-muted-foreground hover:text-foreground transition-smooth" 
              onClick={() => onNavigate('dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Panel - Branding - Desktop Only */}
            <motion.div 
              className="hidden lg:flex flex-col justify-center space-y-8"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <BrandHeader variant="full" className="text-primary" />
              
              <div className="space-y-6">
                <motion.div 
                  className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-8 border border-primary/30"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/30 p-3 rounded-full">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">Smart Planning</h3>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">
                    Add your assignments and let LoadSense analyze your workload to prevent burnout and optimize your study schedule.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl p-8 border border-primary/30"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/30 p-3 rounded-full">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-primary">Workload Intelligence</h3>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">
                    Our algorithm considers your historical completion rates and current commitments to provide accurate workload predictions.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Panel - Form */}
            <motion.div 
              className="w-full"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <ModernCard variant="glass" className="modern-shadow-2xl mobile-card">
                {/* Header */}
                <div className="border-b border-border/50 p-6 lg:p-8">
                  <div className="lg:hidden mb-6">
                    <BrandHeader variant="compact" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/20 p-3 rounded-xl">
                      <CalendarIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-responsive-xl lg:text-2xl font-bold text-foreground">Add New Deadline</h1>
                      <p className="text-muted-foreground text-responsive-sm">Track your upcoming assignments and exams</p>
                    </div>
                  </div>
                </div>
                
                {/* Form Content */}
                <div className="p-6 lg:p-8 space-y-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <ModernInput
                      id="title"
                      label="Task Title"
                      placeholder="e.g., Midterm Essay Draft"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      icon={<BookOpen className="w-4 h-4" />}
                    />
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="course" className="text-sm font-medium">Course</Label>
                      <Select value={course} onValueChange={setCourse}>
                        <SelectTrigger id="course" className="h-11 rounded-lg touch-target">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {modules && modules.length > 0 && modules.map((mod) => (
                            <SelectItem key={mod._id} value={mod.moduleCode}>{mod.moduleCode} - {mod.title}</SelectItem>
                          ))}
                          <SelectItem value="__other__">Other (Add manually...)</SelectItem>
                        </SelectContent>
                      </Select>
                      {course === "__other__" && (
                        <ModernInput
                          id="manual-course"
                          label="Enter Course Name or Code"
                          placeholder="e.g., BIO101 - Biology"
                          value={manualCourse}
                          onChange={e => setManualCourse(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-sm font-medium">Task Type</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger id="type" className="h-11 rounded-lg touch-target">
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Assignment">Assignment</SelectItem>
                          <SelectItem value="Quiz">Quiz</SelectItem>
                          <SelectItem value="Viva">Viva</SelectItem>
                          <SelectItem value="Project">Project</SelectItem>
                          <SelectItem value="Midterm">Midterm</SelectItem>
                          <SelectItem value="Final">Final</SelectItem>
                          <SelectItem value="Exam">Exam</SelectItem>
                          <SelectItem value="Reading">Reading</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal h-11 rounded-lg touch-target",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 z-[9999]" align="start" side="bottom" sideOffset={8} forceMount>
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <ModernInput
                      id="hours"
                      label="Estimated Effort (Hours)"
                      type="number"
                      inputMode="numeric"
                      placeholder="e.g., 5"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      icon={<Clock className="w-4 h-4" />}
                      helpText="How many hours do you think this will take?"
                    />
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <Label htmlFor="notes" className="text-sm font-medium">Additional Notes (Optional)</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add any specific requirements, links, or reminders..." 
                      className="min-h-[100px] rounded-lg resize-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </motion.div>
                </div>
                
                {/* Footer */}
                <motion.div 
                  className="flex flex-col lg:flex-row justify-end gap-4 p-6 lg:p-8 border-t border-border/50 bg-secondary/20"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('dashboard')} 
                    className="rounded-lg h-11 px-6 border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary touch-target"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-lg h-11 px-8 modern-gradient-purple text-white hover:neon-glow-purple transition-smooth touch-target"
                  >
                    {isSaving ? 'Saving...' : 'Save Deadline'}
                  </Button>
                </motion.div>
              </ModernCard>
            </motion.div>
          </div>
        </ResponsiveContainer>
        
        {/* Footer */}
        <Footer variant="minimal" />

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <MobileNavigation 
            currentScreen="add-deadline"
            onNavigate={onNavigate}
          />
          <MobileSidebar
            isOpen={isMobileSidebarOpen}
            onToggle={toggleMobileSidebar}
            currentScreen="add-deadline"
            onNavigate={onNavigate}
            onLogout={() => onNavigate('login')}
          />
        </div>
      </PullToRefresh>
    </LayoutWrapper>
  )
}
