// ModernCard removed - using plain divs
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/ui/navigation-sidebar"
import { LayoutWrapper, SidebarLayout } from "@/components/ui/layout-wrapper"
import { MobileNavigation, MobileSidebar } from "@/components/ui/mobile-navigation"
import { Footer } from "@/components/ui/footer"
import { BookOpen, Users, Star } from "lucide-react"
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
    <div className="min-h-screen bg-[#F6FAFB]">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">My Courses</h1>
            <p className="text-sm text-gray-500">Manage your enrolled courses</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#ff7400]/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#ff7400]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{course.name}</h3>
                    <p className="text-xs text-gray-500">{course.code}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{course.students} students</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-700">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-[#ff7400]"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-[#ff7400] hover:bg-[#e66800] text-white rounded-lg font-medium text-sm shadow-sm">
                  View Course
                </Button>
              </div>
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