import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModernInput } from "@/components/ui/modern-input"
import { ModernCard } from "@/components/ui/modern-card"
import { BrandHeader } from "@/components/ui/brand-header"
import { LayoutWrapper, SplitLayout } from "@/components/ui/layout-wrapper"
import { Footer } from "@/components/ui/footer"
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react"

interface ForgotPasswordScreenProps {
  onBack: () => void
  onEmailSubmit: (email: string) => void
}

export default function ForgotPasswordScreen({ onBack, onEmailSubmit }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      onEmailSubmit(email)
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
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
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center relative z-10 w-full">
            <div className="mb-6 w-full h-80 flex items-center justify-center overflow-hidden">
              <img 
                src="/src/assets/loadsemxe.webp" 
                alt="LoadSense" 
                className="w-full h-full object-contain opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-300 ease-in-out"
              />
            </div>
            <p className="text-lg font-medium text-gray-700">Password Recovery</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 leading-tight text-gray-900">
            Forgot your password?
          </h1>
          <p className="text-lg text-gray-600">
            No worries! Enter your email and we'll send you a verification code to reset your password.
          </p>
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
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="lg:hidden mb-8 flex justify-center">
        <BrandHeader variant="compact" />
      </div>

      <ModernCard variant="elevated" className="modern-shadow-xl">
        <div className="p-8 space-y-6">
          <motion.div 
            className="text-center mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold">Reset Password</h2>
            <p className="text-muted-foreground mt-2">
              Enter your email address and we'll send you a verification code.
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
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <ModernInput
                id="email"
                label="Email Address"
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
              className="space-y-4"
            >
              <Button 
                className="w-full h-12 text-base modern-shadow" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Sending OTP..." : "Send Verification Code"}
              </Button>
              
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