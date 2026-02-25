import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2, ArrowLeft, RefreshCw, BookOpen, Pencil } from "lucide-react"
import { api, handleApiError } from "@/lib/api"
import childrenImage from "@/assets/childenjooying-Photoroom.png"

interface OTPVerificationScreenProps {
  email: string
  onNavigate: (screen: string) => void
  onVerify: (otp: string) => void
  onResend: () => void
}

export default function OTPVerificationScreen({ email, onNavigate, onVerify, onResend }: OTPVerificationScreenProps) {
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
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    
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
      await api.post('/auth/verify-otp', { email, otp: otpCode })
      onVerify(otpCode)
    } catch (err) {
      setError(handleApiError(err))
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await api.post('/auth/forgot-password', { email })
      onResend()
      setTimeRemaining(60)
      setCanResend(false)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-gray-950">
      {/* Left Panel - Modern Hero */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-[#F8FAFB] via-[#F5F7F8] to-[#EEF2F5] dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 opacity-40">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="w-12 h-12 text-[#ff7400]/30" />
          </motion.div>
        </div>
        <div className="absolute top-32 right-16 opacity-30">
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Pencil className="w-8 h-8 text-[#ff7400]/40" />
          </motion.div>
        </div>
        <div className="absolute bottom-40 left-16 opacity-30">
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <BookOpen className="w-10 h-10 text-[#ff7400]/20" />
          </motion.div>
        </div>
        
        <motion.div 
          className="p-8 flex items-center gap-3 relative z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-[#ff7400] to-[#ff8c33] p-3 rounded-xl shadow-lg shadow-[#ff7400]/30">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">LoadSense</span>
        </motion.div>
        
        <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-8">
          <motion.div 
            className="w-full max-w-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Soft shadow underneath */}
            <div className="absolute -inset-4 bg-gradient-to-b from-transparent via-transparent to-gray-900/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gray-900/15 dark:bg-black/30 blur-xl rounded-full" />
            
            <div className="relative">
              <img 
                src={childrenImage}
                alt="Students enjoying learning"
                className="w-full h-auto relative z-10 object-contain scale-110"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.15)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))' }}
              />
            </div>
            
            <motion.div 
              className="text-center mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-gray-800 dark:text-white">Check Your</span>{" "}
                <span className="text-[#ff7400]">Email</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Enter the 6-digit code we sent.
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="p-8 text-sm text-gray-500 dark:text-gray-400 relative z-10">
          © 2026 LoadSense. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-gray-950">
        <motion.div 
          className="w-full max-w-md"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-br from-[#ff7400] to-[#ff8c33] p-2 rounded-xl shadow-lg shadow-[#ff7400]/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              Load<span className="text-[#ff7400]">Sense</span>
            </span>
          </div>

          <Card className="bg-white dark:bg-gray-900 shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 rounded-3xl">
            <CardHeader className="space-y-2 pb-6 text-center pt-10 px-10">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Enter the 6-digit code sent to <span className="font-medium text-[#ff7400]">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-10 pb-10">
              {error && (
                <motion.div 
                  className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800 text-center"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}
              
              {/* OTP Input */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#ff7400] focus:ring-2 focus:ring-[#ff7400]/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                ))}
              </div>
              
              {/* Timer & Resend */}
              <div className="text-center">
                {canResend ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResend}
                    disabled={isResending}
                    className="text-[#ff7400] hover:text-[#e66800] font-medium"
                  >
                    {isResending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Resend Code
                  </Button>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Resend code in <span className="font-semibold text-[#ff7400]">{timeRemaining}s</span>
                  </p>
                )}
              </div>
              
              <Button 
                onClick={() => handleVerify()}
                className="w-full h-14 rounded-xl text-base font-semibold bg-[#ff7400] hover:bg-[#e66800] text-white shadow-lg shadow-[#ff7400]/25 transition-all duration-300" 
                disabled={isLoading || otp.some(d => !d)}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify Code"}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => onNavigate('forgot-password')}
                className="w-full h-14 rounded-xl text-base font-semibold border-2 border-[#ff7400] text-[#ff7400] hover:bg-[#ff7400]/5 dark:hover:bg-[#ff7400]/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Email
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
