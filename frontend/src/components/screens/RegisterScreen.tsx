import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModernInput } from "@/components/ui/modern-input"
import { ModernCard } from "@/components/ui/modern-card"
import { BrandHeader } from "@/components/ui/brand-header"
import { LayoutWrapper, SplitLayout } from "@/components/ui/layout-wrapper"
import { Footer } from "@/components/ui/footer"
import { UserPlus, ArrowLeft, Loader2, Mail, Lock, User, GraduationCap, Sparkles } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { handleApiError } from "@/lib/api"

interface RegisterScreenProps {
  onBack: () => void
  onRegister: () => void
}

export default function RegisterScreen({ onBack, onRegister }: RegisterScreenProps) {
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setAuth(
        { id: '1', firstName, lastName, email },
        'mock-jwt-token-123'
      )
      onRegister()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const leftPanel = (
    <>
      <BrandHeader variant="full" className="text-gray-800" />
      
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto">
        {/* Clean Hero Section */}
        <motion.div 
          className="w-full bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-center mb-8 shadow-sm relative overflow-hidden p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center relative z-10 w-full">
            <div className="mb-6 w-full h-80 flex items-center justify-center overflow-hidden">
              <img 
                src="/src/assets/loadsemxe.webp" 
                alt="LoadSense" 
                className="w-full h-full object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300 ease-in-out"
              />
            </div>
            <motion.p 
              className="text-lg font-medium text-gray-700"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.9 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Join LoadSense Today
            </motion.p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4 leading-tight text-gray-900">
            Start your{" "}
            <span className="text-primary">
              academic journey
            </span>
            .
          </h1>
          <p className="text-lg text-gray-600">
            Create your account and take control of your workload with intelligent planning and burnout prevention.
          </p>
        </motion.div>
        
        {/* Feature highlights */}
        <motion.div 
          className="mt-8 space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            "Personalized workload tracking",
            "Smart study recommendations", 
            "Stress-free deadline management"
          ].map((feature, index) => (
            <motion.div
              key={feature}
              className="flex items-center space-x-3 text-gray-600"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 0.7 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <div className="text-sm text-gray-500">
        © 2026 LoadSense. All rights reserved.
      </div>
      
      {/* Footer */}
      <Footer variant="auth" className="mt-8" />
    </>
  )

  const rightPanel = (
    <motion.div 
      className="w-full max-w-md"
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="lg:hidden mb-8 flex justify-center">
        <BrandHeader variant="compact" />
      </div>

      <ModernCard variant="glass" className="modern-shadow-xl">
        <div className="p-8 space-y-6">
          <motion.div 
            className="text-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Create Account</h2>
            </div>
            <p className="text-muted-foreground">
              Join thousands of students managing their workload intelligently.
            </p>
          </motion.div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}
            
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ModernInput
                id="firstName"
                label="First Name"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
              <ModernInput
                id="lastName"
                label="Last Name"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <ModernInput
                id="email"
                label="University Email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <ModernInput
                id="password"
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                helpText="At least 6 characters"
                required
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <ModernInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="space-y-4"
            >
              <Button 
                className="w-full h-12 text-base bg-primary hover:bg-primary/80 text-white transition-smooth" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
              
              <div className="text-center">
                <span className="text-sm text-muted-foreground">Already have an account? </span>
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Sign in here
                </button>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full h-12 text-base" 
                type="button"
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </motion.div>
          </form>
        </div>
      </ModernCard>
    </motion.div>
  )

  return (
    <LayoutWrapper pattern="split">
      <SplitLayout
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        leftPanelClassName="bg-white text-gray-900"
      />
    </LayoutWrapper>
  )
}