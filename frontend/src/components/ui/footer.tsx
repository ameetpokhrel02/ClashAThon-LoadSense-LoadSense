import * as React from "react"
import { Heart, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
  variant?: 'default' | 'minimal' | 'auth'
}

export function Footer({ className, variant = 'default' }: FooterProps) {
  const currentYear = new Date().getFullYear()

  if (variant === 'minimal') {
    return (
      <footer className={cn(
        "py-4 px-6 border-t border-gray-200 bg-white",
        className
      )}>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} LoadSense. All rights reserved.
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
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>© {currentYear} LoadSense</span>
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
      "bg-white border-t border-gray-200 py-8 px-6",
      className
    )}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">LoadSense</h3>
                <p className="text-sm text-gray-600">Smart Workload Management</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Empowering students to manage their academic workload intelligently. 
              Detect overload, plan smarter, and achieve academic success without burnout.
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for students worldwide</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                  My Courses
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Add Deadline
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} LoadSense. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built for academic success</span>
          </div>
        </div>
      </div>
    </footer>
  )
}