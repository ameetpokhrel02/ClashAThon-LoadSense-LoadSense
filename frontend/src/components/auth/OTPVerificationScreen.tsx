import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2, ArrowLeft, RefreshCw, BookOpen, Pencil } from "lucide-react"
import childrenImage from "@/assets/childenjooying-Photoroom.png"

interface OTPVerificationScreenProps {
  email: string
  onNavigate: (screen: string) => void
  onVerify: () => void
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
      await new Promise(resolve => setTimeout(resolve, 1500))
      onVerify()
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

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#FFF8F5] via-[#FFF5F0] to-[#FFEDE5]">
      {/* Left Panel - Modern Hero */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-[#FFF8F5] via-[#FFEEE5] to-[#FFE4D6] relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 opacity-60">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="w-12 h-12 text-[#ff7400]/40" />
          </motion.div>
        </div>
        <div className="absolute top-32 right-16 opacity-50">
          <motion.div
            animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Pencil className="w-8 h-8 text-[#ff7400]/50" />
          </motion.div>
        </div>
        <div className="absolute bottom-40 left-16 opacity-40">
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <BookOpen className="w-10 h-10 text-[#ff7400]/30" />
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
          <span className="text-2xl font-bold tracking-tight text-[#1a1a2e]">LoadSense</span>
        </motion.div>
        
        <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-8">
          <motion.div 
            className="w-full max-w-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Cream-Orange outer glow */}
            <div className="absolute -inset-8 bg-gradient-to-br from-[#ff7400]/20 via-[#ffb380]/30 to-[#ffe4cc]/40 rounded-full blur-3xl" />
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#fff5eb]/60 to-[#ffcca3]/30 rounded-full blur-2xl" />
            
            <div className="relative">
              <img 
                src={childrenImage}
                alt="Students enjoying learning"
                className="w-full h-auto relative z-10 object-contain scale-110 drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(255, 116, 0, 0.25))' }}
              />
            </div>
            
            <motion.div 
              className="text-center mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#1a1a2e]">Check Your</span>{" "}
                <span className="text-[#ff7400]">Email</span>
              </h1>
              <p className="text-[#64748B] text-lg">
                Enter the 6-digit code we sent.
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="p-8 text-sm text-[#64748B] relative z-10">
          © 2026 LoadSense. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-[#FAFBFC] to-[#F5F7FA]">
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
            <span className="text-2xl font-bold text-[#1a1a2e]">
              Load<span className="text-[#ff7400]">Sense</span>
            </span>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl shadow-black/5 border-0 rounded-3xl">
            <CardHeader className="space-y-1 pb-4 text-center pt-8 px-8">
              <CardTitle className="text-2xl font-bold text-[#1a1a2e]">Verify Your Email</CardTitle>
              <CardDescription className="text-[#64748B]">
                Enter the 6-digit code sent to <span className="font-medium text-[#ff7400]">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-8 pb-8">
              {error && (
                <motion.div 
                  className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-center"
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
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-[#e2e8f0] focus:border-[#ff7400] focus:ring-2 focus:ring-[#ff7400]/20 outline-none transition-all bg-[#f8fafc]"
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
                  <p className="text-[#64748B] text-sm">
                    Resend code in <span className="font-semibold text-[#ff7400]">{timeRemaining}s</span>
                  </p>
                )}
              </div>
              
              <Button 
                onClick={() => handleVerify()}
                className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-[#ff7400] to-[#ff8c33] hover:from-[#e66800] hover:to-[#ff7400] text-white shadow-lg shadow-[#ff7400]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff7400]/40 hover:-translate-y-0.5" 
                disabled={isLoading || otp.some(d => !d)}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify Code"}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => onNavigate('forgot-password')}
                className="w-full h-11 rounded-xl text-base font-semibold border-2 border-[#ff7400] text-[#ff7400] hover:bg-[#fff5eb] transition-all duration-300 flex items-center justify-center gap-2"
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
