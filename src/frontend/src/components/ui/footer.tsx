import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import logo from "@/assets/logo.png"

interface FooterProps {
  className?: string
  variant?: 'default' | 'minimal' | 'auth'
}

export function Footer({ className, variant = 'default' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  if (variant === 'minimal') {
    return (
      <footer className={cn(
        "py-4 px-6 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 w-full",
        className
      )}>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} LoadSense. A ClashAThon The Final Battle Project.
          </p>
        </div>
      </footer>
    )
  }

  if (variant === 'auth') {
    return (
      <footer className={cn(
        "py-6 px-6 text-center",
        className
      )}>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>© {currentYear} LoadSense. A ClashAThon The Final Battle Project.</span>
          <span>•</span>
          <span>Smart Workload Management</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for students
          </span>
        </div>
      </footer>
    )
  }

  return (
    <footer className={cn(
      "bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8 px-6 w-full",
      className
    )}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img src={logo} alt="LoadSense Logo" className="h-10 w-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              Empowering students to manage their academic workload intelligently.
              Detect overload, plan smarter, and achieve academic success without burnout.
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for students worldwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  My Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Add Deadline
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} LoadSense. A ClashAThon The Final Battle Project.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built for academic success</span>
          </div>
        </div>
      </div>
    </footer>
  )
}