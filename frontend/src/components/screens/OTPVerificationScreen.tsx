import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModernCard } from "@/components/ui/modern-card"
import { BrandHeader } from "@/components/ui/brand-header"
import { LayoutWrapper, SplitLayout } from "@/components/ui/layout-wrapper"
import { Footer } from "@/components/ui/footer"
import { Shield, ArrowLeft, Loader2, RefreshCw } from "lucide-react"

interface OTPVerificationScreenProps {
  email: string
  onBack: () => void
  onVerify: (code: string) => void
  onResend: () => void
}

export default function OTPVerificationScreen({ 
  email, 
  onBack, 
  onVerify, 
  onResend 
}: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== "") && value) {
      handleVerify(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join("")
    if (otpCode.length !== 6) return
    
    setIsLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      onVerify(otpCode)
    } catch (err) {
      setError("Invalid verification code. Please try again.")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      onResend()
      setTimeRemaining(60)
      setCanResend(false)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError("Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
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
            <p className="text-lg font-medium text-gray-700">Secure Verification</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 leading-tight text-gray-900">
            Check your email
          </h1>
          <p className="text-lg text-gray-600">
            We've sent a 6-digit verification code to <span className="font-semibold text-purple-600">{email}</span>
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
            <h2 className="text-2xl font-bold">Enter Verification Code</h2>
            <p className="text-muted-foreground mt-2">
              Enter the 6-digit code sent to your email
            </p>
          </motion.div>
          
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
            className="flex justify-center gap-3 mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:border-primary focus:outline-none transition-colors bg-background"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                whileFocus={{ scale: 1.05 }}
              />
            ))}
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="space-y-4"
          >
            <Button 
              className="w-full h-12 text-base modern-shadow" 
              onClick={() => handleVerify()}
              disabled={isLoading || otp.some(digit => !digit)}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Verify Code"
              )}
            </Button>
            
            <div className="text-center space-y-2">
              {canResend ? (
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary/80"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  {isResending ? "Resending..." : "Resend Code"}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend code in {timeRemaining}s
                </p>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full h-12 text-base" 
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Email
            </Button>
          </motion.div>
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