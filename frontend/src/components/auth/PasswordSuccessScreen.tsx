import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, CheckCircle, Sparkles } from "lucide-react"
import childrenImage from "@/assets/childenjooying.png"

interface PasswordSuccessScreenProps {
  onNavigate: (screen: string) => void
}

export default function PasswordSuccessScreen({ onNavigate }: PasswordSuccessScreenProps) {
  // Auto redirect after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('login')
    }, 3000)
    return () => clearTimeout(timer)
  }, [onNavigate])

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
                <span className="text-white">Password</span>{" "}
                <span className="text-amber-300">Updated!</span>
              </h1>
              <p className="text-white/70 text-base">
                You're all set.
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
          className="w-full max-w-md text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
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

          <Card className="bg-white shadow-2xl shadow-[#2A7A8C]/10 border border-[#E2E8F0] rounded-2xl overflow-hidden">
            <CardContent className="p-8 space-y-6">
              {/* Success Icon */}
              <motion.div 
                className="relative mx-auto w-24 h-24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Password Updated!</h2>
                <p className="text-[#64748B]">
                  Your password has been successfully changed. You can now login with your new password.
                </p>
              </motion.div>
              
              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <p className="text-sm text-[#64748B]">
                  Redirecting to login in <span className="font-semibold text-[#2A7A8C]">3 seconds...</span>
                </p>
                
                {/* Progress bar */}
                <div className="mt-4 h-1.5 bg-[#EAF4F6] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#2A7A8C] to-[#3B8FA1] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </div>
              </motion.div>
              
              {/* Manual redirect button */}
              <motion.button
                onClick={() => onNavigate('login')}
                className="text-[#2A7A8C] hover:text-[#1F5F6E] font-medium hover:underline transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Go to Login Now →
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
