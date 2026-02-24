import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Loader2, Mail, Lock, BookOpen, Pencil, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { handleApiError } from "@/lib/api"
import childrenImage from "@/assets/childenjooying-Photoroom.png"

interface LoginScreenProps {
  onLogin: () => void
  onNavigate: (screen: string) => void
}

export default function LoginScreen({ onLogin, onNavigate }: LoginScreenProps) {
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setAuth(
        { id: '1', firstName: 'Alex', lastName: 'Student', email },
        'mock-jwt-token-123'
      )
      onLogin()
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
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
        <div className="absolute top-1/2 right-8 opacity-30">
          <motion.div
            animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          >
            <Pencil className="w-6 h-6 text-[#ff7400]/60" />
          </motion.div>
        </div>
        
        {/* Logo */}
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
        
        {/* Hero Image - Large & Centered with Orange Glow */}
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
            
            {/* Main Image */}
            <div className="relative">
              <img 
                src={childrenImage}
                alt="Students enjoying learning"
                className="w-full h-auto relative z-10 object-contain scale-110 drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(255, 116, 0, 0.25))' }}
              />
            </div>
            
            {/* Text Below Image */}
            <motion.div 
              className="text-center mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#1a1a2e]">Smart</span>{" "}
                <span className="text-[#ff7400]">Workload</span>
              </h1>
              <p className="text-[#64748B] text-lg">
                Plan smarter, avoid burnout.
              </p>
            </motion.div>
          </motion.div>
        </div>
        
        <div className="p-8 text-sm text-[#64748B] relative z-10">
          © 2026 LoadSense. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-[#FAFBFC] to-[#F5F7FA]">
        <motion.div 
          className="w-full max-w-md"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-br from-[#ff7400] to-[#ff8c33] p-2 rounded-xl shadow-lg shadow-[#ff7400]/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#1a1a2e]">
              Load<span className="text-[#ff7400]">Sense</span>
            </span>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl shadow-black/5 border-0 rounded-3xl">
            <CardHeader className="space-y-1 pb-4 pt-8 px-8">
              <CardTitle className="text-2xl font-bold text-[#1a1a2e]">Welcome back</CardTitle>
              <CardDescription className="text-[#64748B]">
                Enter your email and password to access your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 px-8 pb-8">
              <form onSubmit={handleSignIn} className="space-y-5">
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
                  <Label htmlFor="email" className="text-[#1a1a2e] font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="student@university.edu" 
                      className="pl-12 h-12 rounded-xl bg-[#f8fafc] border-[#e2e8f0] focus:border-[#ff7400] focus:ring-[#ff7400]/20 transition-all" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[#1a1a2e] font-medium">Password</Label>
                    <button 
                      type="button"
                      onClick={() => onNavigate('forgot-password')}
                      className="text-sm text-[#ff7400] hover:text-[#e66800] font-medium hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94a3b8]" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-12 pr-12 h-12 rounded-xl bg-[#f8fafc] border-[#e2e8f0] focus:border-[#ff7400] focus:ring-[#ff7400]/20 transition-all" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#ff7400] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-[#ff7400] to-[#ff8c33] hover:from-[#e66800] hover:to-[#ff7400] text-white shadow-lg shadow-[#ff7400]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#ff7400]/40 hover:-translate-y-0.5" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#e2e8f0]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white/80 px-4 text-[#94a3b8]">Don't have an account?</span>
                </div>
              </div>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => onNavigate('register')}
                className="w-full h-12 rounded-xl text-base font-semibold border-2 border-[#ff7400] text-[#ff7400] hover:bg-[#fff5eb] transition-all duration-300"
              >
                Register Now
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
