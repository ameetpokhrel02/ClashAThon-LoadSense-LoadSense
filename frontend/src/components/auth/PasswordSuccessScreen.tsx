import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, CheckCircle, Sparkles, BookOpen, Pencil } from "lucide-react"
import childrenImage from "@/assets/childenjooying-Photoroom.png"

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
                <span className="text-gray-800 dark:text-white">Password</span>{" "}
                <span className="text-[#ff7400]">Updated!</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                You're all set.
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
          className="w-full max-w-md text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
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

          <Card className="bg-white dark:bg-gray-900 shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">
            <CardContent className="p-10 space-y-8">
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
                  <Sparkles className="w-8 h-8 text-[#ff7400]" />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Password Updated!</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Your password has been successfully changed. You can now login with your new password.
                </p>
              </motion.div>
              
              {/* Countdown */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-2"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Redirecting to login in <span className="font-semibold text-[#ff7400]">3 seconds...</span>
                </p>
                
                {/* Progress bar */}
                <div className="mt-4 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#ff7400] rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                  />
                </div>
              </motion.div>
              
              {/* Manual redirect button */}
              <motion.button
                onClick={() => onNavigate('login')}
                className="text-[#ff7400] hover:text-[#e66800] font-medium hover:underline transition-colors"
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
