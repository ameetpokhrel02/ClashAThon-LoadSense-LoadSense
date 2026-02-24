import { ModernCard } from "@/components/ui/modern-card"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { BookOpen, Users, Clock, Star } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useAuthStore } from "@/store/authStore"

export default function CoursesScreen({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    onNavigate('login')
  }

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const courses = [
    {
      id: 1,
      name: "Object Oriented Programming",
      code: "CS301",
      instructor: "Dr. Smith",
      students: 45,
      progress: 75,
      color: "bg-primary"
    },
    {
      id: 2,
      name: "Database Systems",
      code: "CS302",
      instructor: "Prof. Johnson",
      students: 38,
      progress: 60,
      color: "bg-primary/70"
    },
    {
      id: 3,
      name: "Software Engineering",
      code: "CS303",
      instructor: "Dr. Williams",
      students: 52,
      progress: 40,
      color: "bg-primary/50"
    }
  ]

  const sidebarContent = (
    <NavigationSidebar
      currentScreen="courses"
      onNavigate={onNavigate}
      user={user}
      onLogout={handleLogout}
    />
  )

  const mainContent = (
    <div className="min-h-screen bg-gradient-to-br from-[#F6FAFB] via-[#EAF4F6] to-[#DCEFF2]">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b border-[#E2E8F0] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A]">My <span className="text-[#2A7A8C]">Courses</span></h1>
            <p className="text-[#64748B]">Manage your enrolled courses</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ModernCard className="p-6 hover:shadow-2xl transition-all cursor-pointer glow-primary-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r from-[#2A7A8C] to-[#3B8FA1] rounded-lg flex items-center justify-center shadow-lg shadow-[#2A7A8C]/20`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#0F172A]">{course.name}</h3>
                    <p className="text-sm text-[#64748B]">{course.code}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{course.students} students</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r from-primary to-[#317E90]`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 btn-primary-glow rounded-lg">
                  View Course
                </Button>
              </ModernCard>
            </motion.div>
          ))}
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