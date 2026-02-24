import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2, ArrowLeft, RefreshCw } from "lucide-react"
import childrenImage from "@/assets/childenjooying.png"

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
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#2A7A8C] via-[#3B8FA1] to-[#1F5F6E] p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-orange-400/5 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/10 rounded-full blur-3xl" />
        
        <motion.div 
          className="flex items-center gap-3 relative z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">LoadSense</span>
        </motion.div>
        
        <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-6">
          <motion.div 
            className="w-full max-w-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl blur-xl scale-105" />
              <img 
                src={childrenImage}
                alt="Students enjoying learning"
                className="w-full h-auto rounded-3xl shadow-2xl relative z-10 border border-white/20 object-cover"
              />
            </div>
            
            <div className="text-center mt-6">
              <h1 className="text-3xl font-bold mb-2">
                <span className="text-white">Check Your</span>{" "}
                <span className="text-amber-300">Email</span>
              </h1>
              <p className="text-white/70 text-base">
                Enter the 6-digit code we sent.
              </p>
            </div>
          </motion.div>
        </div>
        
        <div className="text-sm text-white/50 relative z-10">
          © 2026 LoadSense. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-r from-[#2A7A8C] to-[#3B8FA1] p-2 rounded-xl shadow-lg shadow-[#2A7A8C]/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#0F172A]">
              Load<span className="text-[#2A7A8C]">Sense</span>
            </span>
          </div>

          <Card className="bg-white shadow-2xl shadow-[#2A7A8C]/10 border border-[#E2E8F0] rounded-2xl">
            <CardHeader className="space-y-1 pb-4 text-center">
              <CardTitle className="text-2xl font-bold text-[#0F172A]">Verify Your Email</CardTitle>
              <CardDescription className="text-[#64748B]">
                Enter the 6-digit code sent to <span className="font-medium text-[#2A7A8C]">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
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
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-[#DCEFF2] focus:border-[#2A7A8C] focus:ring-2 focus:ring-[#2A7A8C]/20 outline-none transition-all bg-white"
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
                    className="text-[#2A7A8C] hover:text-[#1F5F6E] font-medium"
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
                    Resend code in <span className="font-semibold text-[#2A7A8C]">{timeRemaining}s</span>
                  </p>
                )}
              </div>
              
              <Button 
                onClick={() => handleVerify()}
                className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-[#2A7A8C] to-[#3B8FA1] hover:from-[#1F5F6E] hover:to-[#2A7A8C] shadow-lg shadow-[#2A7A8C]/30 transition-all duration-300" 
                disabled={isLoading || otp.some(d => !d)}
              >
                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify Code"}
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => onNavigate('forgot-password')}
                className="w-full h-11 rounded-xl text-base font-semibold border-2 border-[#2A7A8C] text-[#2A7A8C] hover:bg-[#EAF4F6] transition-all duration-300 flex items-center justify-center gap-2"
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
