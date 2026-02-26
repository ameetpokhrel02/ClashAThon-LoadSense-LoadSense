import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Calendar,
  BarChart3,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  Target,
  AlertTriangle,
  FileText,
  TrendingDown,
  Eye,
  Bell,
  CalendarCheck,
  Zap,
  BookOpen,
  Pencil,
  Ruler,
  Calculator
} from "lucide-react"
import heroImage from "@/assets/STUDENT1-Photoroom.png"
import { GraduationCap } from "lucide-react"

interface LandingPageProps {
  onNavigate: (screen: string) => void
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 20
    const y = (e.clientY - rect.top - rect.height / 2) / 20
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  const problems = [
    {
      icon: FileText,
      title: "Too Many Deadlines",
      description: "Multiple assignments pile up without warning"
    },
    {
      icon: TrendingDown,
      title: "Unplanned Workload",
      description: "No visibility into upcoming work intensity"
    },
    {
      icon: AlertTriangle,
      title: "Last-Minute Stress",
      description: "Realizing overload when it's too late"
    }
  ]

  const solutions = [
    {
      icon: Calendar,
      title: "Track Deadlines",
      description: "Log all your assignments, exams, and projects in one place"
    },
    {
      icon: BarChart3,
      title: "Visualize Workload",
      description: "See your weekly load with intuitive heatmaps"
    },
    {
      icon: Shield,
      title: "Detect Overload Early",
      description: "Get alerts before workload becomes overwhelming"
    }
  ]

  const benefits = [
    {
      icon: CalendarCheck,
      text: "Avoid deadline clashes"
    },
    {
      icon: Clock,
      text: "Improve time planning"
    },
    {
      icon: Target,
      text: "Reduce academic stress"
    }
  ]

  const howItWorks = [
    {
      step: 1,
      icon: FileText,
      title: "Add Deadlines",
      description: "Enter your assignments with due dates and effort estimates"
    },
    {
      step: 2,
      icon: Eye,
      title: "See Weekly Load",
      description: "View your workload distribution across the week"
    },
    {
      step: 3,
      icon: Bell,
      title: "Get Overload Alerts",
      description: "Receive warnings when workload exceeds healthy limits"
    }
  ]

  return (
    <div className="min-h-screen bg-[#F6FAFB]">
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl shadow-sm flex items-center justify-center bg-[#ff7400]">
                <GraduationCap className="w-9 h-9 text-white" />
              </div>
              <span className="font-bold text-2xl ml-3" style={{ color: '#22223b', textShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>LoadSense</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => onNavigate('login')}
              >
                Sign In
              </Button>
              <Button
                className="bg-[#ff7400] hover:bg-[#e66800] text-white font-medium rounded-lg shadow-sm"
                onClick={() => onNavigate('register')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Detect Academic Overload{" "}
                <span className="text-[#ff7400]">Before It Happens</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Plan smarter. Reduce stress. Stay ahead of deadlines.
                LoadSense helps you visualize your workload and prevent academic burnout.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#ff7400] hover:bg-[#e66800] text-white font-semibold rounded-xl px-8 shadow-sm"
                  onClick={() => onNavigate('register')}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 font-semibold rounded-xl px-8 hover:bg-gray-50"
                  onClick={() => onNavigate('login')}
                >
                  Sign In
                </Button>
              </div>
            </motion.div>

            {/* Right - Hero Image with Effects */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative">
                {/* Main Image with Mouse Tracking */}
                <motion.div
                  animate={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                  }}
                  transition={{ type: "spring", stiffness: 150, damping: 15 }}
                  style={{
                    filter: `drop-shadow(${mousePosition.x * 0.5}px ${mousePosition.y * 0.5 + 8}px 20px rgba(255, 116, 0, 0.35))`
                  }}
                >
                  <img
                    src={heroImage}
                    alt="Student managing workload"
                    className="w-full h-auto"
                  />
                </motion.div>

                {/* Rotating Academic Items */}
                <div className="absolute inset-0 w-full h-full">
                  {/* Book - Top */}
                  <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      y: [-4, -12, -4]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-lg border-2 border-[#ff7400]/30 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-[#ff7400]" />
                    </div>
                  </motion.div>

                  {/* Pencil - Right */}
                  <motion.div
                    className="absolute top-1/4 right-0 translate-x-4"
                    animate={{
                      rotate: [0, 15, -15, 0],
                      x: [4, 12, 4]
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <div className="w-11 h-11 bg-white rounded-xl shadow-lg border-2 border-[#ff7400]/30 flex items-center justify-center">
                      <Pencil className="w-5 h-5 text-[#ff7400]" />
                    </div>
                  </motion.div>

                  {/* Calculator - Bottom Right */}
                  <motion.div
                    className="absolute bottom-1/4 right-4"
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <div className="w-10 h-10 bg-white rounded-xl shadow-lg border-2 border-[#ff7400]/30 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-[#ff7400]" />
                    </div>
                  </motion.div>

                  {/* Ruler - Left */}
                  <motion.div
                    className="absolute top-1/3 left-0 -translate-x-4"
                    animate={{
                      rotate: [0, -20, 20, 0],
                      x: [-4, -12, -4]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  >
                    <div className="w-11 h-11 bg-white rounded-xl shadow-lg border-2 border-[#ff7400]/30 flex items-center justify-center">
                      <Ruler className="w-5 h-5 text-[#ff7400]" />
                    </div>
                  </motion.div>

                  {/* Logo Icon - Bottom Left */}
                  <motion.div
                    className="absolute bottom-1/3 left-4"
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-lg border-2 border-[#ff7400]/30 flex items-center justify-center p-2">
                      <div className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center bg-[#ff7400]">
                        <GraduationCap className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </motion.div>
                </div>
                {/* Floating accent elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-green-100 border border-green-200 rounded-xl p-3 shadow-sm"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-[#ff7400]/10 border border-[#ff7400]/20 rounded-xl p-3 shadow-sm"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <Zap className="w-6 h-6 text-[#ff7400]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Students Feel <span className="text-[#ff7400]">Overwhelmed</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Academic workload often catches students off guard, leading to stress and missed deadlines.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-md rounded-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <problem.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{problem.title}</h3>
                <p className="text-gray-600 text-sm">{problem.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How <span className="text-[#ff7400]">LoadSense</span> Helps
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We turn chaos into clarity with intelligent workload visualization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#ff7400]/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                  <solution.icon className="w-7 h-7 text-[#ff7400]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{solution.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{solution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-10"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Benefits</h2>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.text}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-white shadow-md rounded-xl px-6 py-4"
              >
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-gray-800 font-medium">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-gray-200" />
                )}

                <div className="bg-white shadow-md rounded-xl p-6 text-center relative hover:shadow-lg transition-shadow duration-300">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#ff7400] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {item.step}
                  </div>

                  <div className="w-14 h-14 bg-[#ff7400]/10 rounded-xl flex items-center justify-center mx-auto mt-4 mb-5">
                    <item.icon className="w-7 h-7 text-[#ff7400]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#ff7400] to-[#ff8c33]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Start Planning Smarter Today
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join students who are taking control of their academic workload.
              It's free to get started.
            </p>
            <Button
              size="lg"
              className="bg-white text-[#ff7400] hover:bg-gray-100 font-semibold rounded-xl px-10 shadow-lg"
              onClick={() => onNavigate('register')}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl shadow-sm flex items-center justify-center bg-[#ff7400]">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-xl ml-3" style={{ color: '#22223b', textShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>LoadSense</span>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 LoadSense. Smart Academic Workload Management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
