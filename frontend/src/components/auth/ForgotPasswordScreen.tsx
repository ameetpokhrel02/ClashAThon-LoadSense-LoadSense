import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2, Mail, ArrowLeft } from "lucide-react"
import childrenImage from "@/assets/childenjooying.png"

interface ForgotPasswordScreenProps {
  onNavigate: (screen: string) => void
  onSubmit: (email: string) => void
}

export default function ForgotPasswordScreen({ onNavigate, onSubmit }: ForgotPasswordScreenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email) {
      setError("Please enter your email address")
      setIsLoading(false)
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      onSubmit(email)
    } catch (err) {
      setError("Failed to send reset code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-br from-[#FFF8F5] via-[#FFF5F0] to-[#FFEDE5]">
      {/* Left Panel - Image & Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#2A7A8C] via-[#3B8FA1] to-[#1F5F6E] p-12 text-white relative overflow-hidden">
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-orange-400/5 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-500/10 rounded-full blur-3xl" />
        
        {/* Logo */}
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
        
        {/* Hero Image - Large & Centered */}
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
                <span className="text-amber-300">Recovery</span>
              </h1>
              <p className="text-white/70 text-base">
                We'll help you reset it quickly.
              </p>
            </div>
          </motion.div>
        </div>
        
        <div className="text-sm text-white/50 relative z-10">
          © 2026 LoadSense. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-r from-[#2A7A8C] to-[#3B8FA1] p-2 rounded-xl shadow-lg shadow-[#2A7A8C]/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#0F172A]">
              Load<span className="text-[#2A7A8C]">Sense</span>
            </span>
          </div>

          <Card className="bg-white shadow-2xl shadow-[#2A7A8C]/10 border border-[#E2E8F0] rounded-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold text-[#0F172A]">Forgot your password?</CardTitle>
              <CardDescription className="text-[#64748B]">
                Enter your email address and we'll send you a verification code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <motion.div 
                    className="text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {error}
                  </motion.div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#0F172A] font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="student@university.edu" 
                      className="pl-11 h-12 rounded-xl bg-white border-[#DCEFF2] focus:border-[#2A7A8C] focus:ring-[#2A7A8C]/20" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-[#2A7A8C] to-[#3B8FA1] hover:from-[#1F5F6E] hover:to-[#2A7A8C] shadow-lg shadow-[#2A7A8C]/30 transition-all duration-300" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Send Reset Code"}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-[#64748B]">Remember your password?</span>
                </div>
              </div>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => onNavigate('login')}
                className="w-full h-11 rounded-xl text-base font-semibold border-2 border-[#2A7A8C] text-[#2A7A8C] hover:bg-[#EAF4F6] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
